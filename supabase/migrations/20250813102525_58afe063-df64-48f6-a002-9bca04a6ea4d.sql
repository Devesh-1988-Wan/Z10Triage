-- Create dashboard layout table
CREATE TABLE public.dashboard_layout (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  layout JSONB NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on dashboard layout
ALTER TABLE public.dashboard_layout ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for dashboard layout
CREATE POLICY "Everyone can view dashboard layout" ON public.dashboard_layout FOR SELECT USING (true);
CREATE POLICY "Admins can manage all layouts" ON public.dashboard_layout FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_dashboard_layout_updated_at BEFORE UPDATE ON public.dashboard_layout FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();