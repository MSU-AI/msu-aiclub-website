"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Event } from './data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

export function EventCard({ event, isAdmin }: { event: Event; isAdmin: boolean }) {
  console.log("is admin", isAdmin);
  return (
    <div className="border rounded-lg overflow-hidden">
      {event.photo && (
        <Image src={event.photo} alt={event.title} width={300} height={200} className="w-full object-cover h-48" />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
        <p className="text-sm text-gray-500 mb-2">{new Date(event.time).toLocaleString()}</p>
        <p className="text-sm mb-2">{event.place}</p>
        <p className="text-sm font-bold">Points: {event.points}</p>
        <Link href={`/events/${event.id}`}>
          <Button className="mt-4 w-full">View Details</Button>
        </Link>
      </div>
      {isAdmin && (
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
