import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Database,
  Palette,
  Shield,
  ArrowRight,
  Brain,
  LineChart,
  Globe,
  Server,
  MapPin,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { useTheme } from '../../App';
import { useAuth } from '../../App';
import ChatBox from '../ChatBox';

interface CareerPath {
  title: string;
  description: string;
  icon: any;
  match: number;
  salary: string;
  demand: string;
  skills: string[];
  color: string;
}

const defaultCareers = [
  {
    title: "Full Stack Developer",
    description: "Master both frontend and backend development to create complete web applications. Build scalable solutions and lead technical implementations.",
    icon: Code,
    match: 95,
    salary: "$70,000 - $120,000",
    demand: "Very High",
    skills: ["JavaScript", "React", "Node.js", "SQL", "System Design"],
    color: "from-blue-500 to-indigo-500"
  },
  {
    title: "Data Scientist",
    description: "Apply advanced analytics and machine learning to solve complex business problems and drive data-driven decisions.",
    icon: Database,
    match: 88,
    salary: "$80,000 - $140,000",
    demand: "High",
    skills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "DevOps Engineer",
    description: "Bridge development and operations to improve deployment efficiency and system reliability.",
    icon: Server,
    match: 85,
    salary: "$85,000 - $130,000",
    demand: "High",
    skills: ["Docker", "Kubernetes", "CI/CD", "Cloud Platforms", "Automation"],
    color: "from-green-500 to-teal-500"
  },
  {
    title: "AI/ML Engineer",
    description: "Develop and deploy artificial intelligence and machine learning solutions to solve real-world problems.",
    icon: Brain,
    match: 92,
    salary: "$90,000 - $150,000",
    demand: "Very High",
    skills: ["Python", "Deep Learning", "TensorFlow", "Computer Vision", "NLP"],
    color: "from-red-500 to-orange-500"
  }
];

const CareerPaths = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [showChatBox, setShowChatBox] = useState(false);
  const [hasSelectedPath, setHasSelectedPath] = useState(false);
  
  useEffect(() => {
    const savedPath = localStorage.getItem('careerPath');
    if (savedPath) {
      try {
        const paths = JSON.parse(savedPath);
        const formattedPaths = paths.map((path: any) => ({
          title: path.title,
          description: path.description,
          icon: getIconForPath(path.title),
          match: path.matchScore || 95,
          salary: getSalaryRange(path.title),
          demand: getDemand(path.matchScore),
          skills: path.skills || [],
          color: getColorForPath(path.title)
        }));
        setCareerPaths(formattedPaths);
        setHasSelectedPath(true);
      } catch (error) {
        console.error('Error parsing career paths:', error);
        setCareerPaths([]);
        setHasSelectedPath(false);
      }
    } else {
      setCareerPaths([]);
      setHasSelectedPath(false);
    }
  }, []);

  const getIconForPath = (title: string) => {
    const icons: { [key: string]: any } = {
      'Full Stack Developer': Code,
      'Data Scientist': Database,
      'UX Designer': Palette,
      'DevOps Engineer': Shield,
      'AI/ML Engineer': Brain,
      'Business Analyst': LineChart,
      'Cloud Architect': Globe,
      'default': Code
    };
    return icons[title] || icons.default;
  };

  const getColorForPath = (title: string) => {
    const colors: { [key: string]: string } = {
      'Full Stack Developer': 'from-blue-500 to-indigo-500',
      'Data Scientist': 'from-purple-500 to-pink-500',
      'UX Designer': 'from-pink-500 to-rose-500',
      'DevOps Engineer': 'from-green-500 to-teal-500',
      'AI/ML Engineer': 'from-red-500 to-orange-500',
      'default': 'from-blue-500 to-indigo-500'
    };
    return colors[title] || colors.default;
  };

  const getSalaryRange = (title: string) => {
    const ranges: { [key: string]: string } = {
      'Full Stack Developer': '$70,000 - $120,000',
      'Data Scientist': '$80,000 - $140,000',
      'UX Designer': '$65,000 - $110,000',
      'DevOps Engineer': '$85,000 - $130,000',
      'AI/ML Engineer': '$90,000 - $150,000',
      'default': '$60,000 - $100,000'
    };
    return ranges[title] || ranges.default;
  };

  const getDemand = (matchScore: number) => {
    if (matchScore >= 90) return 'Very High';
    if (matchScore >= 80) return 'High';
    return 'Moderate';
  };

  const handleStartJourney = () => {
    setShowChatBox(true);
  };

  const handleExploreRoadmap = async (career: CareerPath) => {
    if (!user) return;

    try {
      // Save selected career path
      localStorage.setItem('careerPath', JSON.stringify([{
        title: career.title,
        description: career.description,
        skills: career.skills,
        matchScore: career.match
      }]));

      navigate('/roadmap');
    } catch (error) {
      console.error('Error starting new career path:', error);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-accent-black' : 'bg-white'} relative overflow-hidden`}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 pt-32">
        {!hasSelectedPath ? (
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
                Start Your Career Journey
              </h1>
              <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Take our quick assessment to discover personalized career paths that match your skills and interests.
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
        ) : (
          <>
            <div className="text-center mb-12">
              <motion.h1
                className={`text-4xl font-bold tracking-tight sm:text-5xl ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Recommended Career Paths
              </motion.h1>
              <motion.p
                className={`mt-4 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Explore personalized career paths based on your skills and interests
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {careerPaths.map((career, index) => {
                const Icon = career.icon;
                return (
                  <motion.div
                    key={career.title}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${career.color} p-1`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`rounded-xl p-6 h-full ${
                      isDark ? 'bg-gray-900' : 'bg-white'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <Icon className="h-8 w-8 mr-3" />
                          <h3 className={`text-xl font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {career.title}
                          </h3>
                        </div>
                        <span className="bg-[#0000FF]/20 text-[#0000FF] px-3 py-1 rounded-full text-sm">
                          {career.match}% Match
                        </span>
                      </div>
                      
                      <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {career.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>
                            Salary Range
                          </p>
                          <p className={`text-lg font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {career.salary}
                          </p>
                        </div>
                        <div>
                          <p className={isDark ? 'text-gray-500' : 'text-gray-600'}>
                            Market Demand
                          </p>
                          <p className={`text-lg font-semibold ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {career.demand}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className={`text-sm mb-2 ${
                          isDark ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          Key Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill) => (
                            <span
                              key={skill}
                              className={`px-2 py-1 rounded-md text-sm ${
                                isDark 
                                  ? 'bg-gray-800 text-gray-300' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleExploreRoadmap(career)}
                        className={`mt-6 w-full py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          isDark
                            ? 'bg-white/10 hover:bg-white/20 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        <span>View Learning Path</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <ChatBox
        isOpen={showChatBox}
        onClose={() => setShowChatBox(false)}
        onComplete={() => {
          setShowChatBox(false);
          setHasSelectedPath(true);
          window.location.reload();
        }}
      />
    </div>
  );
};

export default CareerPaths;