"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { likePost } from '~/server/actions/post';
import { Card, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { HeartFilledIcon, HeartIcon, ChatBubbleIcon, Pencil1Icon} from "@radix-ui/react-icons";
import { toast } from "~/components/ui/use-toast";
import '../create/postStyles.css';
import Link from 'next/link';


type PostData = {
  id: string;
  title: string;
  description: string;
  content: string;
  likes: number;
  thumbnailUrl: string | null;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    fullName?: string;
  } | null;
  liked: boolean;
  commentCount: number;
  comments: CommentData[];
};

type CommentData = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    fullName?: string;
  } | null;
  liked: boolean;
};

export default function PostContent({ initialPost }: { initialPost: PostData;}) {
  const [post, setPost] = useState(initialPost);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    
    // Optimistically update the UI
    setPost(prevPost => ({
      ...prevPost,
      liked: !prevPost.liked,
      likes: prevPost.liked ? prevPost.likes - 1 : prevPost.likes + 1
    }));

    try {
      await likePost(post.id);
    } catch (error) {
      // If the request fails, revert the optimistic update
      setPost(prevPost => ({
        ...prevPost,
        liked: !prevPost.liked,
        likes: prevPost.liked ? prevPost.likes - 1 : prevPost.likes + 1
      }));
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto py-8 pt-28">
      <Card className='bg-background border-none'>
        <CardHeader>
    {post.thumbnailUrl && (
          <div className="w-full aspect-w-16 aspect-h-9 relative overflow-hidden">
            <Image 
              src={post.thumbnailUrl} 
              alt={post.title} 
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}

          <CardTitle className="py-6 text-4xl">{post.title}</CardTitle>
          <CardDescription className="text-xl">
            {post.description}
          </CardDescription>
          <div className="text-sm text-gray-500">
            By {post.user?.fullName || 'AI Club'} on {new Date(post.createdAt).toLocaleDateString()}
          </div>
          <div className="flex gap-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className="flex items-center p-0"
              disabled={isLiking}
            >
              {post.liked ? <HeartFilledIcon className="text-red-500" /> : <HeartIcon />}
              <span className="ml-1">{post.likes}</span>
            </Button>
            <div className="flex items-center">
              <ChatBubbleIcon />
              <span className="ml-1">{post.commentCount}</span>
            </div>
          </div>
        </CardHeader>
                <div>
          <div 
            className="prose prose-lg prose-invert custom-html-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </Card>
    </div>
  );
}
