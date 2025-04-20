/*
  # Fix user progress constraints and relationships

  1. Changes
    - Add unique constraint for user_id and level_id combination
    - Add cascade delete for career_path_id foreign key
    - Add NOT NULL constraint for career_path_id
    - Add index for faster progress lookups

  2. Security
    - Update RLS policies to include career_path_id checks
*/

-- Add NOT NULL constraint to career_path_id
ALTER TABLE user_progress 
ALTER COLUMN career_path_id SET NOT NULL;

-- Drop existing unique constraint if exists
ALTER TABLE user_progress
DROP CONSTRAINT IF EXISTS user_progress_user_id_level_id_key;

-- Add new unique constraint including career_path_id
ALTER TABLE user_progress
ADD CONSTRAINT user_progress_user_id_level_id_career_path_id_key 
UNIQUE (user_id, level_id, career_path_id);

-- Update foreign key to cascade on delete
ALTER TABLE user_progress
DROP CONSTRAINT IF EXISTS user_progress_career_path_id_fkey;

ALTER TABLE user_progress
ADD CONSTRAINT user_progress_career_path_id_fkey 
FOREIGN KEY (career_path_id) 
REFERENCES career_history(id) 
ON DELETE CASCADE;

-- Add composite index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_lookup
ON user_progress(user_id, career_path_id, level_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;

CREATE POLICY "Users can update own progress"
ON user_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own progress"
ON user_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);