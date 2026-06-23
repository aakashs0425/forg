import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Send, Bot, User } from 'lucide-react';

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
  }, [messages]);

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

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] max-w-4xl mx-auto glass rounded-3xl overflow-hidden shadow-xl">
      <div className="bg-water-600 dark:bg-slate-800 text-white p-4 flex items-center gap-3">
        <Bot className="w-8 h-8" />
        <div>
          <h2 className="font-bold text-lg">AI Hydration Assistant</h2>
          <p className="text-water-100 text-xs">Powered by Gemini AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-water-100 dark:bg-water-900'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-slate-600 dark:text-slate-300" /> : <Bot className="w-5 h-5 text-water-600 dark:text-water-400" />}
              </div>
              <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-water-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[80%] flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-water-100 dark:bg-water-900">
                  <Bot className="w-5 h-5 text-water-600 dark:text-water-400" />
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none flex gap-1">
                  <div className="w-2 h-2 bg-water-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-water-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-water-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about hydration..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-water-500 focus:outline-none transition"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="p-3 bg-water-600 hover:bg-water-700 text-white rounded-xl transition shadow disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistantPage;
