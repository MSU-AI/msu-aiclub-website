"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { MoreHorizontal, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { addUserToEvent, deleteEvent } from '~/server/actions/event';
import { submitAnswers } from '~/server/db/queries/questions';
import { toast } from "~/components/ui/use-toast";

const RegistrationStatus = ({ isRegistered }) => {
  if (isRegistered) {
    return (
      <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <span className="text-green-700 dark:text-green-300">You are registered for this event</span>
      </div>
    );
  }
  return null;
};

const LoginPrompt = () => (
  <Alert className="mb-6">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      Please log in to register for this event
    </AlertDescription>
  </Alert>
);

export default function EventPageClient({ 
    event,
    isAdmin,
    user,
    questions,
    signUpCount,
    isUserRegistered = false
}) {
    const [code, setCode] = useState('');
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const unansweredRequiredQuestions = questions
            .filter((q) => q.required && !answers[q.id]);

        if (unansweredRequiredQuestions.length > 0) {
            setError('Please answer all required questions.');
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please answer all required questions.",
            });
            return;
        }

        try {
            const eventId = await addUserToEvent(event.id, user.id, code);
            
            if (eventId === null) {
                setError("Invalid code");
                toast({
                    variant: "destructive",
                    title: "Invalid Code",
                    description: "Please check your registration code and try again.",
                });
                return;
            } else if (eventId === "already-registered") {
                setError("You are already registered for this event.");
                toast({
                    variant: "destructive",
                    title: "Already Registered",
                    description: "You're already registered for this event!",
                });
                return;
            }

            const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
                questionId,
                answer
            }));

            await submitAnswers(event.id, user.id, formattedAnswers);
            
            toast({
                title: "Success!",
                description: "🎉 Successfully registered for event!",
            });
            
            // Close dialog and refresh after successful registration
            setShowDialog(false);
            router.refresh();
            
        } catch (error) {
            console.error('Registration error:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while registering. Please try again.",
            });
            setError("An error occurred while registering. Please try again.");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            const out = await deleteEvent(event.id);
            if (!out) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to delete event.",
                });
            } else {
                toast({
                    title: "Success",
                    description: "Event deleted successfully.",
                });
                router.push('/events');
            }
        }
    };

    // Rest of the component remains the same...
    const getRegistrationButton = () => {
        if (!user) {
            return (
                <Button disabled className="opacity-50">
                    Log in to Register
                </Button>
            );
        }
        if (isUserRegistered) {
            return (
                <Button disabled className="bg-green-600">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Registered
                </Button>
            );
        }
        return (
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                    <Button>Register for Event</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Register for {event.title}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <Input
                            type="text"
                            placeholder="Enter registration code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        {questions?.map((question, index) => (
                            <div key={index} className="mt-4">
                                <p>{question.question} {question.required && <span className="text-red-500">*</span>}</p>
                                <Input
                                    type="text"
                                    placeholder="Enter answer"
                                    onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                                    required={question.required}
                                />
                            </div>
                        ))}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit">Submit</Button>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    return (
        <div className="max-w-[1024px] mx-auto py-8 px-4 relative pt-28">
            {isAdmin && (
                <div className="absolute top-4 right-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/events/edit/${event.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            {!user && <LoginPrompt />}
            <RegistrationStatus isRegistered={isUserRegistered} />

            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            {event.photo && (
                <Image 
                    src={event.photo} 
                    alt={event.title} 
                    width={800} 
                    height={400} 
                    className="w-full object-fill mb-6" 
                />
            )}
            
            <div className="prose dark:prose-invert mb-6 !text-foreground"
                dangerouslySetInnerHTML={{ __html: event.description }}
            />
            
            <div className="mb-6">
                <p><strong>Time:</strong> {new Date(event.time).toLocaleString()}</p>
                <p><strong>Place:</strong> {event.place}</p>
                <p><strong>Points:</strong> {event.points}</p>
                {isAdmin && (
                    <>
                        <p><strong>Code:</strong> {event.code}</p>
                        <p><strong>Number of Sign Ups:</strong> {signUpCount}</p>
                    </>
                )}
            </div>

            {getRegistrationButton()}
        </div>
    );
}
