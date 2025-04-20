import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, ArrowRight, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../App';
import { analyzeResponses } from '../lib/openai';

const questions = [
  {
    question: "What is your current position?",
    options: [
      "Student",
      "Entry-level professional",
      "Mid-level professional",
      "Senior professional",
      "Career changer"
    ]
  },
  {
    question: "What type of activities do you enjoy most?",
    options: [
      "Problem-solving and analytical tasks",
      "Creative and artistic work",
      "Working with people and communication",
      "Technical and hands-on projects",
      "Research and learning new things"
    ]
  },
  {
    question: "Which skills are you most confident in?",
    options: [
      "Communication and interpersonal skills",
      "Technical and computer skills",
      "Creative and design skills",
      "Analysis and problem-solving",
      "Leadership and management"
    ]
  },
  {
    question: "What's your preferred work environment?",
    options: [
      "Office setting with a team",
      "Remote work from home",
      "Mixed/hybrid environment",
      "Outdoor or active environment",
      "Independent workspace"
    ]
  },
  {
    question: "What motivates you most in a career?",
    options: [
      "Financial success",
      "Work-life balance",
      "Making a positive impact",
      "Learning and growth",
      "Recognition and advancement"
    ]
  }
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
}

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isOpen, onClose, onComplete }) => {
  const { isDark } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnalysisStarted, setIsAnalysisStarted] = useState(false);
  const [processingOption, setProcessingOption] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "Hi! I'm your AI career advisor. Let's explore your interests and skills to find the perfect career path for you. " + questions[0].question,
          options: questions[0].options
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRetry = () => {
    setError(null);
    setIsAnalyzing(false);
    setIsAnalysisStarted(false);
    handleAIAnalysis();
  };

  const handleAIAnalysis = async () => {
    if (isAnalysisStarted) return;

    setIsAnalysisStarted(true);
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const careers = await analyzeResponses(selectedResponses);
      
      // Store career data for the roadmap
      localStorage.setItem('careerPath', JSON.stringify(careers));
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Based on your responses, I've identified these career paths that match your profile:\n\n${
          careers.map((career: any, index: number) => (
            `${index + 1}. ${career.title}\n${career.description}\n\nKey Skills Required:\n${career.skills.map((skill: string) => `• ${skill}`).join('\n')}\n\nTimeline: ${career.timeline}\nMatch Score: ${career.matchScore}%\n`
          )).join('\n---\n\n')
        }\n\nWould you like to see your personalized roadmap for these career paths?`,
        options: ['View My Roadmap', 'Start Over']
      }]);
      setShowResults(true);
    } catch (error: any) {
      console.error('Analysis error:', error);
      setError('An error occurred while analyzing your responses. Please try again.');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I encountered an error while analyzing your responses. Would you like to try again?",
        options: ['Retry Analysis', 'Start Over']
      }]);
      setIsAnalysisStarted(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOptionSelect = async (option: string) => {
    if (isAnalyzing || processingOption) return;

    setProcessingOption(true);

    try {
      if (error) {
        if (option === 'Retry Analysis') {
          handleRetry();
          return;
        } else if (option === 'Start Over') {
          setMessages([messages[0]]);
          setCurrentQuestionIndex(0);
          setSelectedResponses([]);
          setShowResults(false);
          setError(null);
          setIsAnalysisStarted(false);
          return;
        }
      }

      if (showResults) {
        if (option === 'View My Roadmap') {
          onComplete();
          return;
        } else if (option === 'Start Over') {
          setMessages([messages[0]]);
          setCurrentQuestionIndex(0);
          setSelectedResponses([]);
          setShowResults(false);
          setIsAnalysisStarted(false);
          return;
        }
      }

      // Add user's response to the messages and selected responses
      setSelectedResponses(prev => [...prev, option]);
      setMessages(prev => [...prev, { role: 'user', content: option }]);

      // If this is the last question, start analysis immediately
      if (currentQuestionIndex === questions.length - 1) {
        setTimeout(() => {
          handleAIAnalysis();
        }, 500);
      } else {
        // If not the last question, show the next question
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: questions[currentQuestionIndex + 1].question,
            options: questions[currentQuestionIndex + 1].options
          }]);
          setCurrentQuestionIndex(prev => prev + 1);
        }, 500);
      }
    } finally {
      setProcessingOption(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`w-full max-w-2xl ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Career Assessment
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-[#0000FF]' 
                      : isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {message.role === 'user' 
                      ? <User className="w-5 h-5 text-white" />
                      : <Bot className="w-5 h-5" />
                    }
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-[#0000FF] text-white'
                      : isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    {message.options && !isAnalyzing && (
                      <div className="mt-4 space-y-2">
                        {message.options.map((option) => (
                          <motion.button
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            className={`w-full text-left px-4 py-2 rounded-lg ${
                              isDark 
                                ? 'bg-gray-700 hover:bg-gray-600' 
                                : 'bg-white hover:bg-gray-50'
                            } transition-colors flex items-center justify-between group`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={processingOption}
                          >
                            <span>{option}</span>
                            {option === 'Retry Analysis' ? (
                              <RefreshCcw className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                            ) : (
                              <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isAnalyzing && (
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-8 h-8 border-4 border-[#0000FF] border-t-transparent rounded-full animate-spin" />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBox;