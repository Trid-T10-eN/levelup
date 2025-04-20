import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  BookOpen, 
  Brain, 
  Calendar, 
  Clock, 
  Flag, 
  Target,
  Trophy
} from 'lucide-react';
import Header from './Header';
import ParticleBackground from './ParticleBackground';
import { useTheme } from '../App';

const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  
  const stats = [
    { label: 'Current Streak', value: '7 days', icon: Calendar },
    { label: 'Time Invested', value: '24.5 hrs', icon: Clock },
    { label: 'Skills Gained', value: '12', icon: Brain },
    { label: 'Courses Completed', value: '3', icon: BookOpen }
  ];

  const nextMilestones = [
    'Complete "Advanced React Patterns" course',
    'Practice system design concepts',
    'Build a full-stack project',
    'Update portfolio with new skills'
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-accent-black' : 'bg-white'} relative overflow-hidden`}>
      <ParticleBackground />
      <Header />
      
      <main className="container mx-auto px-4 pt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#0000FF]/20 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-[#0000FF]" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    John Doe
                  </h2>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Aspiring Full Stack Developer
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {stats.map(({ label, value, icon: Icon }) => (
                  <div key={label} className={`p-4 rounded-xl ${
                    isDark 
                      ? 'bg-gray-800/50 border-gray-700' 
                      : 'bg-gray-50 border-gray-200'
                  } border`}>
                    <Icon className="w-5 h-5 text-[#0000FF] mb-2" />
                    <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {label}
                    </div>
                    <div className={`text-lg font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <Target className="w-5 h-5 text-[#0000FF] mr-2" />
                Next Milestones
              </h3>
              <ul className="space-y-3">
                {nextMilestones.map((milestone, index) => (
                  <li key={index} className="flex items-center">
                    <Flag className="w-4 h-4 text-[#0000FF] mr-2 flex-shrink-0" />
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {milestone}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Center & Right Columns - Progress & Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className={`rounded-2xl p-6 border backdrop-blur-sm ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                <BarChart3 className="w-5 h-5 text-[#0000FF] mr-2" />
                Learning Progress
              </h3>
              <div className="h-64 flex items-center justify-center">
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Progress chart will be implemented here
                </p>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Recommended Courses
                </h3>
                <div className="space-y-3">
                  {['System Design Fundamentals', 'Advanced JavaScript', 'Cloud Architecture'].map((course, index) => (
                    <div key={index} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      isDark 
                        ? 'bg-gray-800/50 border-gray-700 hover:border-[#0000FF]/30' 
                        : 'bg-gray-50 border-gray-200 hover:border-[#0000FF]/30'
                    }`}>
                      <BookOpen className="w-4 h-4 text-[#0000FF] mr-2" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {course}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`rounded-2xl p-6 border backdrop-blur-sm ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  AI Insights
                </h3>
                <div className="space-y-3">
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Based on your progress, consider focusing on backend development skills to complement your frontend expertise.
                  </p>
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-[#0000FF]/20 text-[#0000FF] rounded-lg text-sm hover:bg-[#0000FF]/30 transition-colors">
                      Get Detailed Analysis
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;