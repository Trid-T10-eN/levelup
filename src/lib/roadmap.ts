import { supabase } from './supabase';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface RoadmapLevel {
  id: string;
  level: number;
  title: string;
  description: string;
  learning_content: {
    topics: string[];
    resources: {
      title: string;
      url: string;
      type: 'free' | 'paid';
      platform: string;
    }[];
  };
  completed: boolean;
  locked: boolean;
  completed_at?: string;
}

export const generateRoadmapLevels = async (careerPath: string) => {
  try {
    // First check if levels already exist for this career path
    const { data: existingLevels } = await supabase
      .from('roadmap_levels')
      .select('*')
      .eq('career_path', careerPath)
      .order('level');

    if (existingLevels && existingLevels.length > 0) {
      return existingLevels;
    }

    // Generate new levels using OpenAI
    const prompt = `Create a detailed 10-level learning roadmap for ${careerPath}. For each level, provide:
    1. A title
    2. A description
    3. Key topics to learn
    4. Learning resources (mix of free and paid options)

    Format the response as a JSON array with 10 objects, each containing:
    {
      "level": number,
      "title": "string",
      "description": "string",
      "learning_content": {
        "topics": ["topic1", "topic2"],
        "resources": [
          {
            "title": "string",
            "url": "string",
            "type": "free" or "paid",
            "platform": "string"
          }
        ]
      }
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 2500
    });

    const levels = JSON.parse(completion.choices[0].message.content || '[]');

    // Store the generated levels in the database
    const { data: savedLevels, error } = await supabase
      .from('roadmap_levels')
      .insert(
        levels.map((level: any) => ({
          career_path: careerPath,
          ...level
        }))
      )
      .select();

    if (error) throw error;
    return savedLevels;
  } catch (error) {
    console.error('Error generating roadmap levels:', error);
    throw error;
  }
};

export const getUserProgress = async (userId: string, careerPath: string) => {
  try {
    // Get the latest career history for this path
    const { data: careerHistory } = await supabase
      .from('career_history')
      .select('*')
      .eq('user_id', userId)
      .eq('career_path', careerPath)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (!careerHistory) {
      // Start new career path if none exists
      const { data: newHistory, error: historyError } = await supabase
        .from('career_history')
        .insert({
          user_id: userId,
          career_path: careerPath,
          started_at: new Date().toISOString(),
          completion_percentage: 0
        })
        .select()
        .single();

      if (historyError) throw historyError;
      return getUserProgress(userId, careerPath);
    }

    // Get all levels with their progress
    const { data: levels, error } = await supabase
      .from('roadmap_levels')
      .select(`
        *,
        user_progress!left (
          completed,
          completed_at
        )
      `)
      .eq('career_path', careerPath)
      .order('level');

    if (error) throw error;
    if (!levels) return [];

    // Process levels with progress and locking logic
    return levels.map((level, index) => {
      const isCompleted = level.user_progress?.[0]?.completed || false;
      const previousLevel = index > 0 ? levels[index - 1] : null;
      const previousCompleted = !previousLevel || previousLevel.user_progress?.[0]?.completed || false;

      return {
        ...level,
        completed: isCompleted,
        completed_at: level.user_progress?.[0]?.completed_at || null,
        locked: index !== 0 && !previousCompleted
      };
    });
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
};

export const markLevelComplete = async (userId: string, levelId: string) => {
  try {
    // Get the level details
    const { data: level, error: levelError } = await supabase
      .from('roadmap_levels')
      .select('*')
      .eq('id', levelId)
      .single();

    if (levelError) throw levelError;

    // Get the current career history
    const { data: careerHistory, error: historyError } = await supabase
      .from('career_history')
      .select('*')
      .eq('user_id', userId)
      .eq('career_path', level.career_path)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (historyError) throw historyError;

    // Mark the level as complete
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        level_id: levelId,
        career_path_id: careerHistory.id,
        completed: true,
        completed_at: new Date().toISOString()
      });

    if (progressError) throw progressError;

    // Calculate new completion percentage
    const { data: totalLevels } = await supabase
      .from('roadmap_levels')
      .select('id')
      .eq('career_path', level.career_path);

    const { data: completedLevels } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('career_path_id', careerHistory.id)
      .eq('completed', true);

    const completionPercentage = Math.round(
      ((completedLevels?.length || 0) * 100) / (totalLevels?.length || 1)
    );

    // Update career history with new completion percentage
    const { error: updateError } = await supabase
      .from('career_history')
      .update({
        completion_percentage: completionPercentage,
        completed_at: completionPercentage === 100 ? new Date().toISOString() : null
      })
      .eq('id', careerHistory.id);

    if (updateError) throw updateError;

    // Return updated progress
    return getUserProgress(userId, level.career_path);
  } catch (error) {
    console.error('Error marking level as complete:', error);
    throw error;
  }
};