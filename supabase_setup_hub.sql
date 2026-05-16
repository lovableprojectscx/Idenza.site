-- ==========================================
-- SCRIPT DE CREACIÓN PARA HUB (Idenza)
-- ==========================================

-- 1. Tabla para Informes y Anuncios (Blog/CMS)
CREATE TABLE IF NOT EXISTS public.content_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  post_type text NOT NULL CHECK (post_type IN ('informe', 'anuncio')),
  cover_image_url text,
  seo_keywords text,
  is_published boolean DEFAULT false,
  author_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS en content_posts
ALTER TABLE public.content_posts ENABLE ROW LEVEL SECURITY;

-- Políticas para content_posts
-- Cualquier visitante (anónimo) puede leer los posts que estén publicados
CREATE POLICY "Public can view published posts" ON public.content_posts
  FOR SELECT USING (is_published = true);

-- Solo usuarios autenticados (admin) pueden insertar, actualizar y eliminar posts
-- (Ajustar según tu sistema de auth real, esto asume que usas Supabase Auth)
CREATE POLICY "Authenticated users can manage posts" ON public.content_posts
  FOR ALL USING (auth.role() = 'authenticated');


-- 2. Tablas para Foros / Debates

-- Tema de foro
CREATE TABLE IF NOT EXISTS public.forum_topics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- Si se borra el usuario, queda el post anónimo
  author_name text, -- Para guardar nombre si no usamos auth estricto
  views integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS en forum_topics
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;

-- Cualquier persona puede ver los temas de debate
CREATE POLICY "Public can view forum topics" ON public.forum_topics
  FOR SELECT USING (true);

-- Autenticados pueden crear nuevos temas de debate
CREATE POLICY "Authenticated users can create topics" ON public.forum_topics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
-- Respuestas en los foros
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id uuid REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS en forum_replies
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Cualquier persona puede ver las respuestas
CREATE POLICY "Public can view forum replies" ON public.forum_replies
  FOR SELECT USING (true);

-- Solo autenticados pueden responder
CREATE POLICY "Authenticated users can create replies" ON public.forum_replies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 3. Funciones y Triggers para 'updated_at'
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_updated
  BEFORE UPDATE ON public.content_posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_topic_updated
  BEFORE UPDATE ON public.forum_topics
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
