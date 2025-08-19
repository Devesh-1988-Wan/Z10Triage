import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BugReportFormProps {
  onDataUpdate: () => void;
}

export const BugReportForm: React.FC<BugReportFormProps> = ({ onDataUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    category: '',
    assignee: '',
    reporter: user?.name || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('bug_reports').insert({ ...form, assignee: form.assignee || null });
      if (error) throw error;
      toast({ title: "Success", description: "Bug report created successfully" });
      setForm({ title: '', description: '', priority: '', status: '', category: '', assignee: '', reporter: user?.name || '' });
      onDataUpdate();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create bug report", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (id: string, value: string) => {
    setForm({ ...form, [id]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Create Bug Report</h3>
      {/* Form Fields */}
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
};