import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleSlash, Sun, Moon, LogIn } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { useAuth } from '../App';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, signOut } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Career Paths', path: '/career-paths' },
    { name: 'My Roadmap', path: '/roadmap' },
    { name: 'Progress', path: '/progress' }
  ];
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-sm ${
            isDark ? 'bg-black/50' : 'bg-white/50'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <CircleSlash className="h-8 w-8 text-[#0000FF]" />
              </motion.div>
            </Link>
            
            <nav className="flex items-center space-x-8">
              {isAuthenticated && menuItems.map((item, index) => (
                <Link key={item.name} to={item.path}>
                  <motion.span
                    className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'} font-medium transition-colors ${
                      location.pathname === item.path ? `border-b-2 ${isDark ? 'border-white' : 'border-gray-900'}` : ''
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}

              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  isDark ? 'bg-gray-800 text-yellow-500' : 'bg-gray-200 text-[#0000FF]'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>
              
              {isAuthenticated ? (
                <motion.button
                  onClick={() => navigate('/profile')}
                  className={`${
                    isDark 
                      ? 'bg-accent-black/50 text-white hover:bg-black/70 border-[#0000FF]/20' 
                      : 'bg-white/50 text-gray-900 hover:bg-gray-100/70 border-[#0000FF]/20'
                  } backdrop-blur-sm px-6 py-2 rounded-full flex items-center space-x-2 transition-colors border`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Profile</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              ) : (
                <motion.button
                  onClick={() => setShowAuthModal(true)}
                  className={`${
                    isDark 
                      ? 'bg-white text-black hover:bg-gray-100' 
                      : 'bg-[#0000FF] text-white hover:bg-[#0000dd]'
                  } px-6 py-2 rounded-full flex items-center space-x-2 transition-colors`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </motion.button>
              )}
            </nav>
          </div>
        </motion.header>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </AnimatePresence>
  );
};

export default Header;