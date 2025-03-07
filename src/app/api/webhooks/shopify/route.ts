import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { pointRedemptions } from '~/server/db/schema';
import crypto from 'crypto';

/**
 * Validate Shopify webhook request
 */
function isValidShopifyRequest(request: Request, rawBody: string): boolean {
  const hmacHeader = request.headers.get('x-shopify-hmac-sha256');
  
  if (!hmacHeader) return false;
  
  const shopifySecret = process.env.SHOPIFY_WEBHOOK_SECRET;
  
  if (!shopifySecret) {
    console.error('SHOPIFY_WEBHOOK_SECRET is not defined in environment variables');
    return false;
  }
  
  const hash = crypto
    .createHmac('sha256', shopifySecret)
    .update(rawBody)
    .digest('base64');
  
  return hash === hmacHeader;
}

export async function POST(request: Request) {
  // Clone the request to read the body as text for HMAC validation
  const clone = request.clone();
  const rawBody = await clone.text();
  
  // Verify Shopify webhook signature
  if (!isValidShopifyRequest(request, rawBody)) {
    console.error('Invalid Shopify webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  try {
    // Parse the webhook payload
    const payload = JSON.parse(rawBody);
    const topic = request.headers.get('x-shopify-topic');
    
    // We're interested in order creation (checkout completion)
    if (topic === 'orders/create') {
      // Extract discount codes used in the order
      const discountCodes = payload.discount_codes || [];
      
      // For each discount code used in the order
      for (const discount of discountCodes) {
        const code = discount.code;
        
        // Find if this is one of our redemption codes
        const redemption = await db.query.pointRedemptions.findFirst({
          where: eq(pointRedemptions.discountCode, code),
        });
        
        if (redemption) {
          // Update the redemption status to 'used'
          await db.update(pointRedemptions)
            .set({ 
              status: 'used',
              usedAt: new Date()
            })
            .where(eq(pointRedemptions.discountCode, code));
            
          console.log(`Discount code ${code} marked as used`);
        }
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Shopify webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
