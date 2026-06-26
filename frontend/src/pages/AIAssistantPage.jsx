import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi there! I'm your Water Wise AI assistant. Ask me anything about hydration, or ask for a personalized daily water goal recommendation based on your activity!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/ai/chat', { message: userMsg });
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] max-w-4xl mx-auto glass rounded-[2rem] overflow-hidden shadow-2xl border border-white/50 dark:border-white/10"
    >
      <div className="bg-gradient-to-r from-water-600 to-teal-500 p-5 flex items-center gap-4 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
          <Bot className="w-7 h-7 text-white drop-shadow-sm" />
        </div>
        <div>
          <h2 className="font-bold text-xl text-white drop-shadow-sm flex items-center gap-2">
            AI Hydration Assistant <Sparkles className="w-4 h-4 text-yellow-300" />
          </h2>
          <p className="text-water-100 text-sm font-medium">Powered by Gemini AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative">
        <div className="absolute inset-0 bg-slate-50/40 dark:bg-slate-900/40 -z-10"></div>
        
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx} 
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              layout
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600' : 'bg-gradient-to-tr from-water-200 to-water-100 dark:from-water-900 dark:to-water-800'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Bot className="w-5 h-5 text-water-600 dark:text-water-400" />}
                </div>
                <div className={`p-4 text-[15px] leading-relaxed rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-br from-water-500 to-water-600 text-white rounded-tr-sm' : 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-start"
            >
               <div className="flex gap-3 max-w-[80%] flex-row items-end">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-tr from-water-200 to-water-100 dark:from-water-900 dark:to-water-800 shadow-sm">
                    <Bot className="w-5 h-5 text-water-600 dark:text-water-400" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-sm flex gap-1.5 items-center h-[52px]">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-water-400 rounded-full"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-water-400 rounded-full"></motion.div>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-water-400 rounded-full"></motion.div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <div className="p-4 md:p-5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 z-10">
        <form onSubmit={handleSend} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about hydration..."
            className="flex-1 px-5 py-4 rounded-2xl border border-slate-200/80 dark:border-slate-600/80 bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-white focus:ring-2 focus:ring-water-500 focus:outline-none transition-all shadow-inner text-[15px]"
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="px-5 py-4 gradient-bg text-white rounded-2xl transition-all shadow-lg shadow-water-500/25 disabled:opacity-50 disabled:shadow-none flex items-center justify-center group"
          >
            <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AIAssistantPage;
