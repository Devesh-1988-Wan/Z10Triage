-- Create user profiles table with roles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create bug reports table
CREATE TABLE public.bug_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('blocker', 'critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'dev_done', 'closed')),
  category TEXT NOT NULL CHECK (category IN ('functional', 'usability', 'performance', 'security', 'other')),
  assignee TEXT,
  reporter TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bug reports
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- Create customer support tickets table
CREATE TABLE public.customer_support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  area TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('blocker', 'critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL CHECK (status IN ('live', 'wip', 'pending', 'closed')),
  eta TEXT,
  description TEXT NOT NULL,
  assignee TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on customer support tickets
ALTER TABLE public.customer_support_tickets ENABLE ROW LEVEL SECURITY;

-- Create development tickets table
CREATE TABLE public.development_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('feature', 'bug', 'enhancement', 'task')),
  requested_by TEXT NOT NULL,
  ticket_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'dev_inprogress', 'code_review', 'testing', 'completed')),
  priority TEXT NOT NULL CHECK (priority IN ('blocker', 'critical', 'high', 'medium', 'low')),
  estimated_hours INTEGER,
  actual_hours INTEGER,
  assignee TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on development tickets
ALTER TABLE public.development_tickets ENABLE ROW LEVEL SECURITY;

-- Create security fixes table
CREATE TABLE public.security_fixes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  status TEXT NOT NULL CHECK (status IN ('identified', 'in_progress', 'testing', 'deployed')),
  affected_systems TEXT[] NOT NULL,
  fix_description TEXT NOT NULL,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security fixes
ALTER TABLE public.security_fixes ENABLE ROW LEVEL SECURITY;

-- Create dashboard metrics table
CREATE TABLE public.dashboard_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_bugs_fixed INTEGER NOT NULL DEFAULT 0,
  total_tickets_resolved INTEGER NOT NULL DEFAULT 0,
  blocker_bugs INTEGER NOT NULL DEFAULT 0,
  critical_bugs INTEGER NOT NULL DEFAULT 0,
  high_priority_bugs INTEGER NOT NULL DEFAULT 0,
  active_customer_support INTEGER NOT NULL DEFAULT 0,
  development_progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on dashboard metrics
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for bug reports
CREATE POLICY "Everyone can view bug reports" ON public.bug_reports FOR SELECT USING (true);
CREATE POLICY "Admins can insert bug reports" ON public.bug_reports FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can update bug reports" ON public.bug_reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Super admins can delete bug reports" ON public.bug_reports FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- Create RLS policies for customer support tickets
CREATE POLICY "Everyone can view customer support tickets" ON public.customer_support_tickets FOR SELECT USING (true);
CREATE POLICY "Admins can insert customer support tickets" ON public.customer_support_tickets FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can update customer support tickets" ON public.customer_support_tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Super admins can delete customer support tickets" ON public.customer_support_tickets FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- Create RLS policies for development tickets
CREATE POLICY "Everyone can view development tickets" ON public.development_tickets FOR SELECT USING (true);
CREATE POLICY "Admins can insert development tickets" ON public.development_tickets FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can update development tickets" ON public.development_tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Super admins can delete development tickets" ON public.development_tickets FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- Create RLS policies for security fixes
CREATE POLICY "Everyone can view security fixes" ON public.security_fixes FOR SELECT USING (true);
CREATE POLICY "Admins can insert security fixes" ON public.security_fixes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can update security fixes" ON public.security_fixes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Super admins can delete security fixes" ON public.security_fixes FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'super_admin')
);

-- Create RLS policies for dashboard metrics
CREATE POLICY "Everyone can view dashboard metrics" ON public.dashboard_metrics FOR SELECT USING (true);
CREATE POLICY "Admins can insert dashboard metrics" ON public.dashboard_metrics FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);
CREATE POLICY "Admins can update dashboard metrics" ON public.dashboard_metrics FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bug_reports_updated_at BEFORE UPDATE ON public.bug_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_support_tickets_updated_at BEFORE UPDATE ON public.customer_support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_development_tickets_updated_at BEFORE UPDATE ON public.development_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_security_fixes_updated_at BEFORE UPDATE ON public.security_fixes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_dashboard_metrics_updated_at BEFORE UPDATE ON public.dashboard_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    'viewer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial dashboard metrics
INSERT INTO public.dashboard_metrics (
  total_bugs_fixed,
  total_tickets_resolved,
  blocker_bugs,
  critical_bugs,
  high_priority_bugs,
  active_customer_support,
  development_progress
) VALUES (127, 89, 2, 5, 12, 4, 73);

-- Insert some initial bug reports
INSERT INTO public.bug_reports (title, description, priority, status, category, reporter) VALUES
('Login form validation issue', 'Users can submit empty login forms', 'high', 'open', 'functional', 'QA Team'),
('Performance lag on dashboard', 'Dashboard takes too long to load with large datasets', 'medium', 'in_progress', 'performance', 'Dev Team'),
('Security vulnerability in API', 'Potential SQL injection in user endpoints', 'critical', 'dev_done', 'security', 'Security Team');

-- Insert some initial customer support tickets
INSERT INTO public.customer_support_tickets (customer_name, area, priority, status, eta, description) VALUES
('Etna', 'Hotfixes, Bugs & Features', 'critical', 'live', 'Live', 'Priority bug fixes are being done'),
('Knox', 'Vulnerability Fixes & Performance', 'critical', 'live', 'Live', 'Priority 1 fixes & performance tickets'),
('KleenRite', 'Features & Bug Support', 'high', 'wip', 'WIP', 'Feature requests and priority tickets'),
('Luminos Labs', 'Hotfixes & Support', 'high', 'wip', 'WIP', 'Hotfixes for priority tickets');

-- Insert some initial development tickets
INSERT INTO public.development_tickets (title, type, requested_by, ticket_id, status, priority, estimated_hours, actual_hours) VALUES
('Implement user authentication', 'feature', 'Product Team', 'DEV-001', 'completed', 'high', 40, 45),
('Fix memory leak in charts', 'bug', 'QA Team', 'DEV-002', 'testing', 'medium', 16, 12),
('Add export functionality', 'enhancement', 'Customer Success', 'DEV-003', 'dev_inprogress', 'medium', 24, 8);

-- Insert some initial security fixes
INSERT INTO public.security_fixes (title, severity, status, affected_systems, fix_description) VALUES
('XSS vulnerability patch', 'high', 'deployed', ARRAY['Web Application', 'Admin Panel'], 'Implemented input sanitization and output encoding'),
('Authentication bypass fix', 'critical', 'testing', ARRAY['API Gateway', 'User Management'], 'Fixed JWT token validation logic'),
('Database access controls', 'medium', 'in_progress', ARRAY['Database', 'Reporting System'], 'Implementing row-level security policies');