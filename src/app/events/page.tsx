import { isAdmin } from "~/server/actions/auth";
import { getEvents } from '~/server/db/queries/events';
import { EventsPageClient } from './clientPage';

export default async function EventsPage() {
  const isUserAdmin = await isAdmin();
  const eventsData = await getEvents(isUserAdmin);
  const sortedEvents = eventsData.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return <EventsPageClient events={sortedEvents} isAdmin={isUserAdmin} />;
}
