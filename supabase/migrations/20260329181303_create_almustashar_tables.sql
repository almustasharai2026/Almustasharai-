/*
  # Al-Mustashar AI Database Schema

  ## Overview
  This migration creates the complete database schema for the Al-Mustashar AI legal consultation platform.

  ## 1. New Tables

  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `credits` (integer, default 100) - Free consultation credits
  - `preferred_language` (text, default 'ar') - 'ar' or 'en'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `legal_personas`
  - `id` (uuid, primary key)
  - `name_ar` (text) - Arabic name
  - `name_en` (text) - English name
  - `description_ar` (text) - Arabic description
  - `description_en` (text) - English description
  - `specialty` (text) - Legal specialty area
  - `icon` (text) - Icon identifier
  - `system_prompt` (text) - AI personality prompt
  - `created_at` (timestamptz)

  ### `consultations`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `persona_id` (uuid, references legal_personas)
  - `title` (text)
  - `status` (text, default 'active') - 'active' or 'archived'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `messages`
  - `id` (uuid, primary key)
  - `consultation_id` (uuid, references consultations)
  - `role` (text) - 'user' or 'assistant'
  - `content` (text)
  - `created_at` (timestamptz)

  ### `credit_transactions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `amount` (integer) - Positive for additions, negative for usage
  - `type` (text) - 'initial', 'message', 'bonus', etc.
  - `description` (text)
  - `created_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Users can only read/write their own data
  - Legal personas are publicly readable
  - Proper authentication checks using auth.uid()

  ## 3. Initial Data
  - Insert 6 legal personas covering different specialties
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  credits integer DEFAULT 100 NOT NULL,
  preferred_language text DEFAULT 'ar' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create legal_personas table
CREATE TABLE IF NOT EXISTS legal_personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  description_ar text NOT NULL,
  description_en text NOT NULL,
  specialty text NOT NULL,
  icon text NOT NULL,
  system_prompt text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  persona_id uuid REFERENCES legal_personas(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  status text DEFAULT 'active' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for legal_personas (public read)
CREATE POLICY "Anyone can view legal personas"
  ON legal_personas FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for consultations
CREATE POLICY "Users can view own consultations"
  ON consultations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own consultations"
  ON consultations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own consultations"
  ON consultations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own consultations"
  ON consultations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in own consultations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM consultations
      WHERE consultations.id = messages.consultation_id
      AND consultations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own consultations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM consultations
      WHERE consultations.id = messages.consultation_id
      AND consultations.user_id = auth.uid()
    )
  );

-- RLS Policies for credit_transactions
CREATE POLICY "Users can view own credit transactions"
  ON credit_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own credit transactions"
  ON credit_transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert 6 Legal Personas
INSERT INTO legal_personas (name_ar, name_en, description_ar, description_en, specialty, icon, system_prompt) VALUES
(
  'المحامي العام',
  'General Lawyer',
  'محامي شامل متخصص في جميع المجالات القانونية، يقدم استشارات عامة في القانون المدني والتجاري',
  'Comprehensive lawyer specialized in all legal fields, providing general consultations in civil and commercial law',
  'general',
  'scale',
  'You are a professional general lawyer providing comprehensive legal advice in Arabic. Be thorough, precise, and reference relevant laws when applicable.'
),
(
  'محامي الأسرة',
  'Family Lawyer',
  'متخصص في قضايا الأحوال الشخصية، الزواج، الطلاق، الحضانة، والميراث',
  'Specialized in personal status issues, marriage, divorce, custody, and inheritance',
  'family',
  'users',
  'You are a compassionate family lawyer specialized in personal status law. Provide empathetic yet professional advice on family matters in Arabic.'
),
(
  'محامي العقارات',
  'Real Estate Lawyer',
  'خبير في قانون العقارات، البيع والشراء، الإيجارات، والنزاعات العقارية',
  'Expert in real estate law, buying and selling, rentals, and property disputes',
  'real_estate',
  'building',
  'You are a real estate lawyer with expertise in property law. Provide detailed advice on real estate transactions and disputes in Arabic.'
),
(
  'محامي العمل',
  'Labor Lawyer',
  'متخصص في قانون العمل، حقوق الموظفين، العقود، والنزاعات العمالية',
  'Specialized in labor law, employee rights, contracts, and labor disputes',
  'labor',
  'briefcase',
  'You are a labor lawyer advocating for workers rights. Provide clear guidance on employment law and workplace issues in Arabic.'
),
(
  'محامي الشركات',
  'Corporate Lawyer',
  'خبير في القانون التجاري، تأسيس الشركات، العقود التجارية، والاستثمار',
  'Expert in commercial law, company formation, commercial contracts, and investment',
  'corporate',
  'building-2',
  'You are a corporate lawyer with business acumen. Provide strategic legal advice for businesses and commercial matters in Arabic.'
),
(
  'محامي جنائي',
  'Criminal Lawyer',
  'متخصص في القانون الجنائي، الدفاع في القضايا الجنائية، وحقوق المتهمين',
  'Specialized in criminal law, defense in criminal cases, and rights of the accused',
  'criminal',
  'shield',
  'You are a criminal defense lawyer. Provide strong legal defense strategies and explain criminal law procedures in Arabic.'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_persona_id ON consultations(persona_id);
CREATE INDEX IF NOT EXISTS idx_messages_consultation_id ON messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();