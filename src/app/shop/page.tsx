import { Suspense } from 'react';
import { createClient } from '~/utils/supabase/server';
import { getUserPoints } from '~/server/db/queries/user';
import ShopPageClient from './clientPage';
import { getRedeemablePoints } from '~/server/actions/redemptions';

export default async function ShopPage() {
  // Get user from Supabase
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get user points if logged in
  let userPointsData = null;
  let redeemablePoints = 0;
  
  if (user) {
    userPointsData = await getUserPoints(user.id);
    const pointsData = await getRedeemablePoints(user.id);
    redeemablePoints = pointsData.redeemablePoints;

    console.log(`user points from get redeamable points ${JSON.stringify(redeemablePoints)}`)
  }
  
  return (
    <Suspense fallback={<div className="pt-24 px-4">Loading shop...</div>}>
      <ShopPageClient 
        user={user || null} 
        points={userPointsData} 
        redeemablePoints={redeemablePoints}
      />
    </Suspense>
  );
}
