import { getEventById, getEventSignupCount, getUserPoints } from "~/server/db/queries/events";
import EventPageClient from "./clientPage";
import { isAdmin } from "~/server/actions/auth";
import { createClient } from "~/utils/supabase/server";
import { getQuestionsForEvent } from "~/server/db/queries/questions";


export default async function EventPage({ 
  params 
}: { 
    params: { 
      id: string 
    } 
  }
) {
  const event = await getEventById(params.id);
  const questions = await getQuestionsForEvent(event?.id);


  const signUpCount = await getEventSignupCount(event?.id);
  console.log("signUpCount", signUpCount);

  const isUserAdmin = await isAdmin();

  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
  <EventPageClient 
    event={event} 
    questions={questions}
    isAdmin={isUserAdmin} 
    user={user.user}
    signUpCount={signUpCount}
    />
  );
    
}
