-- 0006_savings_points_trigger.sql

CREATE OR REPLACE FUNCTION kopkoppompom_award_savings_points_fn()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_points INTEGER := 0;
BEGIN
    -- 1. Find matching app_user for this anggota_ref
    IF NEW.anggota_ref IS NOT NULL THEN
        SELECT id INTO v_user_id FROM kopkoppompom_app_users 
        WHERE anggota_ref = NEW.anggota_ref LIMIT 1;
    END IF;

    -- Fallback to input_by if no matching anggota_ref was resolved to a user
    IF v_user_id IS NULL THEN
        SELECT id INTO v_user_id FROM kopkoppompom_app_users 
        WHERE id = NEW.input_by LIMIT 1;
    END IF;

    -- 2. Award points if a valid user is identified
    IF v_user_id IS NOT NULL THEN
        IF NEW.type = 'simpanan_pokok' THEN
            v_points := 5; -- Flat points for mandatory initial savings
        ELSIF NEW.type = 'simpanan_wajib' THEN
            v_points := 10; -- Flat points for mandatory weekly/monthly savings
        ELSIF NEW.type = 'simpanan_sukarela' THEN
            -- Proportional points: 1 point for every Rp10.000 saved
            v_points := FLOOR(NEW.amount / 10000);
            IF v_points < 1 THEN
                v_points := 1; -- Minimum 1 point for any voluntary saving
            END IF;
        END IF;

        IF v_points > 0 THEN
            -- Insert or update user points
            INSERT INTO kopkoppompom_user_points (user_id, total_points)
            VALUES (v_user_id, v_points)
            ON CONFLICT (user_id)
            DO UPDATE SET total_points = kopkoppompom_user_points.total_points + v_points;

            -- Create in-app notification
            INSERT INTO kopkoppompom_notifications (user_id, type, title, body, reference_id, is_read, sent_via)
            VALUES (
                v_user_id, 
                'system_info', 
                'Poin Simpanan Bertambah!', 
                'Selamat! Anda mendapatkan ' || v_points || ' Poin atas pembayaran ' || REPLACE(NEW.type, '_', ' ') || ' sebesar Rp' || TO_CHAR(NEW.amount, 'FM999,999,999') || '.',
                NEW.id,
                FALSE,
                'in_app'
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_award_savings_points
AFTER UPDATE OF status ON kopkoppompom_transaksi_keuangan
FOR EACH ROW
WHEN (NEW.status = 'disetujui' AND OLD.status <> 'disetujui' AND NEW.type IN ('simpanan_pokok', 'simpanan_wajib', 'simpanan_sukarela'))
EXECUTE FUNCTION kopkoppompom_award_savings_points_fn();
