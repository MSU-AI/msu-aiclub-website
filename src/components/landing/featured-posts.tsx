"use client";

import React from 'react';
import PostList from '~/app/posts/postList';

interface FeaturedPostsProps {
  posts: any[];
  isAdmin: boolean;
  scrollRef: React.RefObject<HTMLDivElement>
}

export function FeaturedPosts({ posts, isAdmin, scrollRef }: FeaturedPostsProps) {
  return (
    <section className="py-32" ref={scrollRef}>
      <h1 className="text-2xl lg:text-4xl font-semibold text-center text-white pb-16 ">Weekly Workshops</h1>
      <PostList posts={posts} isAdmin={isAdmin} />
    </section>
  );
}
