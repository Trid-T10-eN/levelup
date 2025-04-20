/*
  # Fix user progress constraints and relationships

  1. Changes
    - Handle NULL values in career_path_id
    - Add unique constraint for user_id and level_id combination
    - Add cascade delete for career_path_id foreign key
    - Add NOT NULL constraint for career_path_id
    - Add index for faster progress lookups

  2. Security
    - Update RLS policies to include career_path_id checks
*/

-- First, create a new career history entry for any user progress without one
DO $$
BEGIN
  INSERT INTO career_history (id, user_id, career_path, started_at, completion_percentage)
  SELECT 
    gen_random_uuid(),
    up.user_id,
    rl.career_path,
    COALESCE(MIN(up.created_at), NOW()),
    0
  FROM user_progress up
  JOIN roadmap_levels rl ON up.level_id = rl.id
  WHERE up.career_path_id IS NULL
  GROUP BY up.user_id, rl.career_path;

  -- Update user_progress entries with the new career_history ids
  UPDATE user_progress up
  SET career_path_id = ch.id
  FROM career_history ch
  JOIN roadmap_levels rl ON rl.career_path = ch.career_path
  WHERE up.level_id = rl.id
  AND up.user_id = ch.user_id
  AND up.career_path_id IS NULL;
END $$;

-- Now we can safely add the NOT NULL constraint
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