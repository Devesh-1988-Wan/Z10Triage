import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Image, FileText, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WidgetContent } from '@/types/widgetContent';

interface ContentManagerProps {
  onContentUpdate: () => void;
  widgetContent: WidgetContent[];
}

export const ContentManager: React.FC<ContentManagerProps> = ({ onContentUpdate, widgetContent }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    content: '',
    widgetType: 'content' as 'content' | 'image' | 'announcement' | 'progress' | 'stats',
    imageFile: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setNewContent(prev => ({ ...prev, imageFile: file }));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `widget-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('widget-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('widget-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContent.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for the content.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl: string | null = null;

      // Upload image if provided
      if (newContent.imageFile) {
        imageUrl = await uploadImage(newContent.imageFile);
      }

      // Insert content into database
      const { error } = await supabase
        .from('widget_content')
        .insert({
          title: newContent.title.trim(),
          description: newContent.description.trim() || null,
          content: newContent.content.trim() || null,
          image_url: imageUrl,
          widget_type: newContent.widgetType,
          metadata: {}
        });

      if (error) throw error;

      toast({
        title: "Content added successfully",
        description: "The new content has been saved to the database."
      });

      // Reset form
      setNewContent({
        title: '',
        description: '',
        content: '',
        widgetType: 'content',
        imageFile: null
      });

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Refresh data
      onContentUpdate();

    } catch (error) {
      console.error('Error adding content:', error);
      toast({
        title: "Error adding content",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('widget_content')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Content deleted",
        description: "The content has been removed from the database."
      });

      onContentUpdate();
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error deleting content",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Content Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Content
          </CardTitle>
          <CardDescription>
            Create content for image widgets and announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newContent.title}
                  onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="widgetType">Widget Type</Label>
                <Select
                  value={newContent.widgetType}
                  onValueChange={(value) => setNewContent(prev => ({ 
                    ...prev, 
                    widgetType: value as 'content' | 'image' | 'announcement' | 'progress' | 'stats'
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content">General Content</SelectItem>
                    <SelectItem value="image">Image Content</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="progress">Progress Update</SelectItem>
                    <SelectItem value="stats">Statistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newContent.description}
                onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newContent.content}
                onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter the main content text..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image (optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {newContent.imageFile && (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <Image className="w-4 h-4" />
                    {newContent.imageFile.name}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>

            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Content List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Existing Content
          </CardTitle>
          <CardDescription>
            Manage all widget content and media
          </CardDescription>
        </CardHeader>
        <CardContent>
          {widgetContent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No content available. Add some content above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {widgetContent.map((content) => (
                <div key={content.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  {content.imageUrl && (
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={content.imageUrl}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold truncate">{content.title}</h4>
                        {content.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {content.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {content.widgetType}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(content.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(content.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {content.content && (
                      <p className="text-sm mt-2 line-clamp-2">{content.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
