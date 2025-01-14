import { createClient } from "~/utils/supabase/server";
import { ClientProfile } from "./clientProfile";
import { getUserPoints } from "~/server/db/queries/user";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>You must be logged in to view your profile.</div>;
  }

  const points = await getUserPoints(user.id);

  return (
    <ClientProfile 
      userMetadata={user.user_metadata} 
      points={points} 
    />
  );
}
