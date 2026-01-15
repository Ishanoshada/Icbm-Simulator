
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/gemini';
import { ChatMessage } from '../types';
import { THEMES, ThemeType } from '../constants';

interface ChatPanelProps {
  theme: ThemeType;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ theme }) => {
  const themeColors = THEMES[theme];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Ayubowan! I'm LankaBot. Ask me anything about Sri Lanka's hidden gems or history!", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await getGeminiResponse(input, history);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    setIsLoading(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 w-96 max-h-[500px] flex flex-col ${themeColors.panelBg} backdrop-blur-xl border ${themeColors.panelBorder} rounded-2xl overflow-hidden shadow-2xl z-50 transition-colors`}>
      <div className={`p-4 border-b ${themeColors.panelBorder} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColors.accent }} />
          <h3 className={`font-semibold text-sm ${themeColors.text}`}>AI Local Guide</h3>
        </div>
        <span className={`text-[10px] ${themeColors.subtext} font-mono`}>Gemini 3.0 Flash</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'text-white rounded-tr-none shadow-md' 
                : `${themeColors.panelBg} border ${themeColors.panelBorder} ${themeColors.text} rounded-tl-none`
            }`} style={msg.role === 'user' ? { backgroundColor: themeColors.accent } : {}}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`px-4 py-2 rounded-2xl text-xs ${themeColors.subtext} italic`}>
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className={`p-4 border-t ${themeColors.panelBorder} flex gap-2`}>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about Sigiriya..."
          className={`flex-1 bg-black/5 border ${themeColors.panelBorder} ${themeColors.text} rounded-xl px-4 py-2 text-sm focus:outline-none transition-colors`}
          style={{ borderColor: input ? themeColors.accent : undefined }}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl font-bold text-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          style={{ backgroundColor: themeColors.accent, color: theme === 'white' ? '#fff' : '#000' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
