import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomerSupportFormProps {
  onDataUpdate: () => void;
}

export const CustomerSupportForm: React.FC<CustomerSupportFormProps> = ({ onDataUpdate }) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [form, setForm] = useState({
        customerName: '',
        area: '',
        priority: '',
        status: '',
        eta: '',
        description: '',
        assignee: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('customer_support_tickets').insert({
                customer_name: form.customerName,
                area: form.area,
                priority: form.priority,
                status: form.status,
                eta: form.eta || null,
                description: form.description,
                assignee: form.assignee || null,
            });
            if (error) throw error;
            toast({ title: "Success", description: "Support ticket created successfully" });
            setForm({ customerName: '', area: '', priority: '', status: '', eta: '', description: '', assignee: '' });
            onDataUpdate();
        } catch (error) {
            toast({ title: "Error", description: "Failed to create support ticket", variant: "destructive" });
        }
    };
    
    // Add handleChange and JSX for form
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Create Customer Support Ticket</h3>
            {/* Form Fields */}
            <Button type="submit" className="w-full">Submit</Button>
        </form>
    );
};