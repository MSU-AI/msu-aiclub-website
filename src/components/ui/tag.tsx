"use client"

import React from 'react';

export const TAG_COLORS = [
  'border border-blue-400 bg-blue-100/70 text-blue-700 dark:border-blue-500 dark:bg-blue-900/30 dark:text-blue-200',
  'border border-green-400 bg-green-100/70 text-green-700 dark:border-green-500 dark:bg-green-900/30 dark:text-green-200',
  'border border-yellow-400 bg-yellow-100/70 text-yellow-700 dark:border-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-200',
  'border border-red-400 bg-red-100/70 text-red-700 dark:border-red-500 dark:bg-red-900/30 dark:text-red-200',
  'border border-purple-400 bg-purple-100/70 text-purple-700 dark:border-purple-500 dark:bg-purple-900/30 dark:text-purple-200',
  'border border-indigo-400 bg-indigo-100/70 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-200',
  'border border-pink-400 bg-pink-100/70 text-pink-700 dark:border-pink-500 dark:bg-pink-900/30 dark:text-pink-200',
  'border border-teal-400 bg-teal-100/70 text-teal-700 dark:border-teal-500 dark:bg-teal-900/30 dark:text-teal-200',
];

interface TagProps {
  text: string;
  colorIndex?: number;
  onDelete?: () => void;
}

export function Tag({ text, colorIndex = 0, onDelete }: TagProps) {
  return (
    <div 
      className={`inline-flex items-center ${TAG_COLORS[colorIndex % TAG_COLORS.length]} px-2 py-0.5 rounded-md text-sm font-medium dark:saturate-[0.45] dark:hover:saturate-100`}
    >
      <span>{text}</span>
      {onDelete && (
        <button 
          onClick={onDelete}
          className="ml-1.5 w-3.5 h-3.5 flex items-center justify-center hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
}
