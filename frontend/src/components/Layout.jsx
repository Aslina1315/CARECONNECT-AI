import React from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Decorative blobs */}
      <div className="blob bg-sage/30 w-[420px] h-[420px] -top-32 -left-24 animate-blob" />
      <div className="blob bg-terracotta/25 w-[480px] h-[480px] top-40 -right-32 animate-blob" style={{ animationDelay: "3s" }} />
      <div className="blob bg-success/20 w-[360px] h-[360px] bottom-0 left-1/3 animate-blob" style={{ animationDelay: "6s" }} />

      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative px-4 sm:px-6 lg:px-10 py-8 max-w-7xl mx-auto"
      >
        {children}
      </motion.main>

      <footer className="relative px-6 py-10 text-center text-xs text-muted">
        Made with care · CareConnect AI © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
