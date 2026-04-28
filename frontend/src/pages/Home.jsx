import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Send, ShieldCheck, Compass, Stethoscope, Wallet, GraduationCap, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

const HERO_BG = "https://static.prod-images.emergentagent.com/jobs/76efff76-2b4d-4175-af2a-a2e0b061631b/images/5c8d823cd462f810dbdbff20cce387e87eed8c11767af4a9453656f1b5291c33.png";
const ICON_3D = "https://static.prod-images.emergentagent.com/jobs/76efff76-2b4d-4175-af2a-a2e0b061631b/images/7d25bfae837b89944f90c51ec3f2dea9d9cc7d59ade3dd037e69ec889187e076.png";

const CATEGORIES = [
  { Icon: Stethoscope, label: "Medical", color: "bg-sage/10 text-sage" },
  { Icon: Wallet, label: "Financial", color: "bg-terracotta/15 text-terracotta-hover" },
  { Icon: Heart, label: "Food", color: "bg-urgent/10 text-urgent" },
  { Icon: BrainCircuit, label: "Mental Health", color: "bg-success/15 text-success" },
  { Icon: GraduationCap, label: "Education", color: "bg-sage/10 text-sage" },
  { Icon: Compass, label: "General", color: "bg-ink/5 text-ink" },
];

export default function Home() {
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
    <div className="space-y-12" data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden card-soft p-8 sm:p-12">
        <img src={HERO_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-cream/85 via-cream/60 to-transparent" />
        <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="pill bg-sage/10 text-sage border border-sage/20"
            >
              <Sparkles className="w-3 h-3" /> Connecting people to the right help
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl tracking-tight font-semibold text-ink mt-4 leading-[1.05]"
            >
              No one should struggle to find help when they need it most.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-muted text-base sm:text-lg mt-5 max-w-xl leading-relaxed"
            >
              CareConnect uses AI to understand your need, classify urgency, and guide you to the
              fastest, kindest support — wherever you are.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {CATEGORIES.map(({ Icon, label, color }) => (
                <span key={label} className={`pill ${color}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </span>
              ))}
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <motion.img
              src={ICON_3D}
              alt="Care icon"
              className="w-72 h-72 object-contain drop-shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* About + Why */}
      <section className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="card-soft p-8"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink tracking-tight">About CareConnect</h2>
          <p className="text-muted mt-3 leading-relaxed">
            People often struggle to find food, medical, financial or emergency aid — not because help
            doesn't exist, but because awareness and access are missing. CareConnect bridges that gap.
          </p>
          <ul className="mt-5 space-y-2 text-ink">
            {["Understands user needs", "Classifies urgency levels", "Suggests relevant support", "Guides to immediate action"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-sage/10 text-sage flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="card-soft p-8 bg-gradient-to-br from-white to-sage/5"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink tracking-tight">Why this matters</h2>
          <p className="text-muted mt-3 leading-relaxed">
            CareConnect acts as a bridge between people in need and available support systems —
            so help can be faster, smarter, and more accessible.
          </p>
          <blockquote className="mt-5 p-5 rounded-2xl bg-sage/10 text-ink font-heading text-lg leading-snug border-l-4 border-sage">
            "No one should struggle to find help when they need it most."
          </blockquote>
        </motion.div>
      </section>

      {/* Request Help Form */}
      <section className="card-soft p-8 sm:p-10" data-testid="request-help-section">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-medium text-ink tracking-tight">Request Help</h2>
            <p className="text-muted mt-1">Tell us what you need — we'll route it to the right place.</p>
          </div>
          <span className="pill bg-success/15 text-success border border-success/30">
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
            className="mt-6 p-5 rounded-2xl bg-sage/10 border border-sage/20 flex items-center justify-between flex-wrap gap-3"
            data-testid="request-result"
          >
            <div>
              <div className="text-sm text-muted">Detected category</div>
              <div className="font-heading text-lg text-ink">{last.category}</div>
            </div>
            <div>
              <div className="text-sm text-muted">Urgency</div>
              <div className="font-heading text-lg text-urgent">{last.urgency}</div>
            </div>
            <div>
              <div className="text-sm text-muted">Location</div>
              <div className="font-heading text-lg text-ink">{last.location}</div>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
