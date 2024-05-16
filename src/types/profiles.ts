import { Post } from "./posts";
import { Project } from "./projects";

export enum userTypeEnum{
    "guest", "member", "admin"
}

export interface Profile {
    supaId: string;
    projectId: string | null;
    project?: Project | null;
    userType: string;
    userImageURL?: string;
    posts?: Post[];
}
