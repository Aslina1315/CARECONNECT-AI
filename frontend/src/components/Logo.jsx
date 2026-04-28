import React from "react";
import { motion } from "framer-motion";

const LOGO = "https://static.prod-images.emergentagent.com/jobs/76efff76-2b4d-4175-af2a-a2e0b061631b/images/daefd7ee0ce7fefe430c12bf584f6f0d60cb5403022c55812899de29382b4a88.png";

export default function Logo({ size = 40, withText = true, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} data-testid="brand-logo">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-sage/20"
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={LOGO}
          alt="CareConnect"
          className="relative w-full h-full object-contain"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      {withText && (
        <div className="leading-tight">
          <div className="font-heading font-semibold text-ink text-lg tracking-tight">CareConnect</div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted font-medium">AI · Help, Instantly</div>
        </div>
      )}
    </div>
  );
}
