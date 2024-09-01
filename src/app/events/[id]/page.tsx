import { getEventById, getUserPoints } from "~/server/db/queries/events";
import EventPageClient from "./clientPage";
import { isAdmin } from "~/server/actions/auth";
import { createClient } from "~/utils/supabase/server";
<<<<<<< HEAD
import { getQuestionsForEvent } from "~/server/db/queries/questions";
=======
import { Footer } from "~/components/landing/footer";
>>>>>>> 334309c7e0b8602dd4f2cf02652c9df331e030bb


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
  const isUserAdmin = await isAdmin();

  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
  <EventPageClient 
    event={event} 
    questions={questions}
    isAdmin={isUserAdmin} 
    user={user.user}
    />
  );
    
}
