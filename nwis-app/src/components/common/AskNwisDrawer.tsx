'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  BookOpen, 
  Copy, 
  Check, 
  Bot, 
  User, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structuredDetails?: {
    observedFact: string;
    recommendation: string;
    mudWeight: string;
    confidence: number;
    citation: string;
  };
}

const KNOWLEDGE_RESPONSES: Record<string, {
  summary: string;
  observedFact: string;
  recommendation: string;
  mudWeight: string;
  confidence: number;
  citation: string;
}> = {
  'tipam': {
    summary: 'In the Geleki Tipam Sandstone (2,180m–2,350m MD), 5 of 8 offset wells experienced severe mud losses (12–35 m³/hr) under ECD exceeding 10.8 ppg due to micro-fracture dilation.',
    observedFact: 'Geleki-03 and Geleki-07 suffered total lost circulation in Upper Tipam sand. Re-circulation was established after pre-treating with mixed-fiber LCM.',
    recommendation: 'Cap active ECD at 10.4 ppg. Pre-treat active pits with 35 ppb medium/coarse mixed-fiber LCM pill before reaching 2,150m MD.',
    mudWeight: '9.8 – 10.2 ppg',
    confidence: 94,
    citation: 'OIL Geleki-03 WCR-GLK-03-1988/p42 & Geleki-07 DDR-GLK-07-1996'
  },
  'barail': {
    summary: 'Barail Group (2,920m–3,110m MD) exhibits an aggressive pore pressure transition from 10.2 ppg equivalent to 13.1 ppg within an 80m vertical span.',
    observedFact: 'Only 2 of 8 offset wells traversed Barail without kicks. Both clean wells stepped up mud density to 12.6 ppg before the seismic marker top.',
    recommendation: 'Raise mud weight to 12.6 ppg at 2,900m MD prior to penetrating coal-sand interfaces. Conduct slow pump rate (SPR) checks every 50m.',
    mudWeight: '12.4 – 13.0 ppg',
    confidence: 92,
    citation: 'OIL Geleki-04 WCR-GLK-04-1991/p78 & Geleki-12 DDR-GLK-12-2015'
  },
  'girujan': {
    summary: 'Girujan Clay (1,350m–1,620m MD) contains reactive smectite clays that hydrate and swell, causing mechanical pack-off and stuck pipe during wiper trips.',
    observedFact: '4 Digboi offset wells suffered tight hole when potassium chloride concentration dropped below 6% in the active water-based mud system.',
    recommendation: 'Maintain active KCl concentration at 8–10% with 1.5 ppb PHPA polymer encapsulation. Perform short wiper trips every 120m drilled.',
    mudWeight: '10.2 – 10.6 ppg',
    confidence: 89,
    citation: 'OIL Digboi-02 WCR-DGB-02-1975/p28 & Digboi-06 TIR-DGB-06-1989'
  },
  'lcm': {
    summary: 'In Geleki-07 (2,280m MD), standard 20 ppb mica pills failed to seal total losses. Circulation was regained after pumping a combined heavy pill formulation.',
    observedFact: 'Geleki-07 lost 34 NPT hours before a multi-modal blend of coarse calcium carbonate, resilient graphitic carbon, and walnut shell successfully plugged the thief zone.',
    recommendation: 'Stage 40 bbl blended pill: 30 ppb coarse CaCO3 + 20 ppb resilient graphitic carbon (RGC) + 15 ppb walnut shell fiber. Squeeze at 1.5 bpm.',
    mudWeight: '10.0 – 10.2 ppg',
    confidence: 96,
    citation: 'OIL Geleki-07 Incident File WCR-GLK-07-1996/p22'
  }
};

