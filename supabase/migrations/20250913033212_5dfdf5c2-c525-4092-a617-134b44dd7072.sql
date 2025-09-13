-- Remove the potentially unsafe public_authors view
-- The get_author_info() function provides the same functionality more securely

DROP VIEW IF EXISTS public.public_authors;