import { Post } from "./posts";

export enum userTypeEnum{
    "guest", "member", "admin"
}

export interface Profile {
    supaId: string;
    teamId: string | null;
    userType: string;
    posts?: Post[];
}