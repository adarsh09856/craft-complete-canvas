REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.bootstrap_first_admin() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM anon, public;