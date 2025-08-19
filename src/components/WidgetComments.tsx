// src/components/WidgetComments.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface WidgetCommentsProps {
  isOpen: boolean;
  onClose: () => void;
  widgetId: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { name: string };
}

export const WidgetComments: React.FC<WidgetCommentsProps> = ({ isOpen, onClose, widgetId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('widget_comments')
      .select('*, profiles(name)')
      .eq('widget_id', widgetId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  };

  const { data: comments = [], isLoading } = useQuery<Comment[], Error>({
    queryKey: ['comments', widgetId],
    queryFn: fetchComments,
    enabled: isOpen,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase.from('widget_comments').insert({
        widget_id: widgetId,
        user_id: user?.id,
        content,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', widgetId] });
      setNewComment('');
    },
  });

  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <p>Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-semibold">{comment.profiles.name}: </span>
                <span>{comment.content}</span>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button onClick={handleAddComment} disabled={addCommentMutation.isLoading}>
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};