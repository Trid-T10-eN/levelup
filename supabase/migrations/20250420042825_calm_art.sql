/*
  # Create roadmap progression tables

  1. New Tables
    - `roadmap_levels`
      - `id` (uuid, primary key)
      - `career_path` (text)
      - `level` (integer)
      - `title` (text)
      - `description` (text)
      - `learning_content` (jsonb)
      - `created_at` (timestamp)
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `level_id` (uuid, references roadmap_levels)
      - `completed` (boolean)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create roadmap_levels table
CREATE TABLE IF NOT EXISTS roadmap_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_path text NOT NULL,
  level integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  learning_content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  level_id uuid REFERENCES roadmap_levels NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, level_id)
);

-- Enable RLS
ALTER TABLE roadmap_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for roadmap_levels
CREATE POLICY "Roadmap levels are viewable by authenticated users"
  ON roadmap_levels
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_progress
CREATE POLICY "Users can view own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can mark levels as complete"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);