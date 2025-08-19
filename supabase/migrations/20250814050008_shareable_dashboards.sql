CREATE TABLE public.shared_dashboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dashboard_id UUID REFERENCES public.dashboard_layout(id) ON DELETE CASCADE,
  public_url_key TEXT NOT NULL UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_dashboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view shared dashboards" ON public.shared_dashboards FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage their own shared links" ON public.shared_dashboards FOR ALL USING (auth.uid() = (SELECT user_id FROM public.dashboard_layout WHERE id = dashboard_id));