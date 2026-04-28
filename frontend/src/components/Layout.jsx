import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import FloatingAI from "./FloatingAI";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Decorative blobs — blue + mint + indigo glow */}
      <div className="blob bg-sage/35 w-[460px] h-[460px] -top-32 -left-24 animate-blob" />
      <div
        className="blob w-[520px] h-[520px] top-40 -right-32 animate-blob"
        style={{ background: "rgba(20, 184, 166, 0.30)", animationDelay: "3s" }}
      />
      <div
        className="blob w-[400px] h-[400px] bottom-0 left-1/3 animate-blob"
        style={{ background: "rgba(99, 102, 241, 0.30)", animationDelay: "6s" }}
      />

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
