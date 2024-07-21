export type Comment = {
    id: string;
    content: string;
    createdAt: Date | null;
    userId: string;
    postId: string;
    parentId: string | null; 
    upvotes: number;          
    downvotes: number;        
};

export type CommentWithRepliesAndUser = Comment & {
    user: {
        id: string;
        fullName?: string;
    };
    replies: CommentWithRepliesAndUser[];
};

export type CommentWithReplies = {
  id: string;
  content: string;
  createdAt: Date | null;
  userId: string;
  postId: string;
  parentId: string | null;
  upvotes: number;
  downvotes: number;
  user: {
    id: string;
    fullName: string;
  } | null;
  replies: CommentWithReplies[];
};

export type CommentData = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    flowerProfile: string;
  };
  upvotes: number;
  downvotes: number;
  replies?: CommentData[];
};
