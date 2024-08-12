import React, { useState, KeyboardEvent } from 'react';
import { Input } from "~/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}

const TAG_COLORS = [
  'bg-blue-200 text-blue-800',
  'bg-green-200 text-green-800',
  'bg-yellow-200 text-yellow-800',
  'bg-red-200 text-red-800',
  'bg-purple-200 text-purple-800',
];

export const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  console.log("tags", tags);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' && e.currentTarget.value.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue.trim());
    }
  };

  const addTag = (tag: string) => {
    if (tag && !!!tags?.includes(tag)) {
      onTagsChange([...tags, tag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded">
      {tags?.map((tag, index) => (
        <div 
          key={tag} 
          className={`flex items-center ${TAG_COLORS[index % TAG_COLORS.length]} px-2 py-1 rounded-full`}
        >
          <span>{tag}</span>
          <Cross2Icon 
            className="w-4 h-4 ml-1 cursor-pointer" 
            onClick={() => removeTag(tag)}
          />
        </div>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder || "Add tags..."}
        className="flex-grow border-none focus:ring-0"
      />
    </div>
  );
};
