"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ArrowUpIcon, ArrowDownIcon, ChatBubbleIcon, TrashIcon } from "@radix-ui/react-icons";
import { createCommentAction, voteCommentAction, deleteCommentAction, getCommentByIdAction} from '~/server/actions/commentActions';

type CommentData = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    fullName?: string;
  };
  replies?: CommentData[];
  upvotes: number;
  downvotes: number;
  userVote: 1 | -1 | 0;
};

function Comment({ comment, postId, currentUserId, onReply, onDelete, onVote }: {
  comment: CommentData;
  postId: string;
  currentUserId: string;
  onReply: (parentId: string) => void;
  onDelete: (commentId: string) => void;
  onVote: (commentId: string, voteType: 1 | -1 | 0) => void;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [localUpvotes, setLocalUpvotes] = useState(comment.upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(comment.downvotes);
  const [userVote, setUserVote] = useState(comment.userVote);

  useEffect(() => {
    setLocalUpvotes(comment.upvotes);
    setLocalDownvotes(comment.downvotes);
    setUserVote(comment.userVote);
  }, [comment.upvotes, comment.downvotes, comment.userVote]);

  const handleReply = async () => {
    if (replyContent.trim()) {
      await createCommentAction(currentUserId, postId, replyContent, comment.id);
      setReplyContent('');
      setIsReplying(false);
      onReply(comment.id);
    }
  };

  const handleVote = async (voteType: 1 | -1) => {
    const oldUserVote = userVote;
    const newUserVote = oldUserVote === voteType ? 0 : voteType;

    // Optimistically update UI
    setUserVote(newUserVote);
    if (oldUserVote === 1) setLocalUpvotes(prev => prev - 1);
    if (oldUserVote === -1) setLocalDownvotes(prev => prev - 1);
    if (newUserVote === 1) setLocalUpvotes(prev => prev + 1);
    if (newUserVote === -1) setLocalDownvotes(prev => prev + 1);

    try {
      await voteCommentAction(currentUserId, comment.id, newUserVote);
      onVote(comment.id, newUserVote);
    } catch (error) {
      // Revert changes if the API call fails
      setUserVote(oldUserVote);
      setLocalUpvotes(comment.upvotes);
      setLocalDownvotes(comment.downvotes);
      console.error("Failed to update vote:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCommentAction(comment.id, currentUserId);
      onDelete(comment.id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
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
          onClick={() => handleVote(1)}
          className={userVote === 1 ? "text-blue-500" : ""}
        >
          <ArrowUpIcon className={`h-4 w-4 ${userVote === 1 ? "fill-current" : ""}`} />
          <span className="ml-1">{localUpvotes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote(-1)}
          className={userVote === -1 ? "text-blue-500" : ""}
        >
          <ArrowDownIcon className={`h-4 w-4 ${userVote === -1 ? "fill-current" : ""}`} />
          <span className="ml-1">{localDownvotes}</span>
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
            onClick={handleDelete}
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
    setComments(prevComments => prevComments.filter(c => c.id !== commentId));
  };

  const handleVote = async (commentId: string, voteType: 1 | -1 | 0) => {
    setComments(prevComments => 
      prevComments.map(c => {
        if (c.id === commentId) {
          const voteChange = voteType - (c.userVote || 0);
          return {
            ...c,
            upvotes: c.upvotes + (voteType === 1 ? 1 : voteType === 0 && c.userVote === 1 ? -1 : 0),
            downvotes: c.downvotes + (voteType === -1 ? 1 : voteType === 0 && c.userVote === -1 ? -1 : 0),
            userVote: voteType,
          };
        }
        return c;
      })
    );
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
