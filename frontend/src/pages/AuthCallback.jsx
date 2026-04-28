import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export default function AuthCallback() {
  const nav = useNavigate();
  const { updateUser, logout } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const hash = window.location.hash || "";
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const sessionId = params.get("session_id");

    if (!sessionId) {
      nav("/login", { replace: true });
      return;
    }

    (async () => {
      try {
        const { data } = await api.post("/auth/google-session", { session_id: sessionId });
        localStorage.setItem("cc_token", data.token);
        localStorage.setItem("cc_user", JSON.stringify(data.user));
        updateUser(data.user);
        toast.success(`🎉 Welcome${data.user.name ? `, ${data.user.name.split(" ")[0]}` : ""}!`);
        window.history.replaceState(null, "", "/");
        nav("/", { replace: true });
      } catch (err) {
        // Clear any stale auth so PublicOnly doesn't immediately bounce us off /login
        logout();
        toast.error(err?.response?.data?.detail || "Google sign-in failed");
        window.history.replaceState(null, "", "/login");
        nav("/login", { replace: true });
      }
    })();
  }, [nav, updateUser, logout]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 rounded-full border-4 border-sage/20 border-t-sage"
      />
      <div className="mt-6 flex items-center gap-2 text-ink font-semibold">
        <Sparkles className="w-4 h-4 text-sage" />
        Signing you in to CareConnect…
      </div>
      <p className="text-muted text-sm mt-1">One moment.</p>
    </div>
  );
}
