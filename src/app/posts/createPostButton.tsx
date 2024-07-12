"use client";
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";

export default function CreatePostButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.push('/posts/create')}>Create Post</Button>
  );
}
