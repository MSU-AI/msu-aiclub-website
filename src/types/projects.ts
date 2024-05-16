import { Profile } from "./profiles";

export interface Project {
    id: string;
    name: string;
    profiles?: Profile[] | null;
    description: string;
    imageURL?: string | null;
    videoURL?: string | null;
    tags?: string[] | null;
}
