import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";

/**
 * Floating "Talk to AI" button — bottom LEFT (avoids Emergent badge bottom-right).
 * Hidden on /chat and /login pages.
 */
export default function FloatingAI() {
  const location = useLocation();
  const nav = useNavigate();
  const [hover, setHover] = React.useState(false);

  if (location.pathname === "/chat" || location.pathname === "/login") return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 200, damping: 15 }}
      className="fixed bottom-6 left-6 z-[60] flex items-end gap-3"
      data-testid="floating-ai"
    >
      <button
        onClick={() => nav("/chat")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        data-testid="floating-ai-btn"
        className="relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-hover transition-transform hover:-translate-y-1 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #E11D48 0%, #F43F5E 50%, #F59E0B 100%)",
        }}
        aria-label="Talk to AI"
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)", opacity: 0.5, animation: "pulse-ring 2.4s ease-out infinite" }}
        />
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: "linear-gradient(135deg, #F43F5E, #F59E0B)", opacity: 0.4, animation: "pulse-ring 2.4s ease-out 0.7s infinite" }}
        />
        <MessageCircle className="relative w-6 h-6" strokeWidth={2.4} />
      </button>

      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.9 }}
            className="hidden sm:flex items-center gap-2 mb-2 px-4 h-12 rounded-2xl glass shadow-soft text-sm font-semibold text-ink"
          >
            <Sparkles className="w-4 h-4 text-sage" />
            Talk to CareConnect AI
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
