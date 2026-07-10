CREATE TABLE IF NOT EXISTS kopkoppompom_weekly_missions_claim (
    user_id UUID NOT NULL,
    mission_code VARCHAR(50) NOT NULL,
    week_start DATE NOT NULL,
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    points_awarded INTEGER NOT NULL,
    PRIMARY KEY (user_id, mission_code, week_start)
);

ALTER TABLE kopkoppompom_weekly_missions_claim ENABLE ROW LEVEL SECURITY;

-- Disable RLS filters for ease of development in demo
CREATE POLICY weekly_missions_claim_all_policy ON kopkoppompom_weekly_missions_claim
    FOR ALL USING (true) WITH CHECK (true);
