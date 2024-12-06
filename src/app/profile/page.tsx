"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AccountData } from '~/types/profiles';
import { LabeledInput } from '~/components/ui/labeled-input';
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { updateProfile } from '~/server/actions/auth';
import { uploadImage } from '~/server/actions/helpers';
import { createClient } from '~/utils/supabase/client';
import { Button } from '~/components/ui/button';
import { Image } from "lucide-react";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<AccountData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadedUrl = await uploadImage(formData);
      if (userData) {
        setUserData({ ...userData, profilePictureUrl: uploadedUrl });
      }
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

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
    <div className="container mx-auto p-8 pt-28">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div 
        onClick={triggerFileInput}
        className={`
          mb-6 w-40 h-40 relative rounded-full overflow-hidden
          ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}
          ${isUploading ? 'opacity-50' : ''}
        `}
      >
        <Avatar className="w-full h-full">
          <AvatarImage src={userData.profilePictureUrl || userData.flowerProfile || "https://github.com/shadcn.png"} />
          <AvatarFallback>PF</AvatarFallback>
        </Avatar>
        {isEditing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <p className="text-white text-sm text-center">
              {isUploading ? 'Uploading...' : 'Click to change profile picture'}
            </p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">{userData.firstName} {userData.lastName}</h2>
        <p>Level {level ?? 'Unknown'}</p>
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

        {isEditing ? (
          <div className="space-x-2">
            <Button type="submit" className="rounded-lg" disabled={isUploading}>Save</Button>
            <Button onClick={() => setIsEditing(false)} className="rounded-lg" disabled={isUploading}>Cancel</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="rounded-lg">Edit Profile</Button>
        )}
      </form>
    </div>
  );
}
