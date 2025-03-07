"use client";

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "~/components/ui/sheet";
import PointsRedemption from '~/components/shop/points-redemption';
import { ShoppingBag } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface RedemptionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const RedemptionDrawer: React.FC<RedemptionDrawerProps> = ({ isOpen, onClose, user }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="space-y-2 mb-6">
          <SheetTitle className="text-xl flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" /> Redeem Your Points
          </SheetTitle>
          <SheetDescription>
            Convert your AI Club points into discounts for the shop
          </SheetDescription>
        </SheetHeader>
        
        <div className="overflow-y-auto pr-1" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          <PointsRedemption onRedeemSuccess={onClose} userId={user.id} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RedemptionDrawer;
