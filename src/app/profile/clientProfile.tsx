"use client"

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AccountData } from '~/types/profiles';
import { LabeledInput } from '~/components/ui/labeled-input';
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { updateProfile } from '~/server/actions/auth';
import { uploadImage } from '~/server/actions/helpers';
import { Button } from '~/components/ui/button';
import { Image } from "lucide-react";
import { cn } from "~/lib/utils";

interface ClientProfileProps {
  userMetadata: AccountData;
  points: {
    totalPoints: number;
    visiblePoints: number;
  };
}

export function ClientProfile({ userMetadata, points }: ClientProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<AccountData>(userMetadata);
  const [isEditing, setIsEditing] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadedUrl = await uploadImage(formData);
      setUserData(prev => ({ ...prev, profilePictureUrl: uploadedUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (name: keyof AccountData, value: string) => {
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await updateProfile(userData);
    if (res) {
      toast.error(`Error updating profile: ${res}`);
    } else {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto p-8 pt-28 flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <div 
            onClick={triggerFileInput}
            className={cn(
              "relative w-32 h-32 rounded-full overflow-hidden",
              isEditing && "cursor-pointer hover:opacity-90",
              isUploading && "opacity-50"
            )}
          >
            <Avatar className="w-full h-full">
              <AvatarImage 
                src={userData.profilePictureUrl || userData.flowerProfile} 
                className="object-cover"
              />
              <AvatarFallback>
                {userData.firstName?.[0]}{userData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Image className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">
            {userData.firstName} {userData.lastName}
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold">{points.totalPoints}</p>
            </div>
            <div className="bg-card p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Semester Points</p>
              <p className="text-2xl font-bold">{points.visiblePoints}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LabeledInput
            label="First Name"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={userData.firstName}
            onChange={(value) => handleChange("firstName", value)}
            disabled={!isEditing}
          />
          <LabeledInput
            label="Last Name"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={userData.lastName}
            onChange={(value) => handleChange("lastName", value)}
            disabled={!isEditing}
          />
        </div>

        <LabeledInput
          label="Discord Username"
          id="discordUsername"
          name="discordUsername"
          placeholder="example#1234"
          value={userData.discordUsername}
          onChange={(value) => handleChange("discordUsername", value)}
          disabled={!isEditing}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Social Links</h3>
          <LabeledInput
            label="GitHub URL"
            id="githubUrl"
            name="githubUrl"
            placeholder="https://github.com/username"
            value={userData.githubUrl}
            onChange={(value) => handleChange("githubUrl", value)}
            disabled={!isEditing}
          />
          <LabeledInput
            label="LinkedIn URL"
            id="linkedinUrl"
            name="linkedinUrl"
            placeholder="https://linkedin.com/in/username"
            value={userData.linkedinUrl}
            onChange={(value) => handleChange("linkedinUrl", value)}
            disabled={!isEditing}
          />
          <LabeledInput
            label="Personal Website"
            id="personalWebsite"
            name="personalWebsite"
            placeholder="https://example.com"
            value={userData.personalWebsite}
            onChange={(value) => handleChange("personalWebsite", value)}
            disabled={!isEditing}
          />
        </div>

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <Button type="submit" disabled={isUploading}>Save Changes</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
