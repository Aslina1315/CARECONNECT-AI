import React from "react";
import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";

export default function Logo({ size = 40, withText = true, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} data-testid="brand-logo">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex items-center justify-center rounded-2xl"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #E11D48 0%, #F43F5E 50%, #F59E0B 100%)",
          boxShadow: "0 10px 30px rgba(225, 29, 72, 0.35)",
        }}
      >
        <motion.span
          className="absolute inset-0 rounded-2xl"
          style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)" }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <HeartHandshake className="text-white" style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={2.2} />
        </motion.div>
      </motion.div>
      {withText && (
        <div className="leading-tight">
          <div className="font-heading font-bold text-ink text-lg tracking-tight">
            Care<span className="text-gradient">Connect</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted font-bold">AI · Help, Instantly</div>
        </div>
      )}
    </div>
  );
}
