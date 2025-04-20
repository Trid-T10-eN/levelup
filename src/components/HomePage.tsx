import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import StatsCard from './StatsCard';
import ParticleBackground from './ParticleBackground';
import CareerTree from './CareerTree';
import { Brain, Target, Map, LineChart, Compass, Heart } from 'lucide-react';
import { useTheme } from '../App';

const HomePage: React.FC = () => {
  const { isDark } = useTheme();

  const features = [
    {
      icon: Brain,
      title: 'AI Career Analysis',
      description: 'Get personalized career recommendations powered by advanced AI algorithms'
    },
    {
      icon: Target,
      title: 'Skill Assessment',
      description: 'Evaluate your current skills and identify areas for improvement'
    },
    {
      icon: Map,
      title: 'Custom Roadmaps',
      description: 'Receive tailored learning paths based on your career goals'
    },
    {
      icon: LineChart,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and insights'
    },
    {
      icon: Compass,
      title: 'Career Guidance',
      description: 'Get expert advice and mentorship to navigate your career path'
    },
    {
      icon: Heart,
      title: 'Made with love for you',
      description: 'Every feature is crafted with care to ensure your success and growth'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-accent-black' : 'bg-white'} relative overflow-hidden`}>
      <ParticleBackground />
      <Header />
      
      <main className="container mx-auto pt-32 px-4 relative z-10">
        <section className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.h1 
            className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transform Your Career
            <br />
            <motion.span
              className="text-[#0000FF]"
              animate={{
                y: [0, -10, 0],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              With AI-Powered Guidance
            </motion.span>
          </motion.h1>
          
          <motion.p
            className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-12`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover your ideal career path with AI-driven insights.
            <br />
            Learn, grow, and track your progress in one place.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
            <StatsCard
              title="Success Stories"
              value="25K+"
              percentage={75}
              subtitle="Career transformations achieved"
            />
            <StatsCard
              title="Learning Paths"
              value="100+"
              subtitle="AI-curated career roadmaps"
              showHeart
            />
          </div>
          
          <CareerTree />
          
          {/* Features Section */}
          <motion.section 
            className="mt-32 mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-4xl font-bold mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Features that <span className="text-[#0000FF]">Empower</span> You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className={`p-6 rounded-2xl border ${
                      isDark 
                        ? 'bg-gray-800/50 border-gray-700' 
                        : 'bg-white/50 border-gray-200'
                    } backdrop-blur-sm`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0000FF]/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#0000FF]" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        </section>
      </main>

      {/* Footer */}
      <motion.footer 
        className={`mt-32 py-16 border-t ${
          isDark 
            ? 'bg-gray-900/50 border-gray-800' 
            : 'bg-gray-50/50 border-gray-200'
        } backdrop-blur-sm`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Our Mission
          </motion.h2>
          <motion.p 
            className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            We're here to guide you—so anyone can go from where they are to where they want to be
          </motion.p>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;