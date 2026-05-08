-- ============================================================
-- Insight Clinic — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Appointment booking requests
CREATE TABLE IF NOT EXISTS appointments (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  phone      TEXT,
  service    TEXT        NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  message    TEXT,
  status     TEXT        DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Free 15-minute discovery call requests
CREATE TABLE IF NOT EXISTS discovery_calls (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT,
  main_concern   TEXT,
  preferred_time TEXT,
  status         TEXT        DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Lead magnet email subscribers
CREATE TABLE IF NOT EXISTS leads (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        NOT NULL UNIQUE,
  source     TEXT        DEFAULT 'lead-magnet',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practitioners (managed via admin or Supabase dashboard)
CREATE TABLE IF NOT EXISTS practitioners (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT        NOT NULL,
  role          TEXT        NOT NULL,
  qualifications TEXT,
  bio           TEXT,
  photo_url     TEXT,
  display_order INT         DEFAULT 0,
  active        BOOLEAN     DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- FAQs (managed via admin or Supabase dashboard)
CREATE TABLE IF NOT EXISTS faqs (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  question      TEXT        NOT NULL,
  answer        TEXT        NOT NULL,
  category      TEXT        DEFAULT 'general',
  display_order INT         DEFAULT 0,
  active        BOOLEAN     DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE appointments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads            ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioners    ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs             ENABLE ROW LEVEL SECURITY;

-- Public (anon) can INSERT bookings/calls/leads
CREATE POLICY "Public insert appointments"    ON appointments    FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "Public insert discovery_calls" ON discovery_calls FOR INSERT TO anon WITH CHECK (TRUE);
CREATE POLICY "Public insert leads"           ON leads           FOR INSERT TO anon WITH CHECK (TRUE);

-- Public can READ active practitioners and FAQs
CREATE POLICY "Public read practitioners" ON practitioners FOR SELECT TO anon USING (active = TRUE);
CREATE POLICY "Public read faqs"          ON faqs          FOR SELECT TO anon USING (active = TRUE);

-- Authenticated (service role key) has full access for admin dashboard
CREATE POLICY "Admin all appointments"    ON appointments    FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin all discovery_calls" ON discovery_calls FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin all leads"           ON leads           FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin all practitioners"   ON practitioners   FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Admin all faqs"            ON faqs            FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);

-- ============================================================
-- Seed data
-- ============================================================

INSERT INTO practitioners (name, role, qualifications, bio, display_order) VALUES
  ('Dr. Sarah Mitchell', 'Integrative GP',      'MBChB, MRCGP',          '12 years in integrative medicine. Specialist in complex chronic conditions, functional testing, and root-cause diagnostics.',           1),
  ('James Chen',         'Acupuncturist',        'BSc Acupuncture, BAcC', 'BAcC-registered acupuncturist with expertise in pain management, fertility, hormonal health, and anxiety.',                             2),
  ('Dr. Emma Walsh',     'Nutritional Therapist','mBANT, CNHC',           'BANT-registered specialist in gut health, hormones, autoimmunity, and performance nutrition using advanced functional testing.',          3),
  ('Marcus Reid',        'Osteopath',            'BSc Osteopathy, GOsC',  'GOsC-registered osteopath specialising in chronic pain, sports injury, and postural dysfunction.',                                       4)
ON CONFLICT DO NOTHING;

INSERT INTO faqs (question, answer, category, display_order) VALUES
  ('What is integrative medicine?',
   'Integrative medicine combines conventional medical diagnosis with evidence-based complementary therapies. Rather than treating symptoms in isolation, we investigate the underlying causes driving your symptoms — addressing the body as a whole system.',
   'general', 1),
  ('Do I need a referral?',
   'No referral is needed to book at Insight Clinic. You can book directly online or call us. We see both self-referring patients and those referred by their NHS GP or another healthcare provider.',
   'booking', 2),
  ('How is this different from an NHS GP?',
   'NHS GPs are excellent at identifying and treating disease. Our integrative GP has additional training in root-cause medicine and functional testing — allowing us to investigate sub-optimal function that sits between "normal" and "thriving". Appointments are also 60–90 minutes rather than 10 minutes.',
   'general', 3),
  ('What should I bring to my first appointment?',
   'Please bring: any previous blood test results, letters from specialists, a list of current medications and supplements, and a brief written timeline of your symptoms. The more context we have, the more productive your first appointment will be.',
   'appointments', 4),
  ('How long until I see results?',
   'This varies significantly by condition. Acute musculoskeletal issues often improve within 3–6 sessions. Complex chronic conditions typically require a 3–6 month programme. Most patients notice meaningful improvement within 6–8 weeks of starting their personalised protocol.',
   'treatment', 5),
  ('Do you accept insurance?',
   'Many of our services are covered by private health insurance. We recommend checking your policy before booking. We provide receipts and clinical notes in a format suitable for insurance claims.',
   'billing', 6),
  ('Are your practitioners regulated?',
   'Yes. All practitioners are registered with their relevant UK regulatory body: our GP with the GMC, acupuncturist with the BAcC, nutritional therapist with BANT/CNHC, and osteopath with the GOsC.',
   'general', 7),
  ('How do I know which service is right for me?',
   'Book a free 15-minute discovery call. We will talk through your symptoms and history and recommend the most appropriate starting point — whether that is a single discipline or a combined approach.',
   'booking', 8)
ON CONFLICT DO NOTHING;
