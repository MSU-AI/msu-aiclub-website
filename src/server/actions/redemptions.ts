"use server";

import { randomUUID } from 'crypto';
import { db } from '~/server/db';
import { pointRedemptions } from '~/server/db/schema';
import { createClient } from '~/utils/supabase/server';
import { getUserPoints } from '~/server/db/queries/user';
import { revalidatePath } from 'next/cache';
import { desc, eq, sql } from 'drizzle-orm';

// Configuration for discount calculation
interface DiscountConfig {
  minPoints: number;        // Minimum points required for any discount
  maxPoints: number;        // Points needed for maximum discount
  fullDiscountPoints: number; // Points needed for 100% discount
  minDiscount: number;      // Minimum discount percentage
  maxDiscount: number;      // Maximum discount percentage
  pointStepSize: number;    // Step size for suggested redemption amounts
  expiryDays: number;       // How long discount codes remain valid
}

// System configuration
const DISCOUNT_CONFIG: DiscountConfig = {
  minPoints: 200,
  maxPoints: 2000,
  fullDiscountPoints: 3000,
  minDiscount: 5,
  maxDiscount: 80,
  pointStepSize: 100,
  expiryDays: 30
};

/**
 * Calculate discount percentage based on points
 */
function calculateDiscountPercentage(points: number): number {
  if (points < DISCOUNT_CONFIG.minPoints) return 0;
  if (points >= DISCOUNT_CONFIG.fullDiscountPoints) return 100;
  if (points >= DISCOUNT_CONFIG.maxPoints) return DISCOUNT_CONFIG.maxDiscount;
  
  // Linear interpolation between min and max discount
  const pointRange = DISCOUNT_CONFIG.maxPoints - DISCOUNT_CONFIG.minPoints;
  const discountRange = DISCOUNT_CONFIG.maxDiscount - DISCOUNT_CONFIG.minDiscount;
  
  const percentage = ((points - DISCOUNT_CONFIG.minPoints) / pointRange) * discountRange + DISCOUNT_CONFIG.minDiscount;
  
  // Round to nearest whole percentage
  return Math.round(percentage);
}

/**
 * Get suggested redemption amounts based on user's available points
 */
export async function getRedemptionSuggestions() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    return { suggestions: [], error: 'User not authenticated' };
  }
  
  // Get user's redeemable points
  const { redeemablePoints, error: pointsError } = await getRedeemablePoints(data.user.id);
  
  if (pointsError) {
    return { suggestions: [], error: pointsError };
  }
  
  if (redeemablePoints < DISCOUNT_CONFIG.minPoints) {
    return { 
      suggestions: [], 
      error: null, 
      message: `You need at least ${DISCOUNT_CONFIG.minPoints} points to redeem for a discount code.`,
      redeemablePoints
    };
  }
  
  // Generate suggestions
  const suggestions = [];
  const maxRedeemable = Math.min(redeemablePoints, DISCOUNT_CONFIG.fullDiscountPoints);
  
  // Milestone-based suggestions
  const milestones = [
    200,   // 2 workshops
    500,   // 5 workshops
    800,   // 8 workshops
    1000,  // 10 workshops
    1500,  // 15 workshops
    2000,  // 20 workshops
    3000   // 30 workshops (100% off)
  ];
  
  // Filter milestones that are redeemable by the user
  const redeemableMilestones = milestones.filter(m => m <= redeemablePoints);
  
  // Include the custom maximum if it doesn't match a milestoneredem
  if (redeemableMilestones.length > 0 && 
      redeemableMilestones[redeemableMilestones.length - 1] < redeemablePoints &&
      redeemablePoints < DISCOUNT_CONFIG.fullDiscountPoints) {
    redeemableMilestones.push(redeemablePoints);
  }
  
  // Generate suggestions from milestones
  suggestions.push(...redeemableMilestones.map(points => ({
    points,
    discountValue: calculateDiscountPercentage(points),
    expiryDays: DISCOUNT_CONFIG.expiryDays
  })));
  
  return { 
    suggestions, 
    error: null, 
    redeemablePoints 
  };
}

/**
 * Get redeemable points for a user (total points minus redeemed points)
 */
export async function getRedeemablePoints(userId: string) {
  try {
    // Get total points
    const userPoints = await getUserPoints(userId);
    
    // Get total redeemed points
    const redeemedPoints = await db
      .select({
        total: sql<number>`cast(sum(${pointRedemptions.points}) as int)`
      })
      .from(pointRedemptions)
      .where(eq(pointRedemptions.userId, userId));
    
    const totalRedeemedPoints = redeemedPoints[0]?.total ?? 0;
    
    // Calculate redeemable points
    const redeemablePoints = userPoints.totalPoints - totalRedeemedPoints;
    console.log(`redeemable points ${redeemablePoints}`);
    
    return { redeemablePoints, error: null };
  } catch (error) {
    console.error('Error getting redeemable points:', error);
    return { redeemablePoints: 0, error: 'Failed to get redeemable points' };
  }
}


