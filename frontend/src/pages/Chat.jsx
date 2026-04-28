import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, AlertTriangle, Bot, User as UserIcon, HeartHandshake, Phone } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const SUGGESTIONS = [
  "I'm feeling really anxious lately",
  "I lost my job and can't pay rent",
  "I need food for my family",
  "Where can I find a free clinic?",
];

// Warm, caring abstract image (Pexels) — softens the chat header
const HEADER_IMAGE = "https://images.pexels.com/photos/6647037/pexels-photo-6647037.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300&w=900";

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId] = useState(() => `cc-${user?.id || "u"}-${Date.now()}`);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async (override) => {
    const text = (override ?? input).trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setSending(true);
    try {
      const { data } = await api.post("/chat", { message: text, session_id: sessionId });
      setMessages((m) => [...m, { role: "assistant", content: data.response, emergency: data.is_emergency, category: data.category }]);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not reach assistant");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6" data-testid="chat-page">
      <div className="glass-card p-0 overflow-hidden flex flex-col h-[calc(100vh-160px)] min-h-[560px]">
        {/* Header with warm image + glass overlay */}
        <div data-testid="chat-header" className="relative h-32 overflow-hidden">
          <img src={HEADER_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(107,142,127,0.85) 0%, rgba(148,176,162,0.72) 55%, rgba(217,184,156,0.78) 100%)" }}
          />
          <div className="relative h-full flex items-center gap-4 px-6">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-2xl bg-white/95 flex items-center justify-center shadow-soft"
              data-testid="chat-bot-avatar"
            >
              <HeartHandshake className="w-8 h-8" style={{ color: "#6B8E7F" }} strokeWidth={2.2} />
            </motion.div>
            <div className="text-white">
              <div className="font-heading text-2xl font-bold leading-tight">CareConnect Assistant</div>
              <div className="text-sm text-white/90 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                Online · warm, private, here for you
              </div>
            </div>
            <div className="ml-auto hidden sm:block">
              <span className="pill bg-white/95 text-sage border border-white">
                <Sparkles className="w-3 h-3" /> AI · Gemini
              </span>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4" data-testid="chat-messages">
          {messages.length === 0 && (
            <div className="text-center py-10">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-white shadow-soft"
                style={{ background: "linear-gradient(135deg, #6B8E7F, #D9B89C)" }}
              >
                <HeartHandshake className="w-10 h-10" />
              </motion.div>
              <h3 className="font-heading text-2xl font-bold text-ink mt-5">How can I support you today?</h3>
              <p className="text-muted mt-2 max-w-md mx-auto">
                Share whatever is on your mind. I'll listen, and gently guide you to help.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s} onClick={() => send(s)}
                    className="px-4 h-10 rounded-full bg-sage-50 text-sage font-semibold text-sm hover:bg-sage hover:text-white transition-all border border-sage/20"
                    data-testid="chat-suggestion"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #6B8E7F, #D9B89C)" }}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-ink text-white rounded-br-md"
                      : m.emergency
                      ? "bg-urgent/10 text-ink border border-urgent/40 rounded-bl-md"
                      : "bg-sage/8 text-ink border border-sage/20 rounded-bl-md"
                  }`}
                  data-testid={`chat-msg-${m.role}`}
                >
                  {m.emergency && (
                    <div className="flex items-center gap-2 text-urgent font-bold mb-1">
                      <AlertTriangle className="w-4 h-4" /> Emergency support
                    </div>
                  )}
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user?.picture
                      ? <img src={user.picture} alt="" className="w-full h-full object-cover" />
                      : <UserIcon className="w-4 h-4" />}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {sending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #6B8E7F, #D9B89C)" }}
              >
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-sage/10 px-4 py-3 rounded-2xl flex items-center gap-1.5">
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="w-2 h-2 rounded-full bg-sage"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="border-t border-line px-4 sm:px-6 py-4 flex items-center gap-3 bg-white/80"
        >
          <input
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what's going on…"
            className="input-base flex-1"
            disabled={sending}
          />
          <button
            type="submit" disabled={sending || !input.trim()}
            className="btn-primary !px-5"
            data-testid="chat-send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      <aside className="space-y-4">
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-30 blur-2xl"
            style={{ background: "linear-gradient(135deg, #DC2626, #D9B89C)" }} />
          <h3 className="font-heading text-lg font-bold text-ink relative flex items-center gap-2">
            <Phone className="w-4 h-4 text-urgent" /> Crisis lines
          </h3>
          <p className="text-sm text-muted mt-1 relative">If you're in danger, reach out now.</p>
          <ul className="mt-4 space-y-3 text-sm relative">
            <li className="flex items-center justify-between"><span>Emergency</span><a className="text-urgent font-bold" href="tel:112">112</a></li>
            <li className="flex items-center justify-between"><span>iCall (Mental Health)</span><a className="text-sage font-bold" href="tel:9152987821">9152987821</a></li>
            <li className="flex items-center justify-between"><span>Vandrevala Foundation</span><a className="text-sage font-bold" href="tel:18602662345">1860-266-2345</a></li>
          </ul>
        </div>
        <div className="glass-card p-6 relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-30 blur-2xl"
            style={{ background: "linear-gradient(135deg, #D9B89C, #6B8E7F)" }} />
          <h3 className="font-heading text-lg font-bold text-ink relative">Tip</h3>
          <p className="text-sm text-muted mt-1 leading-relaxed relative">
            After chatting, head to <span className="text-sage font-bold">Find Help</span> — we'll suggest organizations near you.
          </p>
        </div>
      </aside>
    </div>
  );
}
