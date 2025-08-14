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
    onSave(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  if (!isEditing) {
    return <span className={className}>{value}</span>;
  }

  const commonProps = {
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    className: inputClassName,
    autoFocus: true,
  };

  return as === 'textarea' ? (
    <Textarea {...commonProps} />
  ) : (
    <Input {...commonProps} />
  );
};