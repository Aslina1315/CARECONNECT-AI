import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Send, ShieldCheck, Compass, Stethoscope, Wallet, GraduationCap, BrainCircuit, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const CATEGORIES = [
  { Icon: Stethoscope, label: "Medical", grad: "from-sage to-indigo-glow" },
  { Icon: Wallet, label: "Financial", grad: "from-terracotta to-sage" },
  { Icon: Heart, label: "Food", grad: "from-urgent to-terracotta" },
  { Icon: BrainCircuit, label: "Mental Health", grad: "from-success to-terracotta" },
  { Icon: GraduationCap, label: "Education", grad: "from-indigo-glow to-success" },
  { Icon: Compass, label: "General", grad: "from-sage to-success" },
];

export default function Home() {
  const { user } = useAuth();
  const [form, setForm] = useState({ need: "", location: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [last, setLast] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.need.trim() || !form.location.trim()) {
      toast.error("Please describe your need and location");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/requests", form);
      setLast(data);
      toast.success("Request submitted — we hear you.");
      setForm({ need: "", location: "", phone: "" });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-14" data-testid="home-page">
      {/* HERO */}
      <section className="relative pt-4">
        <div className="hero-glow grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="pill bg-white/80 backdrop-blur border border-sage/20 text-sage shadow-soft"
            >
              <Sparkles className="w-3 h-3" /> AI-powered care, in moments
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl tracking-tight font-extrabold text-ink mt-5 leading-[0.98]"
            >
              Hey {user?.name?.split(" ")[0] || "there"} —<br />
              help is just <span className="text-gradient">a moment away.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-muted text-base sm:text-lg mt-6 max-w-xl leading-relaxed"
            >
              CareConnect listens, classifies urgency, and connects you to the right support —
              wherever you are. Talk to our AI, request help, or discover organizations near you.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-7"
            >
              <Link to="/chat" className="btn-primary" data-testid="cta-chat">
                Talk to AI <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/find-help" className="btn-ghost" data-testid="cta-find">
                Find help near me
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2 mt-8"
            >
              {CATEGORIES.map(({ Icon, label, grad }) => (
                <motion.span
                  key={label}
                  whileHover={{ y: -2 }}
                  className="pill bg-white/80 backdrop-blur-sm border border-line text-ink shadow-soft"
                >
                  <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
                    <Icon className="w-3 h-3 text-white" />
                  </span>
                  {label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Right: floating glass card with stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="glass-card p-8 relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-50 blur-2xl"
                style={{ background: "linear-gradient(135deg, #2563EB, #14B8A6)" }} />
              <div className="space-y-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="label-cap text-sage">Live network</div>
                    <div className="font-heading font-extrabold text-3xl text-ink mt-1">12,400+</div>
                    <div className="text-sm text-muted">people helped this month</div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white animate-float"
                    style={{ background: "linear-gradient(135deg, #2563EB, #6366F1)" }}>
                    <Heart className="w-6 h-6" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-sage/5 border border-sage/15">
                    <div className="font-heading text-2xl font-extrabold text-sage">98%</div>
                    <div className="text-xs text-muted">match accuracy</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-success/5 border border-success/20">
                    <div className="font-heading text-2xl font-extrabold text-success">{"<2m"}</div>
                    <div className="text-xs text-muted">avg response</div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-line bg-white/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-success">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                    </span>
                    AI ASSISTANT ONLINE
                  </div>
                  <div className="text-sm text-ink mt-1">Ready to listen, anytime.</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About + Why */}
      <section className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card p-8"
        >
          <h2 className="font-heading text-3xl font-extrabold text-ink tracking-tight">About CareConnect</h2>
          <p className="text-muted mt-3 leading-relaxed">
            People often struggle to find food, medical, financial or emergency aid — not because help
            doesn't exist, but because awareness and access are missing. CareConnect bridges that gap.
          </p>
          <ul className="mt-5 space-y-2.5 text-ink">
            {["Understands user needs", "Classifies urgency levels", "Suggests relevant support", "Guides to immediate action"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                  style={{ background: "linear-gradient(135deg, #2563EB, #14B8A6)" }}>
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="font-medium">{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="glass-card p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 opacity-30 blur-3xl rounded-full"
            style={{ background: "linear-gradient(135deg, #14B8A6, #6366F1)" }} />
          <h2 className="font-heading text-3xl font-extrabold text-ink tracking-tight relative">Why this matters</h2>
          <p className="text-muted mt-3 leading-relaxed relative">
            CareConnect acts as a bridge between people in need and available support systems —
            so help can be faster, smarter, and more accessible.
          </p>
          <blockquote className="mt-5 p-5 rounded-2xl border-l-4 border-sage relative"
            style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(20,184,166,0.06))" }}>
            <span className="font-heading text-xl text-ink leading-snug font-bold italic">
              "No one should struggle to find help when they need it most."
            </span>
          </blockquote>
        </motion.div>
      </section>

      {/* Request Help Form */}
      <section className="glass-card p-8 sm:p-10" data-testid="request-help-section">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-ink tracking-tight">Request Help</h2>
            <p className="text-muted mt-1">Tell us what you need — we'll route it to the right place.</p>
          </div>
          <span className="pill bg-success/10 text-success border border-success/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Private & secure
          </span>
        </div>

        <form onSubmit={submit} className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="label-cap">What help do you need?</label>
            <textarea
              data-testid="request-need"
              rows={3}
              className="input-base h-auto py-3 resize-none"
              placeholder="e.g. I need food support for my family this week"
              value={form.need}
              onChange={(e) => setForm({ ...form, need: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="label-cap">Your location</label>
            <input
              data-testid="request-location"
              className="input-base"
              placeholder="City, area, or pincode"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="label-cap">Phone (optional)</label>
            <input
              data-testid="request-phone"
              className="input-base"
              placeholder="So we can reach back if needed"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between flex-wrap gap-4 pt-2">
            <p className="text-xs text-muted max-w-md">
              By submitting you agree to share these details with verified support partners only.
            </p>
            <button data-testid="request-submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Request"}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {last && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-5 rounded-2xl border border-sage/20 flex items-center justify-between flex-wrap gap-3"
            style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(20,184,166,0.06))" }}
            data-testid="request-result"
          >
            <div>
              <div className="text-xs label-cap">Detected category</div>
              <div className="font-heading text-lg text-ink font-bold">{last.category}</div>
            </div>
            <div>
              <div className="text-xs label-cap">Urgency</div>
              <div className="font-heading text-lg text-urgent font-bold">{last.urgency}</div>
            </div>
            <div>
              <div className="text-xs label-cap">Location</div>
              <div className="font-heading text-lg text-ink font-bold">{last.location}</div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