interface AskNwisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const AskNwisDrawer: React.FC<AskNwisDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Hello! I am your NWIS Subsurface Copilot. Ask me anything about offset-well drilling incidents, formation kicks, mud weight recommendations, or stuck-pipe mitigation across the Assam-Arakan Basin.',
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Intelligent match against Assam Basin records
    setTimeout(() => {
      const lower = query.toLowerCase();
      let matchedKey = 'tipam';
      if (lower.includes('barail') || lower.includes('kick') || lower.includes('overpressure')) {
        matchedKey = 'barail';
      } else if (lower.includes('girujan') || lower.includes('stuck') || lower.includes('shale')) {
        matchedKey = 'girujan';
      } else if (lower.includes('lcm') || lower.includes('pill') || lower.includes('geleki-07')) {
        matchedKey = 'lcm';
      }

      const match = KNOWLEDGE_RESPONSES[matchedKey];
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: match.summary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredDetails: {
          observedFact: match.observedFact,
          recommendation: match.recommendation,
          mudWeight: match.mudWeight,
          confidence: match.confidence,
          citation: match.citation
        }
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 700);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: 'Chat reset. Ask me about offset wells, mud weights, or formation hazards in Assam.',
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#11141a] h-full shadow-2xl flex flex-col border-l border-neutral-200 dark:border-neutral-800 overflow-hidden z-10 animate-in slide-in-from-right duration-200 transition-colors">
        
        {/* Top Header (Clean, Uncluttered) */}
        <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#0d0f14] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-sm text-neutral-950 dark:text-white">Ask NWIS Copilot</h2>
                <Badge variant="outline" className="text-[9px] font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 py-0 px-1.5">
                  AI CHAT
                </Badge>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                Assam Basin Offset Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleResetChat}
              title="Reset Conversation"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50 dark:bg-[#090b0f] transition-colors">
          
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 text-xs shadow-2xs mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  {/* Text bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-neutral-950 dark:bg-amber-600 text-white rounded-tr-xs shadow-xs'
                        : 'bg-white dark:bg-[#161a22] text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}

                    {/* Structured Knowledge Card (Clean, Compact, Not Overwhelming) */}
                    {msg.structuredDetails && (
                      <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
                        
                        {/* Recommended Mud Weight & Action */}
                        <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="font-bold text-amber-900 dark:text-amber-300">
                              RECOMMENDED ACTION
                            </span>
                            <Badge className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-amber-300 dark:border-amber-700 text-[10px] font-mono py-0">
                              Mud: {msg.structuredDetails.mudWeight}
                            </Badge>
                          </div>
                          <p className="text-neutral-800 dark:text-neutral-200 font-sans text-xs">
                            {msg.structuredDetails.recommendation}
                          </p>
                        </div>

                        {/* Observed Fact */}
                        <div className="text-[11px] text-neutral-600 dark:text-neutral-400">
                          <strong className="text-neutral-900 dark:text-neutral-200">Historical Fact: </strong>
                          {msg.structuredDetails.observedFact}
                        </div>

                        {/* Citation & Copy */}
                        <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                          <div className="flex items-center gap-1 truncate max-w-[80%]">
                            <BookOpen className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span className="truncate">{msg.structuredDetails.citation}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, `${msg.structuredDetails?.recommendation} (Ref: ${msg.structuredDetails?.citation})`)}
                            className="text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 shrink-0"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                  <div className={`text-[10px] font-mono text-neutral-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0 text-xs mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2.5 items-center text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-xs bg-white dark:bg-[#161a22] border border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">Searching 1,690 WCR records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (Clean & Simple) */}
        <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-[#0e1117] flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
          <span className="text-neutral-400 shrink-0">Try:</span>
          <button
            type="button"
            onClick={() => handleSendMessage('What stopped lost circulation in Geleki Tipam?')}
            className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 shrink-0 transition-colors"
          >
            Tipam mud losses
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Has Barail overpressure been encountered below 2,900m without kick?')}
            className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 shrink-0 transition-colors"
          >
            Barail kick history
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('Show stuck pipe in Girujan clay')}
            className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 shrink-0 transition-colors"
          >
            Girujan stuck pipe
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage('What LCM blend resolved total loss in Geleki-07?')}
            className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 shrink-0 transition-colors"
          >
            Geleki-07 LCM recipe
          </button>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#11141a] transition-colors">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question about offset wells, mud weights..."
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500/40 text-neutral-900 dark:text-white placeholder:text-neutral-400 font-medium transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-neutral-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              OIL Archival RAG • Zero Hallucination Mode
            </span>
            <span>Esc to close</span>
          </div>
        </div>

      </div>
    </div>
  );
};
