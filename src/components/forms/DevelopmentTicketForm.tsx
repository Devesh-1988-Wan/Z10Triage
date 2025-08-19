import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DevelopmentTicketFormProps {
  onDataUpdate: () => void;
}

export const DevelopmentTicketForm: React.FC<DevelopmentTicketFormProps> = ({ onDataUpdate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: '',
    type: '',
    requestedBy: user?.name || '',
    ticketId: '',
    status: '',
    priority: '',
    estimatedHours: '',
    actualHours: '',
    assignee: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('development_tickets')
        .insert({
          title: form.title,
          type: form.type,
          requested_by: form.requestedBy,
          ticket_id: form.ticketId,
          status: form.status,
          priority: form.priority,
          estimated_hours: form.estimatedHours ? parseInt(form.estimatedHours) : null,
          actual_hours: form.actualHours ? parseInt(form.actualHours) : null,
          assignee: form.assignee || null
        });

      if (error) throw error;
      
      toast({ title: "Success", description: "Development ticket created successfully" });
      setForm({
        title: '', type: '', requestedBy: user?.name || '', ticketId: '',
        status: '', priority: '', estimatedHours: '', actualHours: '', assignee: ''
      });
      onDataUpdate();
    } catch (error) {
      toast({ title: "Error", description: "Failed to create development ticket", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setForm({ ...form, [id]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Create Development Ticket</h3>
      {/* Add your form fields here using Label, Input, Select, etc. */}
      {/* For example: */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={form.title} onChange={handleChange} />
      </div>
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
};