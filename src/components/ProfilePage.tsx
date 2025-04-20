import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Trophy, 
  Calendar, 
  Brain, 
  Briefcase,
  Star,
  Award,
  Target,
  Book,
  Clock,
  GitBranch,
  Code,
  Database,
  MapPin,
  Mail,
  Link as LinkIcon,
  Github,
  Twitter,
  LogOut
} from 'lucide-react';
import Header from './Header';
import { useTheme } from '../App';
import { useAuth } from '../App';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { isDark } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    joinDate: new Date(),
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!error && profile) {
          setUserData({
            name: profile.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            joinDate: new Date(user.created_at),
          });
        } else {
          setUserData({
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            joinDate: new Date(user.created_at),
          });
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getDaysOnPlatform = () => {
    return Math.floor((Date.now() - userData.joinDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const stats = [
    { label: 'Current Streak', value: '7 days', icon: Calendar },
    { label: 'Time Invested', value: '24.5 hrs', icon: Clock },
    { label: 'Skills Gained', value: '12', icon: Brain },
    { label: 'Courses Completed', value: '3', icon: Book }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-accent-black' : 'bg-white'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
      <Header />
      <div className="max-w-6xl mx-auto px-4 pt-32">
        {/* Profile Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className="relative w-32 h-32 mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 p-1">
              <div className={`w-full h-full rounded-full ${isDark ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
                <span className="text-5xl font-bold text-primary-400">
                  {userData.name.charAt(0)}
                </span>
              </div>
            </div>
            <motion.div 
              className="absolute -bottom-2 -right-2 bg-primary-500 rounded-full p-2"
              animate={{ 
                scale: [1, 1.2, 1],
                transition: { duration: 2, repeat: Infinity }
              }}
            >
              <Trophy className="w-5 h-5" />
            </motion.div>
          </motion.div>

          <motion.h1 
            className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {userData.name}
          </motion.h1>

          <motion.div 
            className={`flex items-center justify-center gap-4 ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {userData.email}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {getDaysOnPlatform()} days ago
            </span>
          </motion.div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            className={`mt-4 px-6 py-2 rounded-full flex items-center gap-2 mx-auto ${
              isDark 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-red-500 hover:bg-red-600'
            } text-white transition-colors`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </motion.button>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-100'} backdrop-blur-sm rounded-2xl p-4 border ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-6 h-6 text-[#0000FF] mb-2 mx-auto" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;