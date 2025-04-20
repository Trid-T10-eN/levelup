/*
  # Career Progress Tracking

  1. New Tables
    - `career_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `career_path` (text)
      - `started_at` (timestamp)
      - `completed_at` (timestamp, nullable)
      - `completion_percentage` (integer)

  2. Changes
    - Add `career_path_id` to user_progress table
    - Add foreign key constraint
    
  3. Security
    - Enable RLS on new table
    - Add policies for authenticated users
*/

-- Create career_history table
CREATE TABLE IF NOT EXISTS career_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  career_path text NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  completion_percentage integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add RLS
ALTER TABLE career_history ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view their own career history"
  ON career_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own career history"
  ON career_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own career history"
  ON career_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add career_path_id to user_progress
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS career_path_id uuid REFERENCES career_history(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_career_path 
ON user_progress(career_path_id);

-- Create index for career history lookups
CREATE INDEX IF NOT EXISTS idx_career_history_user 
ON career_history(user_id);