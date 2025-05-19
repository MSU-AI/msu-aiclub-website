"use client";

import { EventList } from './eventList';
import { Footer } from '~/components/landing/footer';

export function EventsPageClient({ events, isAdmin }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-16">
        <section className="py-24 bg-secondary/30">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Events</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay up to date with workshops, hackathons, and social events organized by the MSU AI Club.
            </p>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <EventList events={events} isAdmin={isAdmin} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
