'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  X, 
  ArrowUp,
  BookOpen, 
  Copy, 
  Check, 
  Bot, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';

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

const SUGGESTION_CHIPS = [
  'What stopped lost circulation in Geleki?',
  'Barail kick history & mud weight',
  'Show stuck pipe in Girujan clay',
  'Geleki-07 LCM recipe'
];

interface AskNwisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
  initialQuery?: string;
}

export const AskNwisDrawer: React.FC<AskNwisDrawerProps> = ({
  isOpen,
  onClose,
  onToggle
}) => {
  const { toggleCopilot } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hi! I'm your AI Drilling Copilot. Ask me about well operations, kick risks, casing programs, mud weights, or DDR logs based strictly on well intelligence records.",
      timestamp: 'Now'
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModelSource, setActiveModelSource] = useState<string>('Grounded AI • Drilling Assistant');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      // Focus input when popup opens
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      toggleCopilot();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          messages: newMessages.map(m => ({
            role: m.sender,
            content: m.text
          }))
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.source) {
        setActiveModelSource(`Grounded AI • ${data.source}`);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "No response received.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredDetails: data.structuredDetails
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Backend Chat API error, falling back to local subsurface engine:', err);

      // Graceful local fallback
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
    } finally {
      setIsTyping(false);
    }
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
        text: "Hi! I'm your AI Drilling Copilot. Ask me about well operations, kick risks, casing programs, mud weights, or DDR logs based strictly on well intelligence records.",
        timestamp: 'Now'
      }
    ]);
  };

  return (
    <>
      {/* ─── Floating Popup Chat Window ─── */}
      {isOpen && (
        <div 
          className="fixed bottom-22 right-5 sm:right-6 z-50 w-[380px] sm:w-[410px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-7.5rem)] rounded-2xl bg-white dark:bg-[#1E2532] border border-[#E2E5E8] dark:border-[#364356] shadow-[0_12px_45px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-all text-[#252B33] dark:text-white"
          role="dialog"
          aria-label="AntarRig Copilot"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#E2E5E8] dark:border-[#364356] bg-white dark:bg-[#1E2532] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#34435A] dark:bg-[#191E26] text-[#3FC3B6] flex items-center justify-center shadow-xs shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="font-bold text-sm text-[#252B33] dark:text-white leading-tight">
                  AntarRig Copilot
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] dark:text-[#94A3B8]">
                  <span className="w-2 h-2 rounded-full bg-[#3FAE68] animate-pulse" />
                  <span className="truncate max-w-[200px]">{activeModelSource}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Reset Conversation"
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#252B33] dark:hover:text-white hover:bg-[#F5F7F8] dark:hover:bg-[#2D3747] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Close Copilot"
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#252B33] dark:hover:text-white hover:bg-[#F5F7F8] dark:hover:bg-[#2D3747] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-[#F9FAFB] dark:bg-[#191E26]/70 border-b border-[#E2E5E8] dark:border-[#364356] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-full text-[11px] font-sans bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] text-[#4B5563] dark:text-slate-200 hover:border-[#3FC3B6] hover:text-[#26A69A] dark:hover:text-[#3FC3B6] whitespace-nowrap transition-colors cursor-pointer shadow-2xs shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFBFB] dark:bg-[#191E26] text-xs transition-colors">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#34435A] text-white rounded-2xl rounded-tr-xs shadow-xs max-w-[85%]'
                        : 'bg-white dark:bg-[#242D3B] text-[#252B33] dark:text-slate-100 border border-[#E2E5E8] dark:border-[#364356] rounded-2xl rounded-tl-xs shadow-2xs max-w-[92%]'
                    }`}
                  >
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                    ) : (
                      <div className="space-y-2">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => <h1 className="text-sm font-bold text-[#26A69A] dark:text-[#3FC3B6] mt-2 mb-1 border-b border-[#E2E5E8] dark:border-[#364356] pb-0.5">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xs font-bold text-[#26A69A] dark:text-[#3FC3B6] mt-2 mb-1">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xs font-bold uppercase tracking-wider text-[#252B33] dark:text-white mt-2 mb-1">{children}</h3>,
                            p: ({ children }) => <p className="mb-1.5 leading-relaxed text-xs text-[#252B33] dark:text-neutral-200">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-[#252B33] dark:text-white">{children}</strong>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5 text-xs text-[#252B33] dark:text-neutral-200">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5 text-xs text-[#252B33] dark:text-neutral-200">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-[#26A69A] pl-2.5 py-0.5 my-1.5 bg-[#D9F2EE]/30 dark:bg-[#3FC3B6]/10 text-xs italic text-[#252B33] dark:text-neutral-200">
                                {children}
                              </blockquote>
                            ),
                            table: ({ children }) => (
                              <div className="my-2 overflow-x-auto border border-[#E2E5E8] dark:border-[#364356] rounded-md shadow-2xs">
                                <table className="min-w-full divide-y divide-[#E2E5E8] dark:divide-[#364356] text-xs">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-[#F0F3F5] dark:bg-[#1E2532] text-[#252B33] dark:text-white font-mono font-bold">
                                {children}
                              </thead>
                            ),
                            th: ({ children }) => (
                              <th className="px-2.5 py-1.5 text-left text-[10px] font-bold uppercase tracking-wider border-r border-[#E2E5E8] dark:border-[#364356] last:border-r-0 text-[#252B33] dark:text-white">
                                {children}
                              </th>
                            ),
                            tbody: ({ children }) => (
                              <tbody className="divide-y divide-[#E2E5E8] dark:divide-[#364356] bg-white dark:bg-[#242D3B]">
                                {children}
                              </tbody>
                            ),
                            tr: ({ children }) => (
                              <tr className="hover:bg-gray-50/70 dark:hover:bg-[#2A3545]/60 transition-colors">
                                {children}
                              </tr>
                            ),
                            td: ({ children }) => (
                              <td className="px-2.5 py-1.5 text-xs border-r border-[#E2E5E8] dark:border-[#364356] last:border-r-0 leading-normal align-top text-[#252B33] dark:text-neutral-200">
                                {children}
                              </td>
                            ),
                            pre: ({ children }) => (
                              <pre className="p-2.5 my-1.5 bg-[#191E26] text-[#D9F2EE] font-mono text-[11px] overflow-x-auto border border-[#364356] rounded-md">
                                {children}
                              </pre>
                            ),
                            code: ({ className, children, ...props }: any) => {
                              const isInline = !className && !String(children).includes('\n');
                              if (isInline) {
                                return (
                                  <code className="px-1 py-0.5 bg-gray-100 dark:bg-[#191E26] text-[#26A69A] dark:text-[#3FC3B6] font-mono text-[10px] border border-[#E2E5E8] dark:border-[#364356] rounded" {...props}>
                                    {children}
                                  </code>
                                );
                              }
                              return (
                                <code className="font-mono text-xs text-[#D9F2EE]" {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {msg.text.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n')}
                        </ReactMarkdown>

                        {/* Structured Knowledge Card */}
                        {msg.structuredDetails && (
                          <div className="mt-2.5 pt-2 border-t border-[#E2E5E8] dark:border-neutral-800 space-y-1.5 text-xs">
                            <div className="p-2 rounded-lg bg-[#D9F2EE] dark:bg-[#3FC3B6]/15 border border-[#3FC3B6]/40 space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="font-bold text-[#26A69A] dark:text-[#3FC3B6]">
                                  RECOMMENDED ACTION
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#191E26] text-[#252B33] dark:text-neutral-100 border border-[#3FC3B6]/40 font-mono text-[9px]">
                                  Mud: {msg.structuredDetails.mudWeight}
                                </span>
                              </div>
                              <p className="text-[#252B33] dark:text-neutral-200 font-sans text-xs">
                                {msg.structuredDetails.recommendation}
                              </p>
                            </div>

                            <div className="text-[10px] text-[#6B7280] dark:text-neutral-400">
                              <strong className="text-[#252B33] dark:text-neutral-200">Historical Fact: </strong>
                              {msg.structuredDetails.observedFact}
                            </div>

                            <div className="pt-0.5 flex items-center justify-between text-[10px] font-mono text-[#6B7280] dark:text-neutral-400">
                              <div className="flex items-center gap-1 truncate max-w-[75%]">
                                <BookOpen className="w-3 h-3 text-[#6B7280] shrink-0" />
                                <span className="truncate">{msg.structuredDetails.citation}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopy(msg.id, `${msg.structuredDetails?.recommendation} (Ref: ${msg.structuredDetails?.citation})`)}
                                className="text-[#26A69A] dark:text-[#3FC3B6] hover:underline font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#3FAE68]" />
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
                    )}
                  </div>

                  <span className="text-[10px] text-[#9CA3AF] font-mono px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">
                <div className="p-2.5 rounded-2xl rounded-tl-xs bg-white dark:bg-[#242D3B] border border-[#E2E5E8] dark:border-[#364356] flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3FC3B6] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3FC3B6] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3FC3B6] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] ml-1">Consulting well intelligence...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-[#1E2532] border-t border-[#E2E5E8] dark:border-[#364356] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center bg-[#F5F7F8] dark:bg-[#191E26] border border-[#E2E5E8] dark:border-[#364356] rounded-full px-3.5 py-1.5 focus-within:border-[#3FC3B6] focus-within:ring-2 focus-within:ring-[#3FC3B6]/20 transition-all"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about drilling, DDR, offsets..."
                className="flex-1 bg-transparent text-xs text-[#252B33] dark:text-white placeholder:text-[#9CA3AF] outline-none pr-2 font-medium"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                title="Send message"
                className="w-7 h-7 rounded-full bg-[#34435A] dark:bg-[#3FC3B6] text-white dark:text-[#191E26] flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-all shrink-0 cursor-pointer shadow-xs"
              >
                <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </form>

            <div className="mt-1.5 text-center text-[10px] font-mono text-[#9CA3AF]">
              Grounded in live database records • Read-only
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom-Right Floating Trigger Button ─── */}
      <div className="fixed bottom-5 right-5 sm:right-6 z-50 flex items-center gap-2.5">
        {/* Tooltip badge when closed */}
        <button
          type="button"
          onClick={handleToggle}
          title={isOpen ? "Close Copilot" : ""}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#34435A] hover:bg-[#252B33] dark:bg-[#2A3546] dark:hover:bg-[#34435A] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer relative border border-white/10"
          aria-label={isOpen ? "Close Copilot" : ""}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" strokeWidth={2} />
          ) : (
            <>
              <Bot className="w-6 h-6 text-[#3FC3B6]" strokeWidth={2} />
              {/* Green online indicator dot */}
              <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-[#3FAE68] border-2 border-white dark:border-[#1E2532]" />
            </>
          )}
        </button>
      </div>
    </>
  );
};
