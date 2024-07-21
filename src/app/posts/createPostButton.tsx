'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

const CreatePostButton: React.FC = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/posts/create');
  };

  return (
    <Button onClick={handleClick} className="flex items-center">
      <PlusIcon className="mr-2 h-4 w-4" />
      Create Post
    </Button>
  );
};

export default CreatePostButton;
