import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, ExternalLink, BookOpen, DollarSign } from 'lucide-react';
import { useTheme } from '../App';
import type { RoadmapLevel } from '../lib/roadmap';

interface RoadmapLevelProps {
  level: RoadmapLevel;
  onComplete: () => void;
}

const RoadmapLevel: React.FC<RoadmapLevelProps> = ({ level, onComplete }) => {
  const { isDark } = useTheme();

  if (level.locked) {
    return (
      <motion.div
        className={`rounded-xl p-6 ${
          isDark ? 'bg-gray-800/50' : 'bg-gray-100'
        } border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } opacity-50`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
      >
        <div className="flex items-center justify-center h-32">
          <Lock className="w-8 h-8 text-gray-500" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`rounded-xl p-6 ${
        isDark ? 'bg-gray-800/50' : 'bg-gray-100'
      } border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Level {level.level}: {level.title}
        </h3>
        {level.completed && (
          <CheckCircle className="w-6 h-6 text-green-500" />
        )}
      </div>

      <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {level.description}
      </p>

      <div className="mb-6">
        <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          What you'll learn
        </h4>
        <ul className="space-y-2">
          {level.learning_content.topics.map((topic, index) => (
            <li 
              key={index}
              className={`flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <BookOpen className="w-4 h-4 text-[#0000FF]" />
              {topic}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Recommended Resources
        </h4>
        <div className="space-y-3">
          {level.learning_content.resources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-3 rounded-lg ${
                isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#0000FF]" />
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>
                    {resource.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {resource.platform}
                  </span>
                  {resource.type === 'paid' && (
                    <DollarSign className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {!level.completed && (
        <button
          onClick={onComplete}
          className="w-full py-3 bg-[#0000FF] text-white rounded-lg hover:bg-[#0000dd] transition-colors"
        >
          Mark as Complete
        </button>
      )}
    </motion.div>
  );
};

export default RoadmapLevel;