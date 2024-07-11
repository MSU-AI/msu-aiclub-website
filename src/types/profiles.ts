export enum userTypeEnum{
    "guest", "member", "admin"
}

export interface Profile {
    supaId: string;
    projectId: string | null;
    userType: string;
}

export interface AccountData {
  memberType: string;
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
  flowerProfile: string;
  profilePictureUrl?: string;
}

export interface FormData {
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


export interface Country {
  name: {
    common: string;
    official: string;
    nativeName: Record<string, { official: string; common: string }>;
  };
}

export interface University {
  name: string;
  country: string;
}

export interface Major {
  name: string;
}
