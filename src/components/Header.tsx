import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  description?: string;
  onExportPdf?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, description, onExportPdf }) => {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {onExportPdf && (
        <Button variant="outline" onClick={onExportPdf}>
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      )}
    </header>
  );
};