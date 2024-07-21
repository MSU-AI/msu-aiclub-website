'use server'

import { createComment, voteComment, deleteComment } from '~/server/actions/comment';
import { getCommentById } from '~/server/db/queries/comment';

export async function createCommentAction(userId: string, postId: string, content: string, parentId?: string) {
  return createComment(userId, postId, content, parentId);
}

export async function voteCommentAction(userId: string, commentId: string, voteType: 1 | -1 | 0) {
  return voteComment(userId, commentId, voteType);
}

export async function deleteCommentAction(commentId: string, userId: string) {
  return deleteComment(commentId, userId);
}

export async function getCommentByIdAction(commentId: string) {
  return getCommentById(commentId);
}
