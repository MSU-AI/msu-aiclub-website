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
import { Checkbox } from '~/components/ui/checkbox';


interface EventQuestion {
  id?: string;
  question: string;
  required: boolean;
}

export default function CreateEventPageClient() {
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [points, setPoints] = useState('');
  const [code, setCode] = useState('');
  const [questions, setQuestions] = useState([{ question: '', required: false }]);

  
  const router = useRouter();
  const editor = useCreateBlockNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const description = await editor.blocksToHTMLLossy(editor.document);
    const eventId = await createEvent(
      title, 
      description, 
      new Date(time), 
      place, 
      Number(points), 
      photo, 
      code,
      questions.filter(q => q.question.trim() !== '')
    );

    if (eventId === null) {
      console.log("Invalid event data");
      return;
    }
    
    router.push(`/events/${eventId}`);
  };

  const handleQuestionChange = (index: number, field: keyof EventQuestion, value: string | boolean) => {
    const newQuestions = [...questions];
    if (field === 'question' && typeof value === 'string') {
      newQuestions[index]!.question = value;
    } else if (field === 'required' && typeof value === 'boolean') {
      newQuestions[index]!.required = value;
    }
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
        
        <Button type="submit">Create Event</Button>
      </form>
    </div>
  );
}
