import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CareerPath } from '../types';

interface TreeBranchProps {
  careerPath: CareerPath;
  delay: number;
}

const TreeBranch: React.FC<TreeBranchProps> = ({ careerPath, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const branchStyle = {
    left: `${careerPath.position.x}%`,
    top: `${careerPath.position.y}%`,
    transform: `rotate(${careerPath.position.angle}deg)`,
  };
  
  const branchVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        delay: delay * 0.2 + 0.8,
        duration: 0.8, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      } 
    }
  };
  
  const tooltipVariants = {
    hidden: { 
      opacity: 0, 
      y: 10,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      } 
    }
  };
  
  return (
    <motion.div
      className="absolute"
      style={branchStyle}
      variants={branchVariants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="relative"
        animate={{
          filter: isHovered ? `drop-shadow(0 0 12px ${careerPath.color})` : 'drop-shadow(0 0 3px rgba(255,255,255,0.3))',
        }}
        transition={{ duration: 0.3 }}
      >
        <svg 
          width="120" 
          height="80" 
          viewBox="0 0 120 80" 
          fill="none"
          className="cursor-pointer"
        >
          <motion.path
            d={`M 0,50 Q 30,${isHovered ? '20' : '30'} 60,${isHovered ? '10' : '20'} T 120,${isHovered ? '0' : '10'}`}
            stroke={careerPath.color}
            strokeWidth={isHovered ? 4 : 3}
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: 1,
              transition: { delay: delay * 0.2 + 0.8, duration: 1.2 } 
            }}
          />
          
          <motion.circle
            cx="60"
            cy={isHovered ? "10" : "20"}
            r={isHovered ? 12 : 8}
            fill={careerPath.color}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </svg>
        
        {isHovered && (
          <motion.div
            className="absolute p-3 min-w-[200px] rounded-lg bg-background-dark bg-opacity-90 border border-primary-700 shadow-lg text-white"
            style={{
              top: '0px',
              left: '80px',
              zIndex: 10,
            }}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
          >
            <h3 className="text-lg font-bold mb-1" style={{ color: careerPath.color }}>
              {careerPath.name}
            </h3>
            <p className="text-sm text-gray-300">{careerPath.description}</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TreeBranch;