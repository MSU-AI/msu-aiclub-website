import React, { useState, useRef, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

interface MobileSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

export function MobileSelect({ options, value, onChange, placeholder, label }: MobileSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between h-10 sm:h-12 md:h-14 text-base sm:text-lg bg-white dark:bg-black text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-md"
      >
        {value || placeholder}
      </Button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="m-2 w-[calc(100%-1rem)]"
          />
          {filteredOptions.map((option) => (
            <Button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full justify-start h-12 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
