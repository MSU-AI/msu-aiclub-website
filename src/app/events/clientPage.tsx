"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "~/components/ui/button";
import { EventCard } from './eventCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

export function EventsPageClient({ events, isAdmin }) {
  const [filter, setFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    if (filter === 'visible') return !event.hidden;
    if (filter === 'hidden') return event.hidden;
    return true;
  });

  return (
    <div className="max-w-[1024px] mx-auto py-8 px-4 pt-28">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <>
              <Select 
                defaultValue="all" 
                onValueChange={(value) => setFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="visible">Visible Events</SelectItem>
                  <SelectItem value="hidden">Hidden Events</SelectItem>
                </SelectContent>
              </Select>
              <Link href="/events/create">
                <Button>Create Event</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} isAdmin={isAdmin} />
        ))}
      </div>
    </div>
  );
}
