import Link from 'next/link';
import { Button } from "~/components/ui/button";
import { EventCard } from './eventCard';
import { eventsData } from './data';


export default function EventsPage() {
  const isAdmin =  true; // yo chage this to act admin check

  return (
    <div className="max-w-[1024px] mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        {isAdmin && (
          <Link href="/events/create">
            <Button>Create Event</Button>
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsData.map((event) => (
          <EventCard key={event.id} event={event} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}
