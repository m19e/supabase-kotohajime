-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.tasks
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL DEFAULT auth.uid(),
    title text COLLATE pg_catalog."default" NOT NULL,
    is_completed boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT title_length_check CHECK (char_length(title) > 0)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tasks
    OWNER to postgres;

ALTER TABLE IF EXISTS public.tasks
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.tasks TO anon;

GRANT ALL ON TABLE public.tasks TO authenticated;

GRANT ALL ON TABLE public.tasks TO postgres;

GRANT ALL ON TABLE public.tasks TO service_role;
CREATE POLICY "Users can delete their own tasks"
    ON public.tasks
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = user_id));
CREATE POLICY "Users can insert their own tasks"
    ON public.tasks
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can select their own tasks"
    ON public.tasks
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = user_id));
CREATE POLICY "Users can update their own tasks"
    ON public.tasks
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((auth.uid() = user_id))
    WITH CHECK ((auth.uid() = user_id));
