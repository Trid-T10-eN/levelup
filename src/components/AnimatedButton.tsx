import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  onClick, 
  children, 
  className = '' 
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)'
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay: 1.5, duration: 0.6, ease: 'easeOut' }
      }}
    >
      {children}
      <motion.div
        className="absolute -z-10 inset-0 rounded-full bg-primary-400 opacity-30 blur-md"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </motion.button>
  );
};

export default AnimatedButton;