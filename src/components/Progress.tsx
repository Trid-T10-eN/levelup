import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Trophy, Brain, Clock, Star, PartyPopper as Party } from 'lucide-react';
import Confetti from 'react-confetti';
import Header from './Header';
import { useTheme } from '../App';
import { useAuth } from '../App';
import { supabase } from '../lib/supabase';

interface ProgressStats {
  completedLevels: number;
  totalLevels: number;
  totalHours: number;
  skills: string[];
}

const Progress = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState<ProgressStats>({
    completedLevels: 0,
    totalLevels: 0,
    totalHours: 0,
    skills: []
  });
  const [skillsData, setSkillsData] = useState<{ name: string; count: number }[]>([]);
  const [progressData, setProgressData] = useState<{ date: string; completed: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const savedPath = localStorage.getItem('careerPath');
        if (!savedPath) return;
        
        const careerData = JSON.parse(savedPath)[0];

        const { data: progress } = await supabase
          .from('user_progress')
          .select(`
            *,
            roadmap_levels (
              id,
              level,
              learning_content
            )
          `)
          .eq('user_id', user.id)
          .order('completed_at');

        if (!progress) return;

        const { data: totalLevels } = await supabase
          .from('roadmap_levels')
          .select('id')
          .eq('career_path', careerData.title);

        const completedLevels = progress.filter(p => p.completed).length;
        const totalLevelsCount = totalLevels?.length || 0;

        // Check if all levels are completed
        if (completedLevels === totalLevelsCount && totalLevelsCount > 0) {
          setShowCelebration(true);
          // Hide celebration after 10 seconds
          setTimeout(() => setShowCelebration(false), 10000);
        }

        const skillsMap = new Map<string, number>();
        progress.forEach(p => {
          if (p.completed && p.roadmap_levels.learning_content.topics) {
            p.roadmap_levels.learning_content.topics.forEach((topic: string) => {
              skillsMap.set(topic, (skillsMap.get(topic) || 0) + 1);
            });
          }
        });

        const skillsChartData = Array.from(skillsMap.entries()).map(([name, count]) => ({
          name,
          count
        }));

        const timelineData = progress
          .filter(p => p.completed)
          .map((p, index) => ({
            date: new Date(p.completed_at).toLocaleDateString(),
            completed: ((index + 1) / (totalLevels?.length || 1)) * 100
          }));

        setStats({
          completedLevels,
          totalLevels: totalLevels?.length || 0,
          totalHours: completedLevels * 2,
          skills: Array.from(skillsMap.keys())
        });

        setSkillsData(skillsChartData);
        setProgressData(timelineData);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  const completionPercentage = stats.totalLevels ? (stats.completedLevels / stats.totalLevels) * 100 : 0;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-accent-black' : 'bg-white'}`}>
      <Header />
      
      {/* Celebration Effects */}
      {showCelebration && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={200}
            recycle={false}
            colors={['#FFD700', '#0000FF', '#FF69B4', '#00FF00', '#FF4500']}
          />
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <motion.div
                className={`p-8 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-xl text-center`}
                animate={{
                  y: [0, -20, 0],
                  transition: { duration: 2, repeat: Infinity }
                }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#0000FF] flex items-center justify-center"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Congratulations! 🎉
                </h2>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  You've completed 100% of your learning path!
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-16">
        <motion.h1 
          className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-8`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Learning Progress
        </motion.h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Trophy className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Progress
                </p>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {Math.round(completionPercentage)}%
                </h3>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>

          <motion.div
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Time Invested
                </p>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalHours} hrs
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Brain className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Skills Learned
                </p>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.skills.length}
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Star className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Completed Levels
                </p>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stats.completedLevels} / {stats.totalLevels}
                </h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Timeline */}
          <motion.div
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Learning Progress Timeline
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={isDark ? '#9CA3AF' : '#4B5563'}
                    tick={{ fill: isDark ? '#9CA3AF' : '#4B5563' }}
                  />
                  <YAxis 
                    stroke={isDark ? '#9CA3AF' : '#4B5563'}
                    tick={{ fill: isDark ? '#9CA3AF' : '#4B5563' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#0000FF"
                    strokeWidth={2}
                    dot={{ fill: '#0000FF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Skills Distribution */}
          <motion.div
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 shadow-lg border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Skills Distribution
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    type="number"
                    stroke={isDark ? '#9CA3AF' : '#4B5563'}
                    tick={{ fill: isDark ? '#9CA3AF' : '#4B5563' }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    stroke={isDark ? '#9CA3AF' : '#4B5563'}
                    tick={{ fill: isDark ? '#9CA3AF' : '#4B5563' }}
                    width={150}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar dataKey="count" fill="#0000FF" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Progress;