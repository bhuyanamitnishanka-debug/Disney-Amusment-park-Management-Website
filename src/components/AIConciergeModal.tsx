import React, { useState } from 'react';
import { soundEffects } from '../services/audio';
import { Bot, Sparkles, Shield, Send, X, MessageSquare, Terminal } from 'lucide-react';

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  persona: 'walt_genie' | 'jarvis';
  timestamp: string;
}

export const AIConciergeModal: React.FC<AIConciergeModalProps> = ({ isOpen, onClose }) => {
  const [persona, setPersona] = useState<'walt_genie' | 'jarvis'>('walt_genie');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Greetings, honored guest! I am your Disney Enchanted Kingdom Genie. May I help you with ride wait times, secret castle easter eggs, or handcrafted sailing treasures?',
      persona: 'walt_genie',
      timestamp: 'Just now',
    },
  ]);

  if (!isOpen) return null;

  const quickPrompts = persona === 'walt_genie'
    ? [
        'Suggest a 1-day Disney itinerary with the lowest wait times',
        'Tell me about the handcrafted Black Pearl sailing galleon',
        'When is the best spot to view the Castle fireworks spectacular?',
      ]
    : [
        'What are the tactical specs of the Iron Man Arc Helmet?',
        'Analyze Avengers Campus wait times and queue bottlenecks',
        'Compare Captain America Vibranium Shield vs Thor Mjolnir',
      ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    if (persona === 'jarvis') {
      soundEffects.playRepulsorBlast();
    } else {
      soundEffects.playMagicChime();
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      persona,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          persona,
        }),
      });

      const data = await res.json();
      const replyText = data.text || 'The Kingdom is experiencing high magic flux. Please try again momentarily.';

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        persona,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (persona === 'jarvis') {
        soundEffects.playRepulsorBlast();
      } else {
        soundEffects.playMagicChime();
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: persona === 'jarvis'
          ? 'Director, tactical link is temporarily routed through local Stark relays. All Marvel toys and rides remain fully operational.'
          : 'A sprinkle of pixie dust! Our enchanted guides are always by your side throughout the Kingdom.',
        persona,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[620px] max-h-[90vh]">
        
        {/* Modal Header with Persona Switcher */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
              persona === 'walt_genie'
                ? 'bg-indigo-900/80 text-amber-300 border border-indigo-500/40'
                : 'bg-red-950 text-red-400 border border-red-600/40'
            }`}>
              {persona === 'walt_genie' ? '🪄' : '🦾'}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{persona === 'walt_genie' ? 'Disney Enchanted Genie' : 'J.A.R.V.I.S. Tactical AI'}</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {persona === 'walt_genie' ? 'Kingdom Lore & Ride Navigator' : 'Avengers Ops & Superhero Gear Advisor'}
              </p>
            </div>
          </div>

          {/* Persona Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                soundEffects.playMagicChime();
                setPersona('walt_genie');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                persona === 'walt_genie'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🪄 Genie
            </button>
            <button
              onClick={() => {
                soundEffects.playRepulsorBlast();
                setPersona('jarvis');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                persona === 'jarvis'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🦾 J.A.R.V.I.S.
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                    : msg.persona === 'jarvis'
                    ? 'bg-slate-900 border border-red-500/40 text-slate-200 font-mono rounded-bl-none shadow-lg'
                    : 'bg-indigo-950/80 border border-indigo-500/30 text-slate-200 rounded-bl-none shadow-lg'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>{persona === 'jarvis' ? 'J.A.R.V.I.S. synthesizing telemetry...' : 'Consulting fairy godmother scrolls...'}</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-500 font-medium whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
          <input
            type="text"
            placeholder={persona === 'jarvis' ? 'Ask J.A.R.V.I.S. regarding armor or park telemetry...' : 'Ask the Genie about rides, fireworks, or sailing treasures...'}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputQuery.trim() || isLoading}
            className={`p-2.5 rounded-xl text-white font-bold transition-all disabled:opacity-40 ${
              persona === 'jarvis' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
