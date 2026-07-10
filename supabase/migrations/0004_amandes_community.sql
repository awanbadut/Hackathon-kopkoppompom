-- 0004_amandes_community.sql

-- 1. Voting Agendas for e-RAT
CREATE TABLE IF NOT EXISTS kopkoppompom_rat_voting_agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  koperasi_ref VARCHAR(50) NOT NULL REFERENCES kopkoppompom_profil_koperasi(koperasi_ref),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  options TEXT[] NOT NULL, -- Array of options (e.g. ['Setuju', 'Tidak Setuju', 'Abstain'])
  status VARCHAR(20) NOT NULL DEFAULT 'aktif', -- 'aktif', 'selesai'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- 2. Votes cast by members (Anonymous voting, but tracked to prevent double vote)
CREATE TABLE IF NOT EXISTS kopkoppompom_rat_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_id UUID NOT NULL REFERENCES kopkoppompom_rat_voting_agenda(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES kopkoppompom_app_users(id) ON DELETE CASCADE,
  voted_option TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_agenda_user_vote UNIQUE (agenda_id, user_id)
);

-- 3. Community Aspirations & Suggestions
CREATE TABLE IF NOT EXISTS kopkoppompom_community_aspirations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  koperasi_ref VARCHAR(50) NOT NULL REFERENCES kopkoppompom_profil_koperasi(koperasi_ref),
  user_id UUID NOT NULL REFERENCES kopkoppompom_app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  upvotes_count INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'diajukan', -- 'diajukan', 'ditanggapi', 'diarsipkan'
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP WITH TIME ZONE
);

-- 4. Upvotes tracker to prevent duplicate upvotes
CREATE TABLE IF NOT EXISTS kopkoppompom_aspiration_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aspiration_id UUID NOT NULL REFERENCES kopkoppompom_community_aspirations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES kopkoppompom_app_users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_aspiration_user_upvote UNIQUE (aspiration_id, user_id)
);

-- 5. Vouchers in Reward Center
CREATE TABLE IF NOT EXISTS kopkoppompom_reward_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  description TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Redeemed Vouchers
CREATE TABLE IF NOT EXISTS kopkoppompom_user_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES kopkoppompom_app_users(id) ON DELETE CASCADE,
  voucher_id UUID NOT NULL REFERENCES kopkoppompom_reward_vouchers(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL UNIQUE,
  is_redeemed BOOLEAN NOT NULL DEFAULT false,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for all new tables
ALTER TABLE kopkoppompom_rat_voting_agenda ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_rat_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_community_aspirations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_aspiration_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_reward_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE kopkoppompom_user_vouchers ENABLE ROW LEVEL SECURITY;
