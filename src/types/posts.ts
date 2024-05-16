export interface Post {
    id: string;
    profileId: string;
    name: string;
    content: string;
    imageURL?: string | null;
}
