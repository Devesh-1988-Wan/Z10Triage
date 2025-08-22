// src/components/EditableText.tsx
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EditableTextProps {
  initialValue: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  as?: 'input' | 'textarea';
  className?: string;
  inputClassName?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  initialValue,
  onSave,
  isEditing,
  as = 'input',
  className,
  inputClassName
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleBlur = () => {
    if (value !== initialValue) {
      onSave(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  if (!isEditing) {
    return as === 'textarea' ? <p className={className}>{value}</p> : <h1 className={className}>{value}</h1>;
  }

  const commonProps = {
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && as === 'input') {
        (e.target as HTMLInputElement).blur();
      }
    },
    className: inputClassName,
    autoFocus: true,
  };

  return as === 'textarea' ? (
    <Textarea {...commonProps} />
  ) : (
    <Input {...commonProps} />
  );
};