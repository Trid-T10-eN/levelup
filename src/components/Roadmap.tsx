import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, Star, Lock, ExternalLink, CheckCircle, Play, MapPin, Rocket } from 'lucide-react';
import Header from './Header';
import { useTheme } from '../App';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { generateRoadmapLevels, getUserProgress, markLevelComplete } from '../lib/roadmap';

const Roadmap = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCareerPath, setHasCareerPath] = useState(false);

  useEffect(() => {
    const checkCareerPath = async () => {
      try {
        setLoading(true);
        const savedPath = localStorage.getItem('careerPath');
        
        if (!savedPath) {
          setHasCareerPath(false);
          return;
        }

        const careerData = JSON.parse(savedPath);
        if (!careerData || !careerData.length) {
          setHasCareerPath(false);
          return;
        }

        setHasCareerPath(true);
      } catch (err) {
        console.error('Error checking career path:', err);
        setHasCareerPath(false);
      } finally {
        setLoading(false);
      }
    };

    checkCareerPath();
  }, []);

  const handleStartJourney = () => {
    navigate('/career-paths');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[#0000FF]" />
      </div>
    );
  }

  if (!hasCareerPath) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-accent-black' : 'bg-white'}`}>
        <Header />
        <div className="max-w-4xl mx-auto px-4 pt-32">
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Rocket className="w-12 h-12 text-white" />
              </div>
              <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Start Your Learning Journey
              </h1>
              <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Take our quick assessment to discover your personalized learning roadmap.
              </p>
              <motion.button
                onClick={handleStartJourney}
                className={`px-8 py-4 text-lg font-medium rounded-full ${
                  isDark 
                    ? 'bg-white text-black hover:bg-gray-100' 
                    : 'bg-[#0000FF] text-white hover:bg-[#0000dd]'
                } transition-all duration-300 flex items-center gap-2 mx-auto`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin className="w-5 h-5" />
                Start My Journey
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return <RoadmapContent />;
};

const RoadmapContent = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [levels, setLevels] = useState<RoadmapLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      const savedPath = localStorage.getItem('careerPath');
      if (!savedPath) {
        throw new Error('No career path selected');
      }

      const careerData = JSON.parse(savedPath)[0];
      if (user) {
        const progress = await getUserProgress(user.id, careerData.title);
        setLevels(progress);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, [user]);

  const handleLevelComplete = async (levelId: string) => {
    if (!user || updating) return;

    try {
      setUpdating(true);
      const updatedLevels = await markLevelComplete(user.id, levelId);
      setLevels(updatedLevels);
      setSelectedLevel(null);
    } catch (err: any) {
      console.error('Error marking level as complete:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[#0000FF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-accent-black' : 'bg-white'}`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Learning Journey
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Master your skills step by step with our curated learning path
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {levels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${
                isDark ? 'bg-gray-900' : 'bg-gray-50'
              } rounded-2xl overflow-hidden border ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}
            >
              <div className={`p-4 border-b ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    /{String(index + 1).padStart(2, '0')}
                  </span>
                  {level.completed ? (
                    <Star className="w-5 h-5 text-[#0000FF] fill-[#0000FF]" />
                  ) : level.locked ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {level.title}
                </h3>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                } line-clamp-2`}>
                  {level.description}
                </p>
              </div>

              <div className="p-4">
                <div className="space-y-2 mb-4">
                  {level.learning_content.topics.slice(0, 3).map((topic, i) => (
                    <div 
                      key={i}
                      className={`flex items-center gap-2 ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        level.completed ? 'bg-[#0000FF]' : 'bg-gray-400'
                      }`} />
                      <span className="text-sm truncate">{topic}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => !level.locked && setSelectedLevel(index)}
                  disabled={level.locked}
                  className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 ${
                    level.locked
                      ? `${isDark ? 'bg-gray-800' : 'bg-gray-200'} cursor-not-allowed`
                      : level.completed
                        ? 'bg-[#0000FF]/10 text-[#0000FF] hover:bg-[#0000FF]/20'
                        : 'bg-[#0000FF] text-white hover:bg-blue-700'
                  } transition-colors`}
                >
                  {level.locked ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Locked</span>
                    </>
                  ) : level.completed ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Get Started</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedLevel !== null && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLevel(null)}
            >
              <motion.div
                className={`w-full max-w-2xl ${
                  isDark ? 'bg-gray-900' : 'bg-white'
                } rounded-2xl shadow-xl overflow-hidden`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className={`p-4 mb-6 rounded-xl ${
                    isDark ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Level {levels[selectedLevel].level}
                      </span>
                      {levels[selectedLevel].completed && (
                        <Star className="w-5 h-5 text-[#0000FF] fill-[#0000FF]" />
                      )}
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {levels[selectedLevel].title}
                    </h3>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {levels[selectedLevel].description}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className={`text-lg font-semibold mb-3 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Learning Topics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {levels[selectedLevel].learning_content.topics.map((topic, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-2 p-3 rounded-lg ${
                              isDark ? 'bg-gray-800' : 'bg-gray-50'
                            }`}
                          >
                            <div className="w-2 h-2 rounded-full bg-[#0000FF]" />
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                              {topic}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`text-lg font-semibold mb-3 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Learning Resources
                      </h4>
                      <div className="space-y-3">
                        {levels[selectedLevel].learning_content.resources.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-between p-4 rounded-xl ${
                              isDark 
                                ? 'bg-gray-800 hover:bg-gray-700' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            } transition-colors group`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg ${
                                isDark ? 'bg-gray-700' : 'bg-white'
                              } flex items-center justify-center`}>
                                <ExternalLink className="w-5 h-5 text-[#0000FF]" />
                              </div>
                              <div>
                                <h5 className={`font-medium ${
                                  isDark ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {resource.title}
                                </h5>
                                <p className={`text-sm ${
                                  isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {resource.platform} • {resource.type === 'free' ? 'Free' : 'Paid'}
                                </p>
                              </div>
                            </div>
                            <motion.div
                              className="opacity-0 group-hover:opacity-100"
                              whileHover={{ x: 5 }}
                            >
                              <ExternalLink className="w-5 h-5 text-[#0000FF]" />
                            </motion.div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-4">
                    <button
                      onClick={() => setSelectedLevel(null)}
                      className={`px-6 py-2 rounded-xl ${
                        isDark 
                          ? 'bg-gray-800 text-white hover:bg-gray-700' 
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      Close
                    </button>
                    {!levels[selectedLevel].completed && (
                      <button
                        onClick={() => handleLevelComplete(levels[selectedLevel].id)}
                        disabled={updating}
                        className={`px-6 py-2 rounded-xl bg-[#0000FF] text-white hover:bg-blue-700 transition-colors flex items-center gap-2 ${
                          updating ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {updating ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <span>Mark as Complete</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Roadmap;