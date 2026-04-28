import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../components/Logo";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { login, signup } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("login");
  const [busy, setBusy] = useState(false);
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
      } else {
        await signup(form.name, form.email, form.password);
        toast.success("Account created");
      }
      nav("/");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      <div className="blob bg-sage/30 w-[460px] h-[460px] -top-32 -left-24 animate-blob" />
      <div className="blob bg-terracotta/30 w-[480px] h-[480px] -bottom-40 -right-24 animate-blob" style={{ animationDelay: "3s" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative grid lg:grid-cols-2 gap-8 max-w-5xl w-full"
      >
        {/* Left brand panel */}
        <div className="hidden lg:flex flex-col justify-between glass rounded-3xl p-10 shadow-soft">
          <Logo size={48} />
          <div className="space-y-5">
            <h1 className="font-heading text-4xl xl:text-5xl tracking-tight font-semibold text-ink leading-[1.05]">
              Help, found in <span className="italic text-sage">moments</span> — not hours.
            </h1>
            <p className="text-muted leading-relaxed max-w-md">
              CareConnect listens, understands urgency, and matches you to the right
              support — food, medical, financial, or simply someone to talk to.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Food", "Medical", "Financial", "Mental Health", "Education"].map((t) => (
                <span key={t} className="pill bg-sage-50 text-sage border border-sage/20">
                  <Sparkles className="w-3 h-3" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted/80">Trusted by communities worldwide.</div>
        </div>

        {/* Right form */}
        <div className="card-soft p-8 sm:p-10" data-testid="auth-card">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <Logo size={40} />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
            {tab === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-muted mt-1">
            {tab === "login" ? "Sign in to continue your journey." : "A few details and you're in."}
          </p>

          <div className="mt-6 inline-flex p-1 rounded-full bg-sage-50">
            <button
              data-testid="tab-login"
              onClick={() => setTab("login")}
              className={`px-5 h-9 text-sm rounded-full font-medium transition-all ${tab === "login" ? "bg-white text-ink shadow-soft" : "text-muted"}`}
            >
              Login
            </button>
            <button
              data-testid="tab-signup"
              onClick={() => setTab("signup")}
              className={`px-5 h-9 text-sm rounded-full font-medium transition-all ${tab === "signup" ? "bg-white text-ink shadow-soft" : "text-muted"}`}
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
