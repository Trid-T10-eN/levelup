import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, Map, LineChart, Compass } from 'lucide-react';

const ServiceTags: React.FC = () => {
  const services = [
    { name: 'AI Career Analysis', icon: Brain },
    { name: 'Skill Assessment', icon: Target },
    { name: 'Custom Roadmaps', icon: Map },
    { name: 'Progress Tracking', icon: LineChart },
    { name: 'Career Guidance', icon: Compass }
  ];
  
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <motion.div
            key={service.name}
            className="px-6 py-3 rounded-full bg-background-dark border border-[#0000FF]/20 backdrop-blur-sm text-white flex items-center gap-2 cursor-pointer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 15px rgba(0, 0, 255, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4 text-[#0000FF]" />
            {service.name}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ServiceTags;