/**
 * Get redemption history for a user
 */
export async function getRedemptionHistory() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    return { redemptions: [], error: 'User not authenticated' };
  }
  
  try {
    const redemptions = await db.query.pointRedemptions.findMany({
      where: (redemptions) => eq(redemptions.userId, data.user.id),
      orderBy: (redemptions) => desc(redemptions.createdAt)
    });
    
    console.log('Redemption history found:', redemptions.length, 'records');
    console.log('First redemption:', redemptions[0]); // Log the first redemption for debugging
    
    return { redemptions, error: null };
  } catch (error) {
    console.error('Error getting redemption history:', error);
    return { redemptions: [], error: 'Failed to get redemption history' };
  }
}

/**
 * Generate a discount code using Shopify's Admin API
 * This creates a cart-level discount that applies to the entire order
 */
async function generateShopifyDiscountCode(discountValue: number, expiryDays: number) {
  try {
    // Generate a unique discount code
    const uniqueCode = `AICLUB${discountValue}${randomUUID().substring(0, 6).toUpperCase()}`;
    
    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);
    
    const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
    
    // Create variables separately, following the exact schema structure
    const variables = {
      basicCodeDiscount: {
        title: `AI Club Points Redemption ${discountValue}% Off Order`,
        startsAt: new Date().toISOString(),
        endsAt: expiresAt.toISOString(),
        code: uniqueCode,
        customerSelection: {
          all: true
        },
        // Use the minimum requirement to ensure it's an order-level discount
        minimumRequirement: {
          subtotal: {
            greaterThanOrEqualToSubtotal: "0.01" // Any order with a value
          }
        },
        customerGets: {
          items: {
            all: true
          },
          value: {
            percentage: discountValue / 100
          }
        }
      }
    };
    
    const query = `
      mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
          codeDiscountNode {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN ?? ''
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    if (!response.ok) {
      console.error('Shopify API error:', response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return { code: null, expiresAt: null, error: `Failed to connect to Shopify API: ${response.status} ${response.statusText}` };
    }
    
    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return { code: null, expiresAt: null, error: 'GraphQL error from Shopify API' };
    }
    
    if (result.data.discountCodeBasicCreate.userErrors.length > 0) {
      console.error('Discount creation errors:', result.data.discountCodeBasicCreate.userErrors);
      return { code: null, expiresAt: null, error: 'Failed to create discount code' };
    }
    
    return {
      code: uniqueCode,
      expiresAt,
      error: null
    };
    
  } catch (error) {
    console.error('Error generating Shopify discount code:', error);
    return { code: null, expiresAt: null, error: 'Failed to generate discount code' };
  }
}

/**
 * Redeem points for a discount code
 */
export async function redeemPoints(pointsToRedeem: number) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    return { success: false, error: 'User not authenticated' };
  }
  
  // Validate points to redeem
  if (pointsToRedeem < DISCOUNT_CONFIG.minPoints) {
    return { 
      success: false, 
      error: `Minimum redemption amount is ${DISCOUNT_CONFIG.minPoints} points` 
    };
  }
  
  // Check if user has enough points
  const { redeemablePoints, error: pointsError } = await getRedeemablePoints(data.user.id);
  
  if (pointsError) {
    return { success: false, error: pointsError };
  }
  
  if (redeemablePoints < pointsToRedeem) {
    return { success: false, error: 'Not enough points for this redemption' };
  }
  
  // Calculate discount value
  const discountValue = calculateDiscountPercentage(pointsToRedeem);
  
  if (discountValue <= 0) {
    return { success: false, error: 'Invalid redemption amount' };
  }
  
  // Generate discount code
  const { code, expiresAt, error: discountError } = await generateShopifyDiscountCode(
    discountValue,
    DISCOUNT_CONFIG.expiryDays
  );
  
  if (discountError || !code || !expiresAt) {
    return { success: false, error: discountError || 'Failed to generate discount code' };
  }
  
  try {
    // Record the redemption
    await db.insert(pointRedemptions).values({
      userId: data.user.id,
      points: pointsToRedeem,
      discountCode: code,
      discountValue: discountValue,
      status: 'active',
      expiresAt
    });
    
    // Invalidate client cache
    revalidatePath('/profile');
    revalidatePath('/shop');
    
    return { 
      success: true, 
      error: null, 
      code,
      discountValue,
      expiresAt,
      pointsRedeemed: pointsToRedeem
    };
  } catch (error) {
    console.error('Error redeeming points:', error);
    return { success: false, error: 'Failed to redeem points' };
  }
}
