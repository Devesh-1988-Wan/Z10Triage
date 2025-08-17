import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AddUserForm: React.FC = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    email: '',
    role: 'viewer',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.admin.inviteUserByEmail(form.email, {
        data: { role: form.role },
      });

      if (error) throw error;
      
      toast({ title: "Success", description: `Invitation sent to ${form.email}` });
      setForm({ email: '', role: 'viewer' });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to send invitation", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  
  const handleSelectChange = (value: string) => {
    setForm({ ...form, role: value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Invite New User</h3>
      <div className="space-y-2">
        <Label htmlFor="email">User Email</Label>
        <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="user@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={form.role} onValueChange={handleSelectChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
            </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Send Invitation</Button>
    </form>
  );
};