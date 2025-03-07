import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { pointRedemptions } from '~/server/db/schema';
import { createClient } from '~/utils/supabase/server';

export async function POST(request: Request) {
  try {
    // Get the discount code and status from the request
    const { discountCode, status } = await request.json();
    
    if (!discountCode) {
      return NextResponse.json({ success: false, error: 'Discount code is required' }, { status: 400 });
    }
    
    // Authenticate the user (optional if you want to verify the user owns the code)
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error when tracking discount code:', error);
      // Continue even if not authenticated, but log the error
    }
    
    // Find the redemption with this code
    const redemption = await db.query.pointRedemptions.findFirst({
      where: eq(pointRedemptions.discountCode, discountCode),
    });
    
    if (!redemption) {
      return NextResponse.json({ success: false, error: 'Discount code not found' }, { status: 404 });
    }
    
    // Update the status based on the action
    let newStatus = redemption.status;
    let usedAt = redemption.usedAt;
    
    switch (status) {
      case 'applied':
        // Code is being applied to cart
        newStatus = 'applied';
        break;
      case 'used':
        // Code was used in a completed checkout
        newStatus = 'used';
        usedAt = new Date();
        break;
      case 'active':
        // Reset to active (e.g., removed from cart)
        newStatus = 'active';
        break;
      default:
        break;
    }
    
    // Update the redemption record
    await db.update(pointRedemptions)
      .set({ 
        status: newStatus,
        usedAt: usedAt
      })
      .where(eq(pointRedemptions.discountCode, discountCode));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking discount code usage:', error);
    return NextResponse.json({ success: false, error: 'Failed to track discount code usage' }, { status: 500 });
  }
}
