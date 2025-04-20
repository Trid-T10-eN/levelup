import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  percentage?: number;
  subtitle: string;
  showHeart?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  percentage, 
  subtitle,
  showHeart 
}) => {
  return (
    <motion.div
      className="bg-background-dark text-white p-6 rounded-3xl border border-primary-900/20 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-sm mb-4 text-gray-400">{title}</h3>
      
      <div className="flex items-end space-x-2 mb-4">
        <span className="text-4xl font-bold">{value}</span>
        {showHeart && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              transition: { duration: 1.5, repeat: Infinity }
            }}
          >
            <Heart className="h-6 w-6 text-[#0000FF] fill-[#0000FF]" />
          </motion.div>
        )}
      </div>
      
      {percentage && (
        <div className="relative h-2 bg-background-dark rounded-full mb-4 overflow-hidden border border-primary-900/20">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[#0000FF] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      )}
      
      <p className="text-sm text-gray-400">{subtitle}</p>
    </motion.div>
  );
};

export default StatsCard;