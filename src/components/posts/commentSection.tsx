"use client";

import React, { useState } from 'react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleIcon, TrashIcon } from "@radix-ui/react-icons";
import { createCommentAction, voteCommentAction, deleteCommentAction, getCommentByIdAction } from '~/server/actions/commentActions';

type CommentData = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    fullName?: string;
  };
  upvotes: number;
  downvotes: number;
  replies?: CommentData[];
};

function Comment({ comment, postId, currentUserId, onReply, onDelete, onVote }: {
  comment: CommentData;
  postId: string;
  currentUserId: string;
  onReply: (parentId: string) => void;
  onDelete: (commentId: string) => void;
  onVote: (commentId: string, voteType: 1 | -1) => void;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async () => {
    if (replyContent.trim()) {
      await createCommentAction(currentUserId, postId, replyContent, comment.id);
      setReplyContent('');
      setIsReplying(false);
      onReply(comment.id);
    }
  };

  return (
    <div className="mt-4 border-l-2 pl-4">
      <div className="flex items-center space-x-2">
        <span className="font-bold">{comment.user.fullName}</span>
        <span className="text-sm text-gray-500">
          {new Date(comment.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="mt-2">{comment.content}</p>
      <div className="mt-2 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVote(comment.id, 1)}
        >
          <ArrowUpIcon /> {comment.upvotes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVote(comment.id, -1)}
        >
          <ArrowDownIcon /> {comment.downvotes}
        </Button>
        <Button
          className='gap-2'
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
        >
          <ChatBubbleIcon /> Reply
        </Button>
        {comment.userId === currentUserId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(comment.id)}
          >
            <TrashIcon /> Delete
          </Button>
        )}
      </div>
      {isReplying && (
        <div className="mt-2">
          <Input
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
          />
          <Button variant={"secondary"} onClick={handleReply} className="mt-2">
            Post Reply
          </Button>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && comment.replies.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          postId={postId}
          currentUserId={currentUserId}
          onReply={onReply}
          onDelete={onDelete}
          onVote={onVote}
        />
      ))}
    </div>
  );
}

export default function CommentContent({ initialComments, postId, userId }: {
  initialComments: CommentData[];
  postId: string;
  userId: string | undefined;
}) {
  const [comments, setComments] = useState(initialComments);
  const [newCommentContent, setNewCommentContent] = useState('');

  const handleCreateComment = async () => {
    if (newCommentContent.trim() && userId) {
      const newCommentId = await createCommentAction(userId, postId, newCommentContent);
      if (newCommentId) {
        const newComment = await getCommentByIdAction(newCommentId);
        setComments([{ ...newComment, replies: [] }, ...comments]);
        setNewCommentContent('');
      }
    }
  };

  const handleReply = async (parentId: string) => {
    const updatedComment = await getCommentByIdAction(parentId);
    setComments(prevComments => 
      prevComments.map(c => c.id === parentId ? { ...updatedComment, replies: c.replies || [] } : c)
    );
  };

  const handleDelete = async (commentId: string) => {
    if (userId) {
      const success = await deleteCommentAction(commentId, userId);
      if (success) {
        setComments(prevComments => prevComments.filter(c => c.id !== commentId));
      }
    }
  };

  const handleVote = async (commentId: string, voteType: 1 | -1) => {
    if (userId) {
      const success = await voteCommentAction(userId, commentId, voteType);
      if (success) {
        setComments(prevComments => 
          prevComments.map(c => {
            if (c.id === commentId) {
              return {
                ...c,
                upvotes: voteType === 1 ? c.upvotes + 1 : c.upvotes,
                downvotes: voteType === -1 ? c.downvotes + 1 : c.downvotes,
              };
            }
            return c;
          })
        );
      }
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <div className="mb-4">
        <Input
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <Button onClick={handleCreateComment} className="mt-2">
          Post Comment
        </Button>
      </div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUserId={userId || ''}
          onReply={handleReply}
          onDelete={handleDelete}
          onVote={handleVote}
        />
      ))}
    </div>
  );
}
