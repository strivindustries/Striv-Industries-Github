CREATE FUNCTION public.submit_booking(p_name text,p_email text,p_phone text,p_service uuid,p_date date,p_time time,p_notes text,p_hash text,p_token text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE aid uuid; BEGIN
IF p_token !~ '^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'Código inválido'; END IF;
aid=public.create_appointment(p_name,p_email,p_phone,p_service,p_date,p_time,p_notes,p_hash);
UPDATE public.notifications SET payload=payload || jsonb_build_object('booking_code',aid::text||'.'||p_token) WHERE appointment_id=aid AND kind='requested';
RETURN aid; END $$;
REVOKE ALL ON FUNCTION public.submit_booking(text,text,text,uuid,date,time,text,text,text) FROM PUBLIC,anon,authenticated; GRANT EXECUTE ON FUNCTION public.submit_booking(text,text,text,uuid,date,time,text,text,text) TO service_role;
ALTER TABLE public.booking_settings ALTER COLUMN minimum_notice_minutes SET DEFAULT 120;
ALTER TABLE public.booking_settings ALTER COLUMN slot_interval_minutes SET DEFAULT 15;
ALTER TABLE public.booking_settings ALTER COLUMN buffer_minutes SET DEFAULT 15;
REVOKE ALL ON FUNCTION public.validate_appointment() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.queue_appointment_notifications() FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC,anon,authenticated;