"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { likePost, deletePost } from '~/server/actions/post';
import { HeartFilledIcon, HeartIcon, ChatBubbleIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { UserIcon, CalendarIcon, LayoutGridIcon, LayoutListIcon } from "lucide-react";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "~/components/ui/card"

export default function PostList({ posts: initialPosts, isAdmin, userId }: { posts: any[], isAdmin: boolean, userId?: string }) {
  // User is logged in if they have a userId or they're an admin
  const isLoggedIn = !!userId || isAdmin;
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const sortedAndFilteredPosts = useMemo(() => {
    return [...posts].filter(post => {
      const searchableValues = [
        post.title,
        post.description,
        post.content,
        post.user?.fullName,
        new Date(post.createdAt).toLocaleDateString()
      ];
      return searchableValues.some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [posts, searchTerm]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredPosts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAndFilteredPosts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If user is not logged in, don't proceed with the like action
    if (!isLoggedIn) {
      // Show a toast or alert that user needs to log in
      console.log('User must be logged in to like posts');
      return;
    }

    // Optimistically update UI
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );

    try {
      // Server-side action will throw if user is not authenticated
      await likePost(postId);
    } catch (error) {
      console.error("Error liking post:", error);
      
      // Revert the optimistic update
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

  // Helper function to get author name
  const getAuthorName = (post: any) => {
    return post.user?.fullName || 'AI Club';
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString || '').toLocaleDateString();
  };

  // Helper function to get excerpt from content
  const getExcerpt = (content: string) => {
    if (!content) return '';
    // Strip HTML tags and limit to 150 characters
    return content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  };

  const isLoading = false;
  const error = null;
  const blogPosts = paginatedPosts;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-4">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? "default" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode('grid')} 
              className="rounded-none"
            >
              <LayoutGridIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? "default" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode('list')} 
              className="rounded-none"
            >
              <LayoutListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <p>Loading blog posts...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-destructive">Error loading blog posts. Please try again later.</p>
          <p className="text-xs mt-2 text-muted-foreground">
            {typeof error === 'object' && error !== null && 'message' in error ? (error as Error).message : 'Unknown error'}
          </p>
        </div>
      ) : blogPosts && blogPosts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                {post.thumbnailUrl && (
                  <div className="w-full h-48 relative">
                    <Image 
                      src={post.thumbnailUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl hover:text-primary transition-colors">
                    <Link href={`/posts/${post.id}`}>{post.title}</Link>
                  </CardTitle>
                  <div className="flex justify-between">
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <UserIcon className="h-4 w-4" />
                    <span>{getAuthorName(post)}</span>
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </CardDescription>
                  </div>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <div 
                      className={`flex items-center gap-1 ${isLoggedIn ? 'cursor-pointer hover:text-red-500' : 'cursor-default opacity-70'} transition-colors`}
                      onClick={isLoggedIn ? (e) => handleLike(e, post.id) : undefined}
                    >
                      {post.liked ? <HeartFilledIcon className="text-red-500" /> : <HeartIcon />}
                      <span>{post.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChatBubbleIcon />
                      <span>{post.commentCount || 0}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{post.description || getExcerpt(post.content)}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/posts/${post.id}`}>Read More</Link>
                  </Button>
                </CardFooter>
                {isAdmin && (
                  <div className="flex justify-end p-4 pt-0 gap-2">
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
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <div className="w-full border rounded-lg overflow-hidden" key={post.id}>
                <div className="flex w-full justify-between">
                  <Link href={`/posts/${post.id}`} className="flex items-center w-full">
                    {post.thumbnailUrl && (
                      <div className="w-52 h-32 flex justify-center relative shrink-0">
                        <Image 
                          src={post.thumbnailUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 flex-grow">
                      <h2 className="text-2xl font-bold mb-2 line-clamp-1 hover:text-primary transition-colors">{post.title}</h2>
                      <div className="text-muted-foreground mb-4 line-clamp-2">{post.description || getExcerpt(post.content)}</div>
                      <div className="flex items-center text-sm text-muted-foreground gap-4">
                        <div className="flex items-center gap-1">
                          <UserIcon className="h-4 w-4" />
                          <span>{getAuthorName(post)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div 
                          className={`flex items-center gap-1 ${isLoggedIn ? 'cursor-pointer hover:text-red-500' : 'cursor-default opacity-70'} transition-colors`}
                          onClick={isLoggedIn ? (e) => handleLike(e, post.id) : undefined}
                        >
                          {post.liked ? <HeartFilledIcon className="text-red-500" /> : <HeartIcon />}
                          <span>{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChatBubbleIcon />
                          <span>{post.commentCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {isAdmin && (
                    <div className="flex items-center p-4 gap-2">
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
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex justify-center items-center py-24 border border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground">No blog posts found. Check back soon!</p>
        </div>
      )}

      {blogPosts && blogPosts.length > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}
