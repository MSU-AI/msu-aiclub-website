import { getEventById, getUserPoints } from "~/server/db/queries/events";
import EventPageClient from "./clientPage";
import { isAdmin } from "~/server/actions/auth";
import { createClient } from "~/utils/supabase/server";


export default async function EventPage({ 
  params 
}: { 
    params: { 
      id: string 
    } 
  }
) {
  const event = await getEventById(params.id);
  const isUserAdmin = await isAdmin();

  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  const points = await getUserPoints(user?.user?.id);

  console.log("points", points);

  console.log("event", event);

  if (!user.user) {
    return <div>You must be logged in to view this event</div>;
  }

  return (
  <EventPageClient 
    event={event} 
    isAdmin={isUserAdmin} 
    user={user.user}
    />
  );
    
}
