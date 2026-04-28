import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, Lock, User as UserIcon, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../components/Logo";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { login, signup } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("login");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (tab === "signup" && !form.name.trim()) { toast.error("Please enter your name"); return; }
    if (!form.email || !form.password) { toast.error("Email and password are required"); return; }
    setBusy(true);
    try {
      if (tab === "login") {
        await login(form.email, form.password);
        toast.success("Welcome back");
        nav("/", { replace: true });
      } else {
        await signup(form.name, form.email, form.password);
        toast.success("🎉 Account created successfully — welcome to CareConnect!", {
          duration: 3000,
        });
        setSuccess(true);
        // Show success state briefly so the user actually sees it
        setTimeout(() => nav("/", { replace: true }), 1400);
      }
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Something went wrong");
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      {/* Background glows */}
      <div className="blob bg-sage/35 w-[480px] h-[480px] -top-32 -left-24 animate-blob" />
      <div className="blob w-[520px] h-[520px] -bottom-40 -right-24 animate-blob"
        style={{ background: "rgba(20, 184, 166, 0.30)", animationDelay: "3s" }} />
      <div className="blob w-[420px] h-[420px] top-1/3 left-1/2 animate-blob"
        style={{ background: "rgba(99, 102, 241, 0.30)", animationDelay: "6s" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative grid lg:grid-cols-2 gap-8 max-w-5xl w-full"
      >
        {/* Left brand panel */}
        <div className="hidden lg:flex flex-col justify-between glass-card p-10">
          <Logo size={48} />
          <div className="space-y-5 hero-glow">
            <h1 className="font-heading text-4xl xl:text-5xl tracking-tight font-extrabold text-ink leading-[1.05]">
              Help, found in <span className="text-gradient">moments</span> — not hours.
            </h1>
            <p className="text-muted leading-relaxed max-w-md text-base">
              CareConnect listens, understands urgency, and matches you to the right
              support — food, medical, financial, or simply someone to talk to.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Food", "Medical", "Financial", "Mental Health", "Education"].map((t) => (
                <span key={t} className="pill bg-white/80 backdrop-blur-sm text-sage border border-sage/20">
                  <Sparkles className="w-3 h-3" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted/80 font-medium">Trusted by communities worldwide.</div>
        </div>

        {/* Right form */}
        <div className="glass-card p-8 sm:p-10 relative" data-testid="auth-card">
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 rounded-3xl flex flex-col items-center justify-center text-center p-8"
                style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}
                data-testid="signup-success"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white"
                  style={{ background: "linear-gradient(135deg, #2563EB, #14B8A6)" }}
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <h3 className="font-heading text-2xl font-extrabold text-ink mt-5">Account created!</h3>
                <p className="text-muted mt-2 max-w-xs">Welcome to CareConnect — your account is saved. Taking you in…</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-6 lg:hidden">
            <Logo size={40} />
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            {tab === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-muted mt-1">
            {tab === "login" ? "Sign in to continue your journey." : "A few details and you're in."}
          </p>

          <div className="mt-6 inline-flex p-1 rounded-full bg-white/80 border border-line shadow-soft">
            <button
              data-testid="tab-login"
              onClick={() => setTab("login")}
              className={`px-6 h-10 text-sm rounded-full font-semibold transition-all ${
                tab === "login" ? "text-white shadow-soft" : "text-muted"
              }`}
              style={tab === "login" ? { background: "linear-gradient(135deg, #2563EB, #6366F1)" } : {}}
            >
              Login
            </button>
            <button
              data-testid="tab-signup"
              onClick={() => setTab("signup")}
              className={`px-6 h-10 text-sm rounded-full font-semibold transition-all ${
                tab === "signup" ? "text-white shadow-soft" : "text-muted"
              }`}
              style={tab === "signup" ? { background: "linear-gradient(135deg, #2563EB, #6366F1)" } : {}}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <AnimatePresence mode="wait">
              {tab === "signup" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="label-cap">Full name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      data-testid="signup-name"
                      className="input-base pl-11"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="label-cap">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  data-testid="auth-email"
                  type="email"
                  className="input-base pl-11"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label-cap">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  data-testid="auth-password"
                  type="password"
                  className="input-base pl-11"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <button
              data-testid="auth-submit"
              disabled={busy}
              type="submit"
              className="btn-primary w-full"
            >
              {busy ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-xs text-muted mt-6 text-center flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-urgent" /> Your information is encrypted and private.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
