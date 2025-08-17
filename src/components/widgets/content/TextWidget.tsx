import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Bold, Italic, List, Link } from 'lucide-react';

interface TextWidgetProps {
  title: string;
  description?: string;
  content: string;
  allowRichText?: boolean;
  isEditable?: boolean;
  onContentChange?: (content: string) => void;
}

export const TextWidget: React.FC<TextWidgetProps> = ({
  title,
  description,
  content,
  allowRichText = true,
  isEditable = false,
  onContentChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleSave = () => {
    onContentChange?.(editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const insertFormatting = (format: string) => {
    const formats = {
      bold: '**text**',
      italic: '*text*',
      list: '\n- List item',
      link: '[link text](url)'
    };
    
    setEditContent(prev => prev + formats[format as keyof typeof formats]);
  };

  const renderContent = (text: string) => {
    if (!allowRichText) return text;
    
    // Simple markdown-like rendering
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
      .replace(/^- (.*)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc list-inside space-y-1">$1</ul>')
      .replace(/\n/g, '<br>');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            {allowRichText && <Badge variant="outline">Rich Text</Badge>}
            {isEditable && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {allowRichText && (
              <div className="flex gap-2 border-b pb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertFormatting('bold')}
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertFormatting('italic')}
                >
                  <Italic className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertFormatting('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => insertFormatting('link')}
                >
                  <Link className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Enter your content here..."
              className="min-h-32"
            />
            
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel} size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div 
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: renderContent(content) }}
          />
        )}
      </CardContent>
    </Card>
  );
};