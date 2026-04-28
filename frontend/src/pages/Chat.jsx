import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, AlertTriangle, Bot, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const ICON_3D = "https://static.prod-images.emergentagent.com/jobs/76efff76-2b4d-4175-af2a-a2e0b061631b/images/7d25bfae837b89944f90c51ec3f2dea9d9cc7d59ade3dd037e69ec889187e076.png";

const SUGGESTIONS = [
  "I'm feeling really anxious lately",
  "I lost my job and can't pay rent",
  "I need food for my family",
  "Where can I find a free clinic?",
];

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
      <div className="card-soft p-0 overflow-hidden flex flex-col h-[calc(100vh-160px)] min-h-[560px]">
        <div className="px-6 py-5 border-b border-line flex items-center gap-3 bg-gradient-to-r from-sage/5 to-transparent">
          <motion.img
            src={ICON_3D} alt="" className="w-10 h-10"
            animate={{ y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity }}
          />
          <div>
            <div className="font-heading text-lg text-ink leading-tight">CareConnect Assistant</div>
            <div className="text-xs text-muted">Warm, private, and here to help</div>
          </div>
          <span className="ml-auto pill bg-success/15 text-success border border-success/30">
            <Sparkles className="w-3 h-3" /> Online
          </span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4" data-testid="chat-messages">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <motion.img
                src={ICON_3D} className="w-28 h-28 mx-auto"
                animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}
              />
              <h3 className="font-heading text-2xl text-ink mt-4">How can I support you today?</h3>
              <p className="text-muted mt-2 max-w-md mx-auto">
                Share whatever is on your mind. I'll listen, and gently guide you to help.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s} onClick={() => send(s)}
                    className="px-4 h-10 rounded-full bg-sage-50 text-ink text-sm hover:bg-sage hover:text-white transition-all"
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
                  <div className="w-9 h-9 rounded-full bg-sage/15 text-sage flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-ink text-white rounded-br-md"
                      : m.emergency
                      ? "bg-urgent/10 text-ink border border-urgent/30 rounded-bl-md"
                      : "bg-sage/10 text-ink border border-sage/15 rounded-bl-md"
                  }`}
                  data-testid={`chat-msg-${m.role}`}
                >
                  {m.emergency && (
                    <div className="flex items-center gap-2 text-urgent font-medium mb-1">
                      <AlertTriangle className="w-4 h-4" /> Emergency support
                    </div>
                  )}
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {sending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-sage/15 text-sage flex items-center justify-center"><Bot className="w-4 h-4" /></div>
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
          className="border-t border-line px-4 sm:px-6 py-4 flex items-center gap-3 bg-white"
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
        <div className="card-soft p-6">
          <h3 className="font-heading text-lg text-ink">Crisis lines</h3>
          <p className="text-sm text-muted mt-1">If you're in danger, reach out now.</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center justify-between"><span>Emergency</span><a className="text-sage font-medium" href="tel:112">112</a></li>
            <li className="flex items-center justify-between"><span>iCall (Mental Health)</span><a className="text-sage font-medium" href="tel:9152987821">9152987821</a></li>
            <li className="flex items-center justify-between"><span>Vandrevala Foundation</span><a className="text-sage font-medium" href="tel:18602662345">1860-266-2345</a></li>
          </ul>
        </div>
        <div className="card-soft p-6 bg-gradient-to-br from-white to-terracotta/10">
          <h3 className="font-heading text-lg text-ink">Tip</h3>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            After chatting, head to <span className="text-sage font-medium">Find Help</span> — we'll suggest organizations near you.
          </p>
        </div>
      </aside>
    </div>
  );
}
