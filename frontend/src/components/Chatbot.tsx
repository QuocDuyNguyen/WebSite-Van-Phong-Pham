import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function FormattedMessage({ text }: { text: string }) {
  // 1. Chuẩn hóa dấu đầu dòng nếu AI trả về trên cùng 1 dòng
  const normalized = text
    .replace(/(^|\n|\s+)(?:\*|-|\•)\s+(?=\*\*|[A-ZÀ-Ỹa-z0-9"'])/g, '$1\n• ')
    .replace(/\n+/g, '\n')
    .trim();

  // 2. Tách các dòng theo \n
  const lines = normalized.split('\n');

  // Hàm render chữ đậm (**...**) và in nghiêng (*...*)
  const renderInline = (content: string) => {
    const parts = content.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-[#1A237E] dark:text-white">{part}</strong>;
      }
      const subParts = part.split(/\*(.*?)\*/g);
      if (subParts.length > 1) {
        return subParts.map((sp, sIdx) => {
          if (sIdx % 2 === 1) {
            return <em key={`${index}-${sIdx}`} className="italic">{sp}</em>;
          }
          return sp;
        });
      }
      return part;
    });
  };

  return (
    <div className="space-y-1.5 leading-relaxed text-sm">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;

        // Tiêu đề ### hoặc ##
        if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return <h4 key={idx} className="font-bold text-sm text-[#1A237E] mt-2 mb-1">{renderInline(headerText)}</h4>;
        }

        // Gạch đầu dòng
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletContent = trimmed.replace(/^(?:•|-|\*)\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-1">
              <span className="text-primary font-bold mt-0.5 select-none">•</span>
              <span className="flex-1">{renderInline(bulletContent)}</span>
            </div>
          );
        }

        // Đoạn văn thông thường
        return <p key={idx}>{renderInline(trimmed)}</p>;
      })}
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const initialMessages: { role: 'user' | 'ai'; text: string }[] = [
    {
      role: 'ai',
      text: 'Chào bạn! Mình là Trợ lý AI của **The Atelier**. Mình có thể giúp bạn tìm kiếm món đồ văn phòng phẩm hoặc sổ tay yêu thích nào hôm nay ạ?'
    }
  ];
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    '🎁 Gợi ý quà tặng dưới 20$',
    '🖋️ Bút máy bán chạy nhất',
    '📔 Sổ tay giấy Archival',
    '📦 Chính sách vận chuyển'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMessage = queryText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: 'Xin lỗi bạn, kết nối tới máy chủ AI đang gặp chút sự cố nhỏ. Bạn thử lại sau nhé!' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Xin lỗi bạn, kết nối mạng đang bị gián đoạn. Bạn kiểm tra lại đường truyền nhé!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery(input);
  };

  const handleResetChat = () => {
    setMessages(initialMessages);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 z-50 ring-4 ring-primary/20 ${isOpen ? 'scale-0 pointer-events-none' : 'scale-100'}`}
        title="Mở Trợ lý AI The Atelier"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-8 right-8 w-80 sm:w-96 md:w-[420px] h-[520px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 border border-outline-variant/20"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#1A237E] to-primary text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight">Atelier AI Assistant</h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Online • Sẵn sàng hỗ trợ</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Làm mới cuộc trò chuyện"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white/90 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Đóng"
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-white/90 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-container-low/60">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1 border border-primary/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  <div className={`max-w-[82%] p-3.5 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm font-medium' : 'bg-white border border-outline-variant/15 text-on-surface rounded-tl-sm'}`}>
                    <FormattedMessage text={msg.text} />
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1 border border-primary/20">
                    <Sparkles className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="max-w-[80%] p-3.5 rounded-2xl bg-white border border-outline-variant/15 text-on-surface rounded-tl-sm flex items-center gap-1.5 shadow-sm">
                    <span className="text-xs font-medium text-on-surface-variant">AI đang suy nghĩ</span>
                    <span className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-150"></span>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce delay-300"></span>
                    </span>
                  </div>
                </div>
              )}

              {/* Suggestion Chips */}
              {messages.length <= 2 && !isLoading && (
                <div className="pt-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Gợi ý cho bạn:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendQuery(sug)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white border border-outline-variant/20 hover:border-primary hover:text-primary transition-all shadow-2xs font-medium text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-3.5 bg-white border-t border-outline-variant/10 flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Hỏi bất cứ điều gì về sản phẩm..."
                className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-full text-sm outline-none focus:ring-2 ring-primary/30 transition-all font-medium placeholder:text-on-surface-variant/60"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dim transition-all disabled:opacity-40 shadow-md shadow-primary/20 flex-shrink-0"
                title="Gửi tin nhắn"
              >
                <Send className="w-4 h-4 -ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
