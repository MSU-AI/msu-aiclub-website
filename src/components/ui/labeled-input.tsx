import React from 'react';
import { Input as AceternityInput } from "~/components/ui/acern-input";
import { Input as ShadcnInput } from "~/components/ui/input";
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
  inputType?: 'aceternity' | 'shadcn';
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
  inputType = 'shadcn',
}) => {
  const InputComponent = inputType === 'shadcn' ? ShadcnInput : AceternityInput;

  return (
    <LabelInputContainer className={className}>
      <Label htmlFor={id} className="text-base sm:text-lg">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <InputComponent
        id={id}
        name={name}
        placeholder={placeholder}
        type={type}
        className={cn(
          "h-10 sm:h-12 md:h-14 text-base sm:text-lg",
          inputType === 'shadcn' && "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}
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
