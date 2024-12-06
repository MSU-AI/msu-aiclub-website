"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { editEvent } from '~/server/actions/event';
import { uploadImage } from '~/server/actions/helpers';
import { getEventById } from '~/server/db/queries/events';
import { Checkbox } from '~/components/ui/checkbox';
import { Image } from "lucide-react";
import { toast } from "react-hot-toast";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(event?.title || '');
  const [photo, setPhoto] = useState(event?.photo || '');
  const [isUploading, setIsUploading] = useState(false);
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadedUrl = await uploadImage(formData);
      setPhoto(uploadedUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const description = await editor.blocksToHTMLLossy(editor.document);
    
    const convertedTime = typeof time === 'string' ? new Date(time) : time;
    
    try {
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
      toast.success('Event updated successfully!');
      router.push('/events');
    } catch (error) {
      toast.error('Failed to update event');
      console.error('Error updating event:', error);
    }
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
    <div className="max-w-[1024px] mx-auto py-8 px-4 pt-28">
      <h1 className="text-2xl font-bold mb-6">Edit Event: {event.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Event Image
          </label>
          <div 
            onClick={triggerFileInput}
            className={`
              border-2 border-dashed rounded-lg p-6
              ${photo ? 'border-green-500' : 'border-gray-300'}
              hover:border-gray-400 cursor-pointer
              transition-colors duration-200
              flex flex-col items-center justify-center
              ${isUploading ? 'opacity-50' : ''}
            `}
          >
            {!photo && (
              <div className="text-center">
                <Image className="mx-auto mb-4 w-12 h-12 text-gray-400" />
                <div className="mb-2 text-sm font-medium">
                  {isUploading ? 'Uploading...' : 'Click to upload event image'}
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
            
            {photo && !isUploading && (
              <div className="relative group w-full">
                <img
                  src={photo}
                  alt="Event preview"
                  className="w-full h-48 object-cover rounded"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded">
                  <p className="text-white text-sm">Click to change image</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-y-auto rounded border">
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={q.required}
                  onCheckedChange={(checked) => handleQuestionChange(index, 'required', checked)}
                />
                <span>Required</span>
              </div>
              <Button 
                type="button" 
                onClick={() => removeQuestion(index)}
                variant="destructive"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addQuestion}>Add Question</Button>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isUploading}
        >
          Update Event
        </Button>
      </form>
    </div>
  );
}
