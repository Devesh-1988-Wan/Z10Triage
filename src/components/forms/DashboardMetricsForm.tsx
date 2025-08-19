import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DashboardMetrics } from '@/types/dashboard';

interface DashboardMetricsFormProps {
  initialMetrics: DashboardMetrics;
  onDataUpdate: () => void;
}

export const DashboardMetricsForm: React.FC<DashboardMetricsFormProps> = ({ initialMetrics, onDataUpdate }) => {
  const { toast } = useToast();
  const [form, setForm] = useState<DashboardMetrics>(initialMetrics);

  useEffect(() => {
    setForm(initialMetrics);
  }, [initialMetrics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('dashboard_metrics')
        .update({
          total_bugs_fixed: form.totalBugsFixed,
          total_tickets_resolved: form.totalTicketsResolved,
          blocker_bugs: form.blockerBugs,
          critical_bugs: form.criticalBugs,
          high_priority_bugs: form.highPriorityBugs,
          active_customer_support: form.activeCustomerSupport,
          development_progress: form.developmentProgress
        })
        .eq('id', form.id);

      if (error) throw error;
      toast({ title: "Success", description: "Dashboard metrics updated successfully" });
      onDataUpdate();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update dashboard metrics", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: parseInt(value) || 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Update Dashboard Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(form).filter(k => k !== 'id').map((key) => (
            <div className="space-y-2" key={key}>
                <Label htmlFor={key}>{key.split(/(?=[A-Z])/).join(" ")}</Label>
                <Input
                    id={key}
                    type="number"
                    value={form[key as keyof typeof form]}
                    onChange={handleChange}
                />
            </div>
        ))}
      </div>
      <Button type="submit" className="w-full">Update Metrics</Button>
    </form>
  );
};