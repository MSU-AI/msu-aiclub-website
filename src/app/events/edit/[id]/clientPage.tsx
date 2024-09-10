"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { editEvent } from '~/server/actions/event';
import { getEventById } from '~/server/db/queries/events';
import { Checkbox } from '~/components/ui/checkbox';


interface EventQuestion {
  id?: string;
  question: string;
  required: boolean;
}


export default function ClientEditEventPage({ 
    params,
    event
}: { 
    params: { id: string },
    event: any
}) {
  const router = useRouter();

  const [title, setTitle] = useState(event?.title || '');
  const [photo, setPhoto] = useState(event?.photo || '');
  const [time, setTime] = useState(event?.time || '');
  const [place, setPlace] = useState(event?.place || '');
  const [points, setPoints] = useState(event?.points.toString() || '');
  const [questions, setQuestions] = useState(event?.questions || []);
  
  const editor = useCreateBlockNote();

  useEffect(() => {
    if (event?.description) {
      const loadInitialContent = async () => {
        const blocks = await editor.tryParseHTMLToBlocks(event.description ?? '');
        editor.replaceBlocks(editor.document, blocks);
      };
      loadInitialContent();
    }
  }, [editor, event]);

  if (!event) return <div className='flex justify-center items-center'>Event not found</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const description = await editor.blocksToHTMLLossy(editor.document);
    
    const convertedTime = typeof time === 'string' ? new Date(time) : time;
    
    await editEvent(
      event.id, 
      title, 
      photo, 
      description, 
      convertedTime, 
      place, 
      Number(points),
      questions.filter((q: EventQuestion) => q.question.trim() !== '')
    );
    router.push('/events');
  };

  const handleQuestionChange = (index: number, field: 'question' | 'required', value: string | boolean) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', required: false }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
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
                <div className="space-y-4">
          <h2 className="text-xl font-semibold">Event Questions</h2>
          {questions.map((q, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Question"
                value={q.question}
                onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              />
              <Checkbox
                checked={q.required}
                onCheckedChange={(checked) => handleQuestionChange(index, 'required', checked)}
              />
              <span>Required</span>
              <Button type="button" onClick={() => removeQuestion(index)}>Remove</Button>
            </div>
          ))}
          <Button type="button" onClick={addQuestion}>Add Question</Button>
        </div>
        
        <Button type="submit">Update Event</Button>
      </form>
    </div>
  );
}
