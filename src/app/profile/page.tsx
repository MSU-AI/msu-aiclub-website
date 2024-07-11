"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AccountData } from '~/types/profiles';
import { LabeledInput } from '~/components/ui/labeled-input';
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { updateProfile } from '~/server/actions/auth';
import { createClient } from '~/utils/supabase/client';
import { Button } from '~/components/ui/button';

export default function ProfilePage() {
  const [userData, setUserData] = useState<AccountData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data here
    const fetchUserData = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        toast.error('Error fetching user data');
        return;
      }
      setUserData(user?.user_metadata as AccountData);
    };
    fetchUserData();
  }, []);

  const handleChange = (name: keyof AccountData, value: string) => {
    if (userData) {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userData) {
      const res = await updateProfile(userData);
      if (res) {
        toast.error(`Error updating profile: ${res}`);
      } else {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      }
    }
  };

  if (!userData) return <div>Loading...</div>;

  const flower = userData.flowerProfile;
  let level = null;
  if (flower) {
    const match = flower.match(/lvl(\d+)\.png$/);
    if (match && match[1]) {
      level = parseInt(match[1], 10);
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="flex items-center mb-6">
        <Avatar className="w-24 h-24 mr-4">
          <AvatarImage src={userData.flowerProfile ?? "https://github.com/shadcn.png"} />
          <AvatarFallback>PF</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h2>
          <p>Level {level ?? 'Unknown'}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <LabeledInput
          label="First Name"
          id="firstName"
          name="firstName"
          placeholder='First Name'
          value={userData.firstName}
          onChange={(value) => handleChange("firstName", value)}

          disabled={!isEditing}
        />
        <LabeledInput
          label="Last Name"
          id="lastName"
          name="lastName"
          placeholder='Last Name'
          value={userData.lastName}
          onChange={(value) => handleChange("lastName", value)}
          disabled={!isEditing}
        />
        <LabeledInput
          label="Discord Username"
          id="discordUsername"
          name="discordUsername"
          placeholder='malshaik'
          value={userData.discordUsername}
          onChange={(value) => handleChange("discordUsername", value)}
          disabled={!isEditing}
        />
        <LabeledInput
          label="Github URL"
          id="githubUrl"
          name="githubUrl"
          placeholder='https://github.com/malshaik'
          value={userData.githubUrl}
          onChange={(value) => handleChange("githubUrl", value)}
          disabled={!isEditing}
        />
        <LabeledInput
          label="LinkedIn URL"
          id="linkedinUrl"
          name="linkedinUrl"
          placeholder='https://linkedin.com/in/malshaik'
          value={userData.linkedinUrl}
          onChange={(value) => handleChange("linkedinUrl", value)}
          disabled={!isEditing}
        />
        <LabeledInput
          label="Personal Website"
          id="personalWebsite"
          name="personalWebsite"
          placeholder='https://malshaik.com'
          value={userData.personalWebsite}
          onChange={(value) => handleChange("personalWebsite", value)}
          disabled={!isEditing}
        />
        <LabeledInput
          label="Profile Picture URL"
          id="profilePictureUrl"
          name="profilePictureUrl"
          placeholder="https://example.com/your-profile-picture.jpg"
          value={userData.profilePictureUrl || ''}
          onChange={(value) => handleChange("profilePictureUrl", value)}
          disabled={!isEditing}
          type="url"
        />

        {isEditing ? (
          <div className="space-x-2">
            <Button type="submit" className="rounded-lg">Save</Button>
            <Button onClick={() => setIsEditing(false)} className="rounded-lg">Cancel</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="rounded-lg">Edit Profile</Button>
        )}
      </form>
    </div>
  );
}
