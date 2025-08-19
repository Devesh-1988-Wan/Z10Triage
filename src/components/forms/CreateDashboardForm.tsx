import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface CreateDashboardFormProps {
    onDashboardCreated?: () => void;
}

export const CreateDashboardForm: React.FC<CreateDashboardFormProps> = ({ onDashboardCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to create a dashboard.", variant: "destructive" });
        return;
    }

    try {
      const { error } = await supabase
        .from('dashboard_layout')
        .insert({
          user_id: user.id,
          name: form.name,
          description: form.description,
          layout: [], // Start with an empty layout
        });

      if (error) throw error;
      
      toast({ title: "Success", description: "New dashboard created successfully." });
      setForm({ name: '', description: '' });
      if (onDashboardCreated) onDashboardCreated();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create dashboard.", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Create New Dashboard</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Dashboard Name</Label>
        <Input id="name" value={form.name} onChange={handleChange} placeholder="e.g., Q3 Marketing Analytics" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={form.description} onChange={handleChange} placeholder="A brief description of the dashboard's purpose." />
      </div>
      <Button type="submit" className="w-full">Create Dashboard</Button>
    </form>
  );
};