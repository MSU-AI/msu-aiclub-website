"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Coins, ChevronRight } from "lucide-react";
import { User } from '@supabase/supabase-js';

interface PointsBannerProps {
  onOpenRedemption: () => void;
  user: User;
  redeemablePoints: number;
}

const PointsBanner: React.FC<PointsBannerProps> = ({ onOpenRedemption, user, redeemablePoints }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nextTier, setNextTier] = useState({ points: 0, discount: 0 });

  useEffect(() => {
    // Calculate next tier
    const tiers = [
      { points: 200, discount: 5 },
      { points: 500, discount: 15 },
      { points: 800, discount: 25 },
      { points: 1000, discount: 40 },
      { points: 2000, discount: 80 },
      { points: 3000, discount: 100 }
    ];
    
    const nextTierData = tiers.find(tier => tier.points > redeemablePoints) || 
                        { points: 3000, discount: 100 };
    setNextTier(nextTierData);
  }, [redeemablePoints]);

  // Calculate progress to next tier
  const calculateProgress = () => {
    if (redeemablePoints >= 3000) return 100;
    
    let prevTierPoints = 0;
    const tiers = [0, 200, 500, 800, 1000, 2000, 3000];
    
    for (let i = 0; i < tiers.length; i++) {
      if (tiers[i] > redeemablePoints) {
        prevTierPoints = tiers[i-1];
        break;
      }
    }
    
    const pointsInCurrentTier = redeemablePoints - prevTierPoints;
    const tierSize = nextTier.points - prevTierPoints;
    
    return Math.round((pointsInCurrentTier / tierSize) * 100);
  };

  // Points needed for next tier
  const pointsNeeded = Math.max(0, nextTier.points - redeemablePoints);

  if (isLoading) {
    return (
      <div className="w-full h-16 animate-pulse bg-muted rounded-lg"></div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <Coins className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="font-medium">You have <span className="font-bold">{redeemablePoints} points</span> to redeem!</h3>
          </div>
          
          {pointsNeeded > 0 ? (
            <p className="text-sm mb-2">
              You're just <span className="font-semibold">{pointsNeeded} points</span> away from a <span className="font-semibold">{nextTier.discount}%</span> discount!
            </p>
          ) : (
            <p className="text-sm mb-2">
              You've reached the maximum discount tier! Redeem now for 100% off!
            </p>
          )}
          
          <div className="w-full">
            <Progress value={calculateProgress()} className="h-2" />
            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
              {redeemablePoints >= 3000 ? (
                <span>Maximum tier reached!</span>
              ) : (
                <>
                  <span>{redeemablePoints} points</span>
                  <span>{nextTier.points} points</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <Button 
          onClick={onOpenRedemption} 
          className="whitespace-nowrap"
        >
          Redeem Points
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PointsBanner;
