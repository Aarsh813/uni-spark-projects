-- Create table for project messages so users can chat within joined projects
-- IMPORTANT: Uses RLS to restrict access to project author and users who expressed interest

CREATE TABLE IF NOT EXISTS public.project_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON public.project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_project_created_at ON public.project_messages(project_id, created_at);

-- Policy: Users can view messages for projects they own or are interested in
CREATE POLICY "Users can view messages for joined or owned projects"
ON public.project_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects pr
    WHERE pr.id = project_id AND pr.author_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.project_interests pi
    WHERE pi.project_id = project_id AND pi.user_id = auth.uid()
  )
);

-- Policy: Users can insert messages only if they are the sender and belong to the project (owner or interested)
CREATE POLICY "Users can send messages in joined or owned projects"
ON public.project_messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND (
    EXISTS (
      SELECT 1 FROM public.projects pr
      WHERE pr.id = project_id AND pr.author_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.project_interests pi
      WHERE pi.project_id = project_id AND pi.user_id = auth.uid()
    )
  )
);

-- Policy: Users can delete their own messages (optional safety)
CREATE POLICY "Users can delete their own messages"
ON public.project_messages
FOR DELETE
USING (sender_id = auth.uid());