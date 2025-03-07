"use client";

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "~/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "~/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { useToast } from "~/components/ui/use-toast";
import { 
  getRedemptionSuggestions, 
  getRedemptionHistory, 
  redeemPoints 
} from "~/server/actions/redemptions";
import { AlarmClock, CheckCircle2, Copy, Gift, Info, TicketPercent } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface RedemptionSuggestion {
  points: number;
  discountValue: number;
  expiryDays: number;
}

interface Redemption {
  id: string;
  discountCode: string;
  discountValue: number;
  points: number;
  status: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt: Date | null;
}

export default function PointsRedemption() {
  const [suggestions, setSuggestions] = useState<RedemptionSuggestion[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [redeemablePoints, setRedeemablePoints] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [customPoints, setCustomPoints] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [redemptionResult, setRedemptionResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("redeem");
  const { toast } = useToast();

  // Fetch suggestions and history on mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const { suggestions, redeemablePoints } = await getRedemptionSuggestions();
        setSuggestions(suggestions || []);
        setRedeemablePoints(redeemablePoints || 0);
        
        const { redemptions } = await getRedemptionHistory();
        setRedemptions(redemptions || []);
      } catch (error) {
        console.error("Error fetching redemption data:", error);
        toast({
          title: "Error",
          description: "Failed to load redemption options",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [toast]);

  // Calculate discount from points
  const calculateDiscount = (points: number) => {
    if (points < 200) return 0;
    if (points >= 3000) return 100;
    if (points >= 2000) return 80;
    
    // Linear interpolation between min and max discount
    const pointRange = 2000 - 200;
    const discountRange = 80 - 5;
    
    const percentage = ((points - 200) / pointRange) * discountRange + 5;
    
    // Round to nearest whole percentage
    return Math.round(percentage);
  };

  const handleSelectSuggestion = (suggestion: RedemptionSuggestion) => {
    setSelectedPoints(suggestion.points);
    setDiscountValue(suggestion.discountValue);
    setCustomPoints(suggestion.points.toString());
  };

  const handleCustomPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomPoints(value);
    
    const pointsValue = parseInt(value, 10) || 0;
    setSelectedPoints(pointsValue);
    setDiscountValue(calculateDiscount(pointsValue));
  };

  const handleSliderChange = (value: number[]) => {
    const pointsValue = value[0];
    setSelectedPoints(pointsValue);
    setCustomPoints(pointsValue.toString());
    setDiscountValue(calculateDiscount(pointsValue));
  };

  const handleRedeemPoints = async () => {
      if (selectedPoints < 200) {
          toast({
              title: "Invalid amount",
              description: "You need at least 200 points to redeem",
              variant: "destructive",
          });
          return;
      }

      if (selectedPoints > redeemablePoints) {
          toast({
              title: "Not enough points",
              description: "You don't have enough points for this redemption",
                  variant: "destructive",
          });
          return;
      }

      setIsRedeeming(true);
      try {
          const result = await redeemPoints(selectedPoints);

          if (result.success) {
              // Show success dialog with code details
              setRedemptionResult(result);
              setShowSuccessDialog(true);

              // Refresh data
              const { suggestions, redeemablePoints } = await getRedemptionSuggestions();
              setSuggestions(suggestions || []);
              setRedeemablePoints(redeemablePoints || 0);

              const { redemptions } = await getRedemptionHistory();
              setRedemptions(redemptions || []);

              // Reset form
              setSelectedPoints(0);
              setDiscountValue(0);
              setCustomPoints("");

              // Call the success callback if provided
              if (onRedeemSuccess) {
                  onRedeemSuccess();
              }
          } else {
              toast({
                  title: "Redemption failed",
                  description: result.error || "Failed to redeem points",
                  variant: "destructive",
              });
          }
      } catch (error) {
          console.error("Error redeeming points:", error);
          toast({
              title: "Error",
              description: "Failed to redeem points",
              variant: "destructive",
          });
      } finally {
          setIsRedeeming(false);
      }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Discount code copied to clipboard",
    });
  };

  // Render redemption status badge
  const renderStatusBadge = (status: string, expiresAt: Date) => {
    const now = new Date();
    const isExpired = expiresAt < now;
    
    if (status === "used") {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Used
        </Badge>
      );
    }
    
    if (isExpired) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          Expired
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Active
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TicketPercent className="mr-2 h-5 w-5" />
          Points Redemption
        </CardTitle>
        <CardDescription>
          Redeem your points for discounts in the AI Club shop
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="redeem">Redeem Points</TabsTrigger>
          <TabsTrigger value="history">Redemption History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="redeem">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : redeemablePoints < 200 ? (
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Not enough points</AlertTitle>
                <AlertDescription>
                  You need at least 200 points to redeem for a discount. Keep participating in club events to earn more points!
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Available Points</h3>
                  <span className="text-lg font-bold">{redeemablePoints}</span>
                </div>
                
                <div className="space-y-6">
                  {/* Suggested redemption options */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Suggested Redemptions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant={selectedPoints === suggestion.points ? "default" : "outline"}
                          className="h-auto flex flex-col py-3 px-2"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          <span className="text-xl font-bold">{suggestion.discountValue}%</span>
                          <span className="text-xs mt-1">{suggestion.points} Points</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom redemption amount */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Custom Amount</h3>
                    <div className="space-y-3">
                      <div>
                        <Slider
                          value={[selectedPoints]}
                          min={0}
                          max={Math.min(redeemablePoints, 3000)}
                          step={100}
                          onValueChange={handleSliderChange}
                          className="mb-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>1000</span>
                          <span>2000</span>
                          <span>3000</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={customPoints}
                            onChange={handleCustomPointsChange}
                            placeholder="Enter points"
                          />
                        </div>
                        <div className="w-24 bg-muted rounded-md flex items-center justify-center font-medium">
                          {discountValue}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
          <CardFooter className="pt-3 justify-between">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("history")}
            >
              View History
            </Button>
            
            <Button
              disabled={isLoading || isRedeeming || selectedPoints < 200 || selectedPoints > redeemablePoints}
              onClick={handleRedeemPoints}
            >
              {isRedeeming ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
              ) : (
                <>
                  Redeem {selectedPoints} Points
                </>
              )}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="history">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : redemptions.length === 0 ? (
              <div className="text-center py-6">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-medium">No redemptions yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Redeem your points to get discount codes for the AI Club shop
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {redemptions.map((redemption) => (
                  <div 
                    key={redemption.id} 
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">{redemption.discountValue}% Discount</h4>
                          <div className="ml-2">
                            {renderStatusBadge(redemption.status, redemption.expiresAt)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Redeemed for {redemption.points} points
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(redemption.discountCode)}
                        className="h-8"
                        disabled={redemption.status === "used" || redemption.expiresAt < new Date()}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    
                    <div className="bg-muted rounded-md px-3 py-2 flex items-center justify-between">
                      <code className="text-sm font-mono">{redemption.discountCode}</code>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <AlarmClock className="h-3 w-3 mr-1" />
                        {redemption.expiresAt < new Date() 
                          ? "Expired on " + format(redemption.expiresAt, "MMM d, yyyy")
                          : "Expires " + formatDistanceToNow(redemption.expiresAt, { addSuffix: true })}
                      </div>
                      <div>
                        {format(redemption.createdAt, "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab("redeem")}
              className="w-full"
            >
              Back to Redemption
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              Points Redeemed Successfully
            </DialogTitle>
            <DialogDescription>
              Your discount code is ready to use in the AI Club shop
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Discount Value</span>
                <span className="font-medium">{redemptionResult?.discountValue}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Points Used</span>
                <span className="font-medium">{redemptionResult?.pointsRedeemed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Expires</span>
                <span className="font-medium">
                  {redemptionResult?.expiresAt 
                    ? format(new Date(redemptionResult.expiresAt), "MMM d, yyyy")
                    : "N/A"}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Discount Code</label>
              <div className="flex">
                <div className="bg-muted rounded-l-md px-3 py-2 flex-1 font-mono">
                  {redemptionResult?.code}
                </div>
                <Button 
                  variant="outline" 
                  className="rounded-l-none"
                  onClick={() => redemptionResult?.code && copyToClipboard(redemptionResult.code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowSuccessDialog(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setShowSuccessDialog(false);
                window.location.href = '/shop';
              }}
            >
              Shop Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
