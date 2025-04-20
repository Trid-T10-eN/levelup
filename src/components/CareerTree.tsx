import React from 'react';
import { motion } from 'framer-motion';
import ChatInterface from './ChatInterface';
import { useTheme } from '../App';

const CareerTree: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className="w-full max-w-xl mx-auto">
      <ChatInterface />
    </div>
  );
};

export default CareerTree;