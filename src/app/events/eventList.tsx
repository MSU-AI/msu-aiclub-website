"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff, LayoutGridIcon, LayoutListIcon, CalendarIcon, MapPinIcon } from "lucide-react";
import { toggleEventVisibility } from "~/server/actions/event";
import { Event } from './data';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface EventListProps {
  events: Event[];
  isAdmin: boolean;
}

export function EventList({ events, isAdmin }: EventListProps) {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEvents = events.filter(event => {
    if (filter === 'visible') return !event.hidden;
    if (filter === 'hidden') return event.hidden;
    return true;
  });

  const handleToggleVisibility = async (eventId: string) => {
    await toggleEventVisibility(eventId);
    router.refresh();
  };

  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get plain text from HTML content
  const getPlainText = (htmlContent: string) => {
    if (!htmlContent) return '';
    // Strip HTML tags and limit to 150 characters
    return htmlContent.replace(/<[^>]*>/g, '').substring(0, 150) + (htmlContent.length > 150 ? '...' : '');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex-grow">
          {isAdmin && (
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
          )}
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/events/create">
              <Button>Create Event</Button>
            </Link>
          )}
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? "default" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode('grid')} 
              className="rounded-none"
            >
              <LayoutGridIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? "default" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode('list')} 
              className="rounded-none"
            >
              <LayoutListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="flex justify-center items-center py-24 border border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground">No events found. Check back soon!</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden h-full flex flex-col relative">
              {event.hidden && isAdmin && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm z-10">
                  Hidden
                </div>
              )}
              
              <div className="w-full h-48 relative">
                {event.photo ? (
                  <Image 
                    src={event.photo}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-600">
                    <CalendarIcon className="h-10 w-10 mb-2 opacity-70" />
                    <p className="text-sm font-medium">Event Coming Soon</p>
                  </div>
                )}
              </div>
              
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    <Link href={`/events/${event.id}`}>{event.title}</Link>
                  </CardTitle>
                  <Badge className="self-start flex-shrink-0 mt-1">{event.points} points</Badge>
                </div>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{formatDate(event.time)}</span>
                </CardDescription>
                <CardDescription className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{event.place}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">
                  {getPlainText(event.description || '')}
                </p>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              </CardFooter>
              
              {isAdmin && (
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/events/edit/${event.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleVisibility(event.id)}>
                        {event.hidden ? (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Show Event</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            <span>Hide Event</span>
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="w-full border rounded-lg overflow-hidden">
              <div className="flex w-full justify-between">
                <Link href={`/events/${event.id}`} className="flex items-center w-full">
                  <div className="w-52 h-32 flex justify-center relative shrink-0">
                    {event.photo ? (
                      <Image 
                        src={event.photo}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200 text-slate-600">
                        <CalendarIcon className="h-6 w-6 mb-1 opacity-70" />
                        <p className="text-xs font-medium">Event Coming Soon</p>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl font-bold line-clamp-1 hover:text-primary transition-colors">{event.title}</h2>
                      <Badge>{event.points} points</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{getPlainText(event.description || '')}</p>
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(event.time)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{event.place}</span>
                      </div>
                    </div>
                    {event.hidden && isAdmin && (
                      <div className="inline-block bg-yellow-500 text-white px-2 py-1 rounded-full text-sm mt-2">
                        Hidden
                      </div>
                    )}
                  </div>
                </Link>
                {isAdmin && (
                  <div className="flex items-center p-4 gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/events/edit/${event.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleVisibility(event.id)}>
                          {event.hidden ? (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Show Event</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              <span>Hide Event</span>
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
