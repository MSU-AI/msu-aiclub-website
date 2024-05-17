import { Profile } from "./profiles";

export interface Project {
    id: string;
    name: string;
    description: string;
    imageURL?: string | null;
    videoURL?: string | null;
    tags?: string[] | null;
}
