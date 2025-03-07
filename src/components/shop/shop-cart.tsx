'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetClose,
} from '~/components/ui/sheet';
import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Trash2, Plus, Minus, ShoppingBag, Ticket, AlertCircle } from 'lucide-react';
import { useToast } from '~/components/ui/use-toast';
import ShopifyClient from '~/utils/shopify';
import { ShopifyCart, ShopifyCartItem } from '~/types/products';
import { Input } from '~/components/ui/input';
import { Alert, AlertDescription } from '~/components/ui/alert';

interface ShopCartProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ShopCart: React.FC<ShopCartProps> = ({ isOpen: propIsOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(propIsOpen || false);
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Listen for cart:open events
  useEffect(() => {
    const handleOpenCart = () => {
      setIsOpen(true);
    };
    
    window.addEventListener('cart:open', handleOpenCart);
    
    return () => {
      window.removeEventListener('cart:open', handleOpenCart);
    };
  }, []);

  // Update isOpen if the prop changes
  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
    }
  }, [propIsOpen]);
  
  // Fetch cart when opened
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);
  
  const fetchCart = async () => {
    try {
      const shopifyClient = ShopifyClient.getInstance();
      const currentCart = await shopifyClient.getCart();
      setCart(currentCart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };
  
  const updateCartItem = async (lineItemId: string, quantity: number) => {
    try {
      setIsUpdating(true);
      const shopifyClient = ShopifyClient.getInstance();
      await shopifyClient.updateCartItem(lineItemId, quantity);
      await fetchCart();
      
      // Dispatch cart updated event
      dispatchCartUpdatedEvent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const removeCartItem = async (lineItemId: string) => {
    try {
      setIsUpdating(true);
      const shopifyClient = ShopifyClient.getInstance();
      await shopifyClient.removeCartItem(lineItemId);
      await fetchCart();
      
      // Dispatch cart updated event
      dispatchCartUpdatedEvent();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not remove item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const applyDiscountCode = async () => {
    if (!discountCode.trim()) return;
    
    try {
      setIsApplyingDiscount(true);
      setDiscountError(null);
      
      const shopifyClient = ShopifyClient.getInstance();
      const result = await shopifyClient.applyDiscountCode(discountCode);
      
      if (result.success) {
        setDiscountCode('');
        await fetchCart();
      } else {
        setDiscountError(result.error || 'Invalid discount code');
      }
    } catch (error) {
      console.error('Error applying discount code:', error);
      setDiscountError('Failed to apply discount code');
    } finally {
      setIsApplyingDiscount(false);
    }
  };
 
  const removeDiscountCode = async () => {
    try {
      setIsApplyingDiscount(true);
      
      const shopifyClient = ShopifyClient.getInstance();
      await shopifyClient.removeDiscountCode();
      await fetchCart();
    } catch (error) {
      console.error('Error removing discount code:', error);
      toast({
        title: "Error",
        description: "Could not remove discount code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };
  
  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const shopifyClient = ShopifyClient.getInstance();
      const checkoutUrl = await shopifyClient.checkout();
      window.location.href = checkoutUrl;
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: "Could not proceed to checkout. Please try again.",
        variant: "destructive",
      });
      setIsCheckingOut(false);
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };
  
  const dispatchCartUpdatedEvent = () => {
    const event = new CustomEvent('cart:updated');
    window.dispatchEvent(event);
  };

  const isEmpty = !cart || !cart.lineItems || cart.lineItems.length === 0;
  
  // More thorough discount detection logic
  const hasDiscountCodes = cart?.discountCodes && cart.discountCodes.length > 0;
  const hasDiscountAmount = cart && parseFloat(cart.subtotalPrice) > parseFloat(cart.totalPrice);
  const hasLineItemDiscounts = cart?.lineItems?.some(item => item.discounts && item.discounts.length > 0);
  const hasDiscounts = hasDiscountCodes || hasDiscountAmount || hasLineItemDiscounts;
  
  // Calculate total discount from line items
  const totalLineItemDiscount = cart?.lineItems 
    ? cart.lineItems.reduce((total, item) => {
        const itemDiscount = item.discounts && item.discounts.length > 0 
          ? item.discounts.reduce((sum, discount) => sum + parseFloat(discount.amount), 0) 
          : 0;
        return total + itemDiscount;
      }, 0)
    : 0;
  
    return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" /> Your Shopping Cart
          </SheetTitle>
        </SheetHeader>
        
        {isUpdating ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-12">
            <div className="bg-muted rounded-full p-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg">Your cart is empty</h3>
            <p className="text-muted-foreground text-center">
              Looks like you haven't added anything to your cart yet.
            </p>
            <SheetClose asChild>
              <Button>Continue Shopping</Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart.lineItems.map((item: ShopifyCartItem) => (
                  <div key={item.id} className="py-3 border-b border-border">
                    {/* First row: Product image and title */}
                    <div className="flex mb-2">
                      <div className="relative h-16 w-16 rounded overflow-hidden mr-3">
                        {item.variant.image ? (
                          <Image
                            src={item.variant.image.src}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                            priority
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.title}</h4>
                        {item.variant.title !== 'Default Title' && (
                          <p className="text-sm text-muted-foreground truncate">
                            {item.variant.title}
                          </p>
                        )}
                        <p className="text-sm font-medium mt-1">
                          ${parseFloat(item.variant.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Second row: Quantity controls and delete button */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateCartItem(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                          disabled={isUpdating}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/20 hover:bg-destructive/5"
                        onClick={() => removeCartItem(item.id)}
                        disabled={isUpdating}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    </div>

                    {/* Removed the item-level discount display */}
                  </div>
                ))}
              </div>
              
              {/* Discount Code Section */}
              <div className="py-4 ">
                <h4 className="text-sm font-medium mb-3">Discount Code</h4>
                
                {hasDiscountCodes ? (
                  <div className="space-y-2">
                    {cart.discountCodes.map((discount, index) => (
                      <div key={index} className="bg-muted p-3 rounded-md flex justify-between items-center">
                        <div>
                          <div className="font-medium text-sm">{discount.code}</div>
                          <div className="text-xs text-green-600">
                            {discount.formattedValue || `Discount applied to order`}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={removeDiscountCode}
                          disabled={isApplyingDiscount}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 gap-2">
                      <Input
                        className="col-span-3"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="Enter discount code"
                        disabled={isApplyingDiscount}
                      />
                      <Button 
                        variant="outline"
                        onClick={applyDiscountCode}
                        disabled={!discountCode.trim() || isApplyingDiscount}
                      >
                        {isApplyingDiscount ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                    
                    {discountError && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {discountError}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            <SheetFooter className="flex flex-col border-t border-border pt-4 w-full">
              <div className="space-y-2 w-full">
                                
                {/* Show discount if there are line item discounts */}
                {hasLineItemDiscounts && totalLineItemDiscount > 0 && (
                  <div className="flex justify-between text-green-600 w-full">
                    <span className="flex items-center">
                      <Ticket className="h-3.5 w-3.5 mr-1" />
                      Order Discount
                    </span>
                    <span>-${totalLineItemDiscount.toFixed(2)} {cart.currencyCode}</span>
                  </div>
                )}
                
                {/* Total */}
                <div className="flex justify-between text-lg font-bold w-full">
                  <span>Total</span>
                  <span>${parseFloat(cart.totalPrice).toFixed(2)} {cart.currencyCode}</span>
                </div>
              </div>
              
              <div className='flex flex-col justify-between space-y-2 mt-4 w-full'>
                <Button 
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>

                <SheetClose asChild>
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ShopCart;
