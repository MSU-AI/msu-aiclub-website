import React, { useState, useRef, useEffect } from 'react';
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface SearchDropdownProps<T> {
  label: string;
  options: T[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  getOptionLabel: (option: T) => string;
}

export function SearchDropdown<T>({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  getOptionLabel
}: SearchDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const filteredOptions = Array.isArray(options) 
    ? options.filter(option => 
        getOptionLabel(option).toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
          const selectedOption = filteredOptions[selectedIndex];
          if (selectedOption) {
            setInputValue(getOptionLabel(selectedOption));
            onChange(getOptionLabel(selectedOption));
            setIsOpen(false);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    onChange(newValue);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor={label} className="text-base sm:text-lg">{label}</Label>
      <Input
        id={label}
        name={label}
        placeholder={placeholder}
        type="text"
        className="h-10 sm:h-12 md:h-14 text-base sm:text-lg"
        onChange={handleInputChange}
        value={inputValue}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoComplete="off"
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-black border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={getOptionLabel(option)}
              type="button"
              onClick={() => {
                setInputValue(getOptionLabel(option));
                onChange(getOptionLabel(option));
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 ${
                index === selectedIndex ? 'bg-secondary' : 'hover:bg-secondary/70'
              }`}
            >
              {getOptionLabel(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
