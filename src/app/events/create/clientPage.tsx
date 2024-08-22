"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { createEvent } from '~/server/actions/event';

export default function CreateEventPageClient() {
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [points, setPoints] = useState('');
  const [code, setCode] = useState('');
  
  const router = useRouter();
  const editor = useCreateBlockNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const description = await editor.blocksToHTMLLossy(editor.document);
    const eventId = await createEvent(title, description, new Date(time), place, Number(points), photo, code);

    if (eventId === null) {
      console.log("Invalid event data");
      return;
    }
    
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="max-w-[1024px] mx-auto py-8 px-4 pt-28">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Input
          placeholder="Photo URL"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
        />
        <div className="overflow-y-auto rounded">
          <BlockNoteView editor={editor} />
        </div>
        <Input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <Input
          placeholder="Place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <Button type="submit">Create Event</Button>
      </form>
    </div>
  );
}
