"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { likePost, deletePost } from '~/server/actions/post';
import { HeartFilledIcon, HeartIcon, ChatBubbleIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "~/components/ui/button"

export default function PostList({ posts: initialPosts, isAdmin }: { posts: any[], isAdmin: boolean }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);

  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );

    try {
      await likePost(postId);
    } catch (error) {
      console.error("Error liking post:", error);
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post.id === postId 
            ? { ...post, liked: !post.liked, likes: post.liked ? post.likes + 1 : post.likes - 1 }
            : post
        )
      );
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (postId: string) => {
    router.push(`/posts/edit/${postId}`);
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
      <>
        <div key={post.id} className="flex">
          <Link href={`/posts/${post.id}`} className="flex-grow flex items-center justify-center">
            {post.thumbnailUrl && (
              <div className="w-52 h-32 flex justify-center relative">
                <Image 
                  src={post.thumbnailUrl}
                  alt={post.title}
                  fill
                  className='rounded-sm'
                  objectFit="cover"
                />
              </div>
            )}
            <div className="w-3/4 p-4">
              <h2 className="text-2xl font-bold mb-2 line-clamp-1">{post.title}</h2>
              <p className="text-gray-400 mb-4 line-clamp-2">{post.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <button 
                  onClick={(e) => handleLike(e, post.id)} 
                  className="flex items-center hover:text-red-500 transition-colors"
                >
                  {post.liked ? <HeartFilledIcon className="text-red-500" /> : <HeartIcon />}
                  <span className="ml-1">{post.likes}</span>
                </button>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <ChatBubbleIcon />
                  <span className="ml-1">{post.commentCount}</span>
                </div>
              </div>
            </div>
          </Link>
          {isAdmin && (
            <div className="flex flex-col justify-center p-4">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(post.id)}>
                <Pencil1Icon className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <TrashIcon className="hover:stroke-destructive h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(post.id)} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        <div className="h-0.5 bg-gradient-to-r from-foreground to-background"></div>
      </>
      ))}
    </div>
  );
}
