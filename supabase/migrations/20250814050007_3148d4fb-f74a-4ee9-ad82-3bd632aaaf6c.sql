-- Create storage bucket for widget images
INSERT INTO storage.buckets (id, name, public)
VALUES ('widget-images', 'widget-images', true);

-- Create RLS policies for widget image uploads
CREATE POLICY "Anyone can view widget images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'widget-images');

CREATE POLICY "Admins can upload widget images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'widget-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admins can update widget images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'widget-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Super admins can delete widget images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'widget-images' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Create a table for widget content
CREATE TABLE public.widget_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  image_url TEXT,
  widget_type TEXT NOT NULL DEFAULT 'content',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on widget_content table
ALTER TABLE public.widget_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for widget_content
CREATE POLICY "Everyone can view widget content"
ON public.widget_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert widget content"
ON public.widget_content
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admins can update widget content"
ON public.widget_content
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Super admins can delete widget content"
ON public.widget_content
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'super_admin'
  )
);

-- Create trigger for updating timestamps
CREATE TRIGGER update_widget_content_updated_at
BEFORE UPDATE ON public.widget_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();