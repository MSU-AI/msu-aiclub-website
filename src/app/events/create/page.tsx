import { isAdmin } from "~/server/actions/auth";
import { createClient } from "~/utils/supabase/server";
import CreateEventPageClient from "./clientPage";


export default async function CreateEventPage() {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();

  const isUserAdmin = await isAdmin();

  if (!user.user || !isUserAdmin) {
    return <div>You must be logged in to create an event</div>;
  }

  return (
    <CreateEventPageClient />
  )
}
