import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import ChatBox from './ChatBox';
import AuthModal from './AuthModal';
import { useTheme } from '../App';
import { useAuth } from '../App';

const ChatInterface: React.FC = () => {
  const { isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);

  const handleStartJourney = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setIsChatOpen(true);
  };

  const handleChatComplete = () => {
    setHasCompletedAssessment(true);
    setIsChatOpen(false);
  };

  const handleGoToRoadmap = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    navigate('/roadmap');
  };

  return (
    <div className="text-center">
      {!hasCompletedAssessment ? (
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
          <Bot className="w-5 h-5" />
          Start My Journey
        </motion.button>
      ) : (
        <motion.button
          onClick={handleGoToRoadmap}
          className="px-8 py-4 text-lg font-medium rounded-full bg-[#0000FF] text-white hover:bg-[#0000dd] transition-all duration-300 flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Go to My Roadmap
        </motion.button>
      )}

      <ChatBox 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        onComplete={handleChatComplete}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          if (hasCompletedAssessment) {
            navigate('/roadmap');
          } else {
            setIsChatOpen(true);
          }
        }}
      />
    </div>
  );
};

export default ChatInterface;