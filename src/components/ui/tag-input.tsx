import React, { useState, KeyboardEvent, ClipboardEvent } from 'react';
import { Tag } from "./tag";

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
}



export const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  console.log("tags", tags);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' && e.currentTarget.value.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      processInput(inputValue);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    processInput(pasteData);
  };

  const processInput = (input: string) => {
    if (!input.trim()) return;
    
    // Split by commas and process each tag
    const tagArray = input.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    if (tagArray.length > 0) {
      // Add each tag that doesn't already exist
      const newTags = [...tags];
      let added = false;
      
      tagArray.forEach(tag => {
        if (tag && !newTags.includes(tag)) {
          newTags.push(tag);
          added = true;
        }
      });
      
      if (added) {
        onTagsChange(newTags);
      }
      
      setInputValue('');
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      processInput(inputValue);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags?.includes(tag)) {
      onTagsChange([...tags, tag]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="relative border rounded p-1.5 min-h-[42px]">
      <div className="flex flex-wrap gap-2 mb-1">
        {tags?.map((tag, index) => (
          <Tag 
            key={tag} 
            text={tag}
            colorIndex={index}
            onDelete={() => removeTag(tag)}
          />
        ))}
      </div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
        placeholder={placeholder || "Add tags..."}
        className="w-full outline-none text-sm py-1 px-0 focus:ring-0 border-0"
      />
    </div>
  );
};
