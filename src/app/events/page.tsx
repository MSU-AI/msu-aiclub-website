import Link from 'next/link';
import { Button } from "~/components/ui/button";
import { EventCard } from './eventCard';
import { isAdmin, makeAdmin } from "~/server/actions/auth";
import { getEvents } from '~/server/db/queries/events';


export default async function EventsPage() {
  const isUserAdmin = await isAdmin();

  const eventsData = await getEvents();

  const sortedEvents = eventsData.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  console.log("is user admin", isUserAdmin);

  return (
    <div className="max-w-[1024px] mx-auto py-8 px-4 pt-28">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        {!isUserAdmin && (
          <Link href="/events/create">
            <Button>Create Event</Button>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.map((event) => (
          <EventCard key={event.id} event={event} isAdmin={isUserAdmin} />
        ))}
      </div>
    </div>
  );
}
