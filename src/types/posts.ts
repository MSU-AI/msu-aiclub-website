export interface Post {
    id: string;
    userId: string;
    title: string;
    description: string;
    likes: number;
    content: string;
    thumbnailUrl?: string | null;
    createdAt: Date
}
