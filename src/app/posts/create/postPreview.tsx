import React from 'react';
import Image from 'next/image';

interface PostPreviewProps {
  title: string;
  description: string;
  thumbnailUrl: string;
  content: string;
}

const PostPreview: React.FC<PostPreviewProps> = ({ title, description, thumbnailUrl, content }) => {
  return (
    <div className="max-w-[740px] mx-auto">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-xl text-gray-500 mb-6">{description}</p>
      {thumbnailUrl && (
        <div className="mb-6">
          <Image 
            src={thumbnailUrl} 
            alt={title} 
            width={740} 
            height={400} 
            className="rounded-lg"
          />
        </div>
      )}
      <div 
        className="prose prose-lg prose-invert max-w-none custom-html-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default PostPreview;
