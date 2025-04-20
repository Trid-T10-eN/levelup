import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeResponses = async (responses: string[]) => {
  try {
    if (!responses || responses.length < 5) {
      throw new Error('Please answer all questions before proceeding.');
    }

    const prompt = `Based on the following user responses, suggest 4-5 most suitable career paths in tech with detailed explanations and personalized insights:
      
Current Position: ${responses[0]}
Preferred Activities: ${responses[1]}
Strongest Skills: ${responses[2]}
Preferred Work Environment: ${responses[3]}
Career Motivation: ${responses[4]}

For each career suggestion, provide:
1. A specific job title
2. A personalized description explaining why it matches their profile
3. Required technical and soft skills
4. Estimated salary range
5. Career growth potential
6. A match score based on their responses

Format the response as a JSON array with this structure:
{
  "careers": [
    {
      "title": "Career Title",
      "description": "Personalized description explaining the match",
      "skills": ["Required skill 1", "Required skill 2", "Required skill 3", "Required skill 4", "Required skill 5"],
      "salary": "Salary range",
      "growth": "Growth potential description",
      "matchScore": 95,
      "timeline": "Estimated timeline to achieve proficiency"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 2000
    });

    const responseText = completion.choices[0].message.content;
    
    try {
      const result = JSON.parse(responseText || '{"careers": []}');
      if (!result.careers || !Array.isArray(result.careers) || result.careers.length === 0) {
        throw new Error('Invalid response format from OpenAI');
      }

      // Transform the OpenAI response into the format expected by the UI
      return result.careers.map((career: any) => ({
        title: career.title,
        description: career.description,
        skills: career.skills,
        matchScore: career.matchScore,
        salary: career.salary,
        demand: getDemand(career.matchScore),
        timeline: career.timeline,
        color: getColorForPath(career.title),
        icon: getIconForPath(career.title)
      }));
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw parseError;
    }
  } catch (error: any) {
    console.error('Error in analyzeResponses:', error);
    throw error;
  }
};

const getIconForPath = (title: string) => {
  const icons = {
    'Full Stack Developer': 'Code',
    'Data Scientist': 'Database',
    'UX Designer': 'Palette',
    'DevOps Engineer': 'Shield',
    'AI/ML Engineer': 'Brain',
    'Cloud Architect': 'Cloud',
    'Cybersecurity Engineer': 'Lock',
    'Mobile Developer': 'Smartphone',
    'default': 'Code'
  };
  return icons[title as keyof typeof icons] || icons.default;
};

const getColorForPath = (title: string) => {
  const colors = {
    'Full Stack Developer': 'from-blue-500 to-indigo-500',
    'Data Scientist': 'from-purple-500 to-pink-500',
    'UX Designer': 'from-pink-500 to-rose-500',
    'DevOps Engineer': 'from-green-500 to-teal-500',
    'AI/ML Engineer': 'from-red-500 to-orange-500',
    'Cloud Architect': 'from-cyan-500 to-blue-500',
    'Cybersecurity Engineer': 'from-yellow-500 to-orange-500',
    'Mobile Developer': 'from-indigo-500 to-violet-500',
    'default': 'from-blue-500 to-indigo-500'
  };
  return colors[title as keyof typeof colors] || colors.default;
};

const getDemand = (matchScore: number) => {
  if (matchScore >= 90) return 'Very High';
  if (matchScore >= 80) return 'High';
  return 'Moderate';
};