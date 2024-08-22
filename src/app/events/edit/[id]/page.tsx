"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { eventsData } from '../../data';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const event = eventsData.find(e => e.id === params.id);

  const [title, setTitle] = useState(event?.title || '');
  const [photo, setPhoto] = useState(event?.photo || '');
  const [time, setTime] = useState(event?.time || '');
  const [place, setPlace] = useState(event?.place || '');
  const [points, setPoints] = useState(event?.points.toString() || '');
  
  const editor = useCreateBlockNote();

  useEffect(() => {
    if (event?.description) {
      const loadInitialContent = async () => {
        const blocks = await editor.tryParseHTMLToBlocks(event.description);
        editor.replaceBlocks(editor.document, blocks);
      };
      loadInitialContent();
    }
  }, [editor, event]);

  if (!event) return <div>Event not found</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const description = await editor.blocksToHTMLLossy(editor.document);
    // Here you would typically send this data to your backend
    console.log({ id: event.id, title, photo, description, time, place, points });
    router.push('/events');
  };

  return (
    <div className="max-w-[1024px] mx-auto py-8 px-4  pt-28">
      <h1 className="text-2xl font-bold mb-6">Edit Event: {event.title}</h1>
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
        <Button type="submit">Update Event</Button>
      </form>
    </div>
  );
}
