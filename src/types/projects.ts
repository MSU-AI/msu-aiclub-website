import { Profile } from "./profiles";

export interface Project {
    id: string;
    name: string;
    description: string;
    imageURL?: string | null;
    videoURL?: string | null;
    tags?: string[] | null;
}


export interface StoredFormData {
    title?: string;
    imageUrl?: string;
    videoUrl?: string;
    githubUrl?: string;
    liveSiteUrl?: string;
    techStack?: string[];
    html?: string;
    activeTab?: string;
}