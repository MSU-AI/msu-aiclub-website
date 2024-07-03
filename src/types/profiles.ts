export enum userTypeEnum{
    "guest", "member", "admin"
}

export interface Profile {
    supaId: string;
    projectId: string | null;
    userType: string;
}

export interface AccountData {
  firstName: string;
  lastName: string;
  country: string;
  university: string;
  major: string;
  schoolYear: string;
  discordUsername: string;
  githubUrl: string;
  linkedinUrl: string;
  personalWebsite: string;
}
