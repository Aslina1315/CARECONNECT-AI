import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import FloatingAI from "./FloatingAI";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Warm decorative blobs — rose + amber + saddle */}
      <div className="blob w-[460px] h-[460px] -top-32 -left-24 animate-blob"
        style={{ background: "rgba(225, 29, 72, 0.32)" }} />
      <div className="blob w-[520px] h-[520px] top-40 -right-32 animate-blob"
        style={{ background: "rgba(245, 158, 11, 0.32)", animationDelay: "3s" }} />
      <div className="blob w-[400px] h-[400px] bottom-0 left-1/3 animate-blob"
        style={{ background: "rgba(180, 83, 9, 0.22)", animationDelay: "6s" }} />

      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto"
      >
        {children}
      </motion.main>

      <FloatingAI />

      <footer className="relative px-6 py-10 text-center text-xs text-muted">
        Made with care · CareConnect AI © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
