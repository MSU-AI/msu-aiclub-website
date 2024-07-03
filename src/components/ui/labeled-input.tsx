import React from 'react';
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/utils/cn";

interface LabeledInputProps {
  label: string;
  id: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
  className = "",
}) => {
  return (
    <LabelInputContainer className={className}>
      <Label htmlFor={id} className="text-base sm:text-lg">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
        className="h-10 sm:h-12 md:h-14 text-base sm:text-lg"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        disabled={disabled}
        required={required}
      />
    </LabelInputContainer>
  );
};

export const LabelInputContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-3 w-full", className)}>
      {children}
    </div>
  );
};
