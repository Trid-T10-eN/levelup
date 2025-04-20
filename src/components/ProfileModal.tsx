import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Flame, 
  Trophy, 
  Calendar, 
  Brain, 
  Briefcase,
  ArrowUp,
  Star,
  Heart
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const user = {
    name: "John Doe",
    joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    streak: 7,
    level: 12,
    xp: 1250,
    totalXp: 2000,
    skills: [
      { name: "React", level: 8 },
      { name: "JavaScript", level: 7 },
      { name: "TypeScript", level: 6 },
      { name: "Node.js", level: 5 },
      { name: "CSS", level: 7 }
    ],
    recommendations: [
      {
        role: "Senior Frontend Developer",
        company: "Tech Corp",
        match: 95
      },
      {
        role: "Full Stack Engineer",
        company: "StartUp Inc",
        match: 88
      },
      {
        role: "React Developer",
        company: "Digital Solutions",
        match: 85
      }
    ]
  };

  const getDaysOnPlatform = () => {
    return Math.floor((Date.now() - user.joinDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-2xl w-full max-w-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-[#0000FF] to-[#5959ff]">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-blue-100">Level {user.level} Explorer</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 p-6">
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{user.streak}</p>
                <p className="text-sm text-gray-400">Day Streak</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <Calendar className="w-6 h-6 text-[#0000FF] mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{getDaysOnPlatform()}</p>
                <p className="text-sm text-gray-400">Days Active</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{user.level}</p>
                <p className="text-sm text-gray-400">Current Level</p>
              </div>
            </div>

            {/* XP Progress */}
            <div className="px-6 pb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Experience Points</span>
                <span className="text-white">{user.xp} / {user.totalXp} XP</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#0000FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(user.xp / user.totalXp) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            {/* Skills */}
            <div className="px-6 pb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Skills & Proficiency
              </h3>
              <div className="space-y-4">
                {user.skills.map(skill => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-[#0000FF]">Level {skill.level}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#0000FF]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(skill.level / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Recommendations */}
            <div className="px-6 pb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Job Recommendations
              </h3>
              <div className="space-y-3">
                {user.recommendations.map(job => (
                  <motion.div
                    key={job.role}
                    className="bg-gray-800 rounded-lg p-4 flex items-center justify-between group hover:bg-gray-700 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div>
                      <h4 className="text-white font-medium">{job.role}</h4>
                      <p className="text-gray-400 text-sm">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#0000FF]">{job.match}% Match</span>
                      <ArrowUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="px-6 pb-6">
              <div className="bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Recent Achievements
                  </h3>
                  <button className="text-[#0000FF] text-sm hover:text-[#5959ff]">
                    View All
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#0000FF]/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-[#0000FF]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;