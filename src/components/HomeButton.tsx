import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/dashboard')}
      className="fixed bottom-8 right-8 p-4 bg-[#0000FF] hover:bg-[#0000cc] text-white rounded-full shadow-lg z-50 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Home className="w-6 h-6" />
      <span className="absolute right-full mr-3 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Back to Dashboard
      </span>
    </motion.button>
  );
};

export default HomeButton;