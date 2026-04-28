import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart, Sparkles, Send, ShieldCheck, Stethoscope, Wallet, BrainCircuit,
  GraduationCap, Home as HomeIcon, AlertTriangle, MessageCircle, Search,
  ArrowRight, Bot, User as UserIcon, Phone, Compass, Clock, Users, MapPin,
  CheckCircle2, Sprout, BookOpen, HeartHandshake,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

// ───────────── small subcomponents ─────────────
const Eyebrow = ({ children }) => (
  <span className="pill bg-white/85 backdrop-blur border border-sage/25 text-sage shadow-soft">
    <Sparkles className="w-3 h-3" /> {children}
  </span>
);

const SectionHead = ({ eyebrow, title, sub, center = false }) => (
  <div className={`max-w-3xl mb-10 ${center ? "mx-auto text-center" : ""}`}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    {title && (
      <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight font-bold text-ink mt-4 leading-[1.05]">
        {title}
      </h2>
    )}
    {sub && <p className="text-muted text-base sm:text-lg mt-3 leading-relaxed">{sub}</p>}
  </div>
);

const QuickAction = ({ to, Icon, title, desc, gradient, accent, testid }) => (
  <Link to={to} data-testid={testid}>
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="glass-card p-6 h-full group cursor-pointer relative overflow-hidden"
    >
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-30 blur-2xl group-hover:opacity-60 transition-opacity"
        style={{ background: gradient }}
      />
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-soft mb-4"
        style={{ background: gradient }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-heading text-lg font-bold text-ink">{title}</h3>
      <p className="text-sm text-muted mt-1 leading-relaxed">{desc}</p>
      <div className="mt-4 flex items-center text-sm font-bold" style={{ color: accent }}>
        Open <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  </Link>
);

const SupportCategory = ({ Icon, title, description, gradient, queryTag, idx }) => {
  const nav = useNavigate();
  const tid = `cat-${queryTag.split(" ")[0].toLowerCase()}`;
  return (
    <motion.button
      data-testid={tid}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.06 }}
      whileHover={{ y: -3 }}
      onClick={() => nav(`/find-help?q=${encodeURIComponent(queryTag)}`)}
      className="text-left glass-card p-6 group relative overflow-hidden"
    >
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-25 blur-2xl group-hover:opacity-50 transition-opacity"
        style={{ background: gradient }}
      />
      <div className="flex items-start gap-4 relative">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-soft"
          style={{ background: gradient }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading text-lg font-bold text-ink">{title}</h3>
          <p className="text-sm text-muted mt-1 leading-relaxed">{description}</p>
          <div className="mt-3 inline-flex items-center text-sm font-bold text-sage">
            Find {title.toLowerCase()} <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

// ───────────────────────── HOME ─────────────────────────
export default function Home() {
  const { user } = useAuth();
  const nav = useNavigate();
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

  const sampleConvo = [
    { role: "user", text: "I lost my job last week and rent is due. I'm scared." },
    { role: "ai", text: "I hear you, and that fear is so understandable. Let's take this one step at a time. Are you in immediate danger of being evicted, or do you have a few weeks?" },
    { role: "user", text: "About 10 days. I just don't know where to start." },
    { role: "ai", text: "Okay — you have a window. I can connect you to rental-aid programs in your area and a financial counselor who can help. Would you like me to find them now?" },
  ];

  return (
    <div className="space-y-24 sm:space-y-28" data-testid="home-page">
      {/* ════ 1. HERO ════ */}
      <section data-testid="hero-section" className="relative pt-2">
        <div className="hero-glow grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
          <div>
            <Eyebrow>Warm, AI-powered care · in moments</Eyebrow>
            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl tracking-tight font-bold text-ink mt-5 leading-[0.98]"
            >
              {user?.name ? `Hi ${user.name.split(" ")[0]} —` : "Hello —"}<br />
              you're <span className="heading-italic text-gradient">not alone.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-muted text-base sm:text-lg mt-6 max-w-xl leading-relaxed"
            >
              Tell us what you need — food, medical care, financial help, mental health support, or shelter.
              CareConnect listens, classifies urgency, and connects you to the right people, fast.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <Link to="/find-help" className="btn-primary" data-testid="cta-find-help-now">
                Find Help Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/chat" className="btn-ghost" data-testid="cta-talk-to-ai">
                <MessageCircle className="w-4 h-4" /> Talk to AI
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              className="flex items-center gap-3 mt-8 text-sm text-muted"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
              </span>
              <span><span className="text-success font-bold">12,400+</span> people helped this month</span>
            </motion.div>
          </div>

          {/* Trust card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full opacity-50 blur-2xl"
                style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)" }} />
              <div className="space-y-6 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="label-cap text-sage">Live network</div>
                    <div className="font-heading font-bold text-3xl text-ink mt-1">12,400+</div>
                    <div className="text-sm text-muted">people helped this month</div>
                  </div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white animate-float shadow-soft"
                    style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)" }}>
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-sage/10 border border-sage/20">
                    <div className="font-heading text-2xl font-bold text-sage">98%</div>
                    <div className="text-xs text-muted">match accuracy</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-success/10 border border-success/20">
                    <div className="font-heading text-2xl font-bold text-success">{"<2m"}</div>
                    <div className="text-xs text-muted">avg response</div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-line bg-white/70">
                  <div className="flex items-center gap-2 text-xs font-bold text-success">
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

      {/* ════ 2. QUICK ACTIONS ════ */}
      <section data-testid="quick-actions-section">
        <SectionHead
          eyebrow="Quick actions"
          title="What do you need right now?"
          sub="Tap any card to start. Each one takes you straight to the right place — no scrolling required."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <QuickAction to="/find-help" testid="qa-find-help" Icon={Search}
            title="Find help" desc="Discover verified organizations near you."
            gradient="linear-gradient(135deg, #E11D48, #F43F5E)" accent="#E11D48" />
          <QuickAction to="/chat" testid="qa-start-chat" Icon={MessageCircle}
            title="Start a chat" desc="Talk to our caring AI in private."
            gradient="linear-gradient(135deg, #F59E0B, #F43F5E)" accent="#D97706" />
          <QuickAction to="/chat" testid="qa-emergency" Icon={AlertTriangle}
            title="Emergency" desc="Crisis lines and urgent helpline numbers."
            gradient="linear-gradient(135deg, #DC2626, #F97316)" accent="#DC2626" />
          <QuickAction to="/dashboard" testid="qa-resources" Icon={Compass}
            title="Explore" desc="Browse insights and your past requests."
            gradient="linear-gradient(135deg, #B45309, #F59E0B)" accent="#B45309" />
        </div>
      </section>

      {/* ════ 3. SUPPORT CATEGORIES ════ */}
      <section data-testid="support-categories-section">
        <SectionHead
          eyebrow="Support categories"
          title="Help, organized by what matters."
          sub="Every category is curated and reviewed. Click to find vetted organizations in your area."
        />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          <SupportCategory idx={0} Icon={Heart} title="Food support" queryTag="food"
            description="Free meals, food banks, and grocery aid for individuals and families."
            gradient="linear-gradient(135deg, #DC2626, #F59E0B)" />
          <SupportCategory idx={1} Icon={Stethoscope} title="Medical aid" queryTag="medical"
            description="Free clinics, prescription help, and emergency medical assistance."
            gradient="linear-gradient(135deg, #E11D48, #F43F5E)" />
          <SupportCategory idx={2} Icon={Wallet} title="Financial help" queryTag="financial"
            description="Rent, bills, debt counseling, and emergency cash assistance."
            gradient="linear-gradient(135deg, #F59E0B, #B45309)" />
          <SupportCategory idx={3} Icon={HomeIcon} title="Shelter" queryTag="shelter housing"
            description="Safe overnight stays, transitional housing, and domestic-violence havens."
            gradient="linear-gradient(135deg, #B45309, #F59E0B)" />
          <SupportCategory idx={4} Icon={BrainCircuit} title="Mental health" queryTag="mental health"
            description="Therapy, peer support, and 24/7 crisis lines."
            gradient="linear-gradient(135deg, #E11D48, #B45309)" />
          <SupportCategory idx={5} Icon={GraduationCap} title="Education" queryTag="education scholarship"
            description="Scholarships, tuition aid, mentorship, and skill programs."
            gradient="linear-gradient(135deg, #F43F5E, #F59E0B)" />
        </div>
      </section>

      {/* ════ 4. AI CHAT SHOWCASE ════ */}
      <section data-testid="ai-chat-showcase-section">
        <SectionHead
          eyebrow="Meet our AI"
          title="A caring assistant, anytime you need."
          sub="No forms. No hold music. Just a private conversation that listens, understands, and connects you to real help."
        />
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
          <div className="space-y-5">
            <ul className="space-y-3">
              {[
                { Icon: Heart, t: "Empathetic, never judgmental", d: "Trained on human-centered care, not generic chat." },
                { Icon: ShieldCheck, t: "Private by design", d: "Your conversations stay yours — encrypted end-to-end." },
                { Icon: Sparkles, t: "Smart referrals", d: "Detects urgency and routes you to the closest right help." },
                { Icon: Phone, t: "Crisis-aware", d: "Recognizes emergencies and surfaces helplines instantly." },
              ].map(({ Icon, t, d }) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-soft"
                    style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)" }}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="font-bold text-ink">{t}</div>
                    <div className="text-sm text-muted">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={() => nav("/chat")} className="btn-primary mt-2" data-testid="cta-start-chat">
              Start chatting <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="glass-card p-6 sm:p-7 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-30 blur-3xl"
              style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)" }} />
            <div className="flex items-center gap-3 pb-4 border-b border-line/70 relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-soft"
                style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)" }}>
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-bold text-ink leading-tight">CareConnect AI</div>
                <div className="text-xs text-success font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> Online · usually replies in seconds
                </div>
              </div>
            </div>
            <div className="space-y-3 pt-4 relative" data-testid="chat-showcase">
              {sampleConvo.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * i }}
                  className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "ai" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)" }}>
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-ink text-white rounded-br-md"
                      : "bg-sage/8 text-ink border border-sage/20 rounded-bl-md"
                  }`}>
                    {m.text}
                  </div>
                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="flex justify-start gap-2.5"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)" }}>
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-sage/10 px-4 py-3 rounded-2xl flex items-center gap-1.5">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} className="w-1.5 h-1.5 rounded-full bg-sage"
                      animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ 5. HOW IT WORKS ════ */}
      <section data-testid="how-it-works-section">
        <SectionHead
          eyebrow="How it works"
          title="Three steps to real help."
          sub="No paperwork. No phone trees. Just clarity and connection."
        />
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: MessageCircle, n: "01", t: "Tell us what you need", d: "Describe your situation in plain words. The AI understands context, urgency, and emotion." },
            { Icon: Sparkles, n: "02", t: "We classify and match", d: "Our system identifies the category, your urgency level, and pulls verified organizations near you." },
            { Icon: CheckCircle2, n: "03", t: "Get connected", d: "Call, message, or visit — with one tap. We track outcomes so help keeps getting better." },
          ].map(({ Icon, n, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-7 relative overflow-hidden"
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-25 blur-2xl"
                style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)" }} />
              <div className="flex items-start justify-between relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-soft"
                  style={{ background: "linear-gradient(135deg, #E11D48, #F59E0B)" }}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-heading text-3xl font-bold text-sage/30 leading-none">{n}</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-ink mt-5">{t}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════ 6. IMPACT / TRUST ════ */}
      <section data-testid="impact-section" className="relative">
        <div className="glass-card p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-25 blur-3xl"
            style={{ background: "linear-gradient(135deg, #E11D48, #F43F5E)" }} />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-25 blur-3xl"
            style={{ background: "linear-gradient(135deg, #F59E0B, #B45309)" }} />

          <div className="relative">
            <span className="pill bg-white/85 backdrop-blur border border-success/35 text-success">
              <Sprout className="w-3 h-3" /> Real impact
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight font-bold text-ink mt-4 leading-[1.05] max-w-2xl">
              Every connection is a person, <span className="heading-italic text-gradient">not a number.</span>
            </h2>
            <p className="text-muted mt-3 max-w-2xl leading-relaxed">
              CareConnect partners with vetted organizations across food, health, finance, shelter, education,
              and mental health — and tracks outcomes so the platform keeps getting smarter.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
              {[
                { Icon: Users, n: "12.4K+", l: "People helped this month", c: "#E11D48" },
                { Icon: Clock, n: "<2 min", l: "Average match time", c: "#F59E0B" },
                { Icon: MapPin, n: "850+", l: "Verified organizations", c: "#B45309" },
                { Icon: Heart, n: "98%", l: "Reported feeling heard", c: "#DC2626" },
              ].map(({ Icon, n, l, c }, i) => (
                <motion.div
                  key={l}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/85 backdrop-blur rounded-2xl p-5 border border-white/70 shadow-soft"
                >
                  <Icon className="w-5 h-5" style={{ color: c }} />
                  <div className="font-heading text-3xl font-bold text-ink mt-3">{n}</div>
                  <div className="text-xs text-muted mt-1 leading-relaxed">{l}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ 7. REQUEST HELP ════ */}
      <section data-testid="request-help-cta-section">
        <SectionHead
          eyebrow="Request help"
          title="Need a hand right now?"
          sub="Submit a quick request and we'll route it to the right partners."
        />
        <form
          onSubmit={submit}
          className="glass-card p-8 sm:p-10 grid md:grid-cols-2 gap-4"
          data-testid="request-help-section"
        >
          <div className="md:col-span-2 space-y-2">
            <label className="label-cap">What help do you need?</label>
            <textarea
              data-testid="request-need" rows={3}
              className="input-base h-auto py-3 resize-none"
              placeholder="e.g. I need food support for my family this week"
              value={form.need}
              onChange={(e) => setForm({ ...form, need: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="label-cap">Your location</label>
            <input
              data-testid="request-location" className="input-base"
              placeholder="City, area, or pincode"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="label-cap">Phone (optional)</label>
            <input
              data-testid="request-phone" className="input-base"
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

          {last && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2 mt-2 p-5 rounded-2xl border border-sage/25 flex items-center justify-between flex-wrap gap-3"
              style={{ background: "linear-gradient(135deg, rgba(225,29,72,0.06), rgba(245,158,11,0.06))" }}
              data-testid="request-result"
            >
              <div>
                <div className="text-xs label-cap">Detected category</div>
                <div className="font-heading text-lg text-ink font-bold">{last.category}</div>
              </div>
              <div>
                <div className="text-xs label-cap">Urgency</div>
                <div className={`font-heading text-lg font-bold ${last.urgency === "HIGH" ? "text-urgent" : last.urgency === "MEDIUM" ? "text-terracotta-hover" : "text-success"}`}>
                  {last.urgency}
                </div>
              </div>
              <div>
                <div className="text-xs label-cap">Location</div>
                <div className="font-heading text-lg text-ink font-bold">{last.location}</div>
              </div>
            </motion.div>
          )}
        </form>
      </section>

      {/* ════ 8. Final CTA ════ */}
      <section data-testid="final-cta-section">
        <div
          className="rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #E11D48 0%, #F43F5E 50%, #F59E0B 100%)" }}
        >
          <div className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.30), transparent 40%)",
            }} />
          <div className="relative">
            <BookOpen className="w-10 h-10 text-white mx-auto opacity-95" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-4 leading-tight max-w-2xl mx-auto">
              You took the hardest step by being here. <span className="heading-italic">We'll take the next one with you.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mt-7">
              <Link to="/chat" className="inline-flex items-center gap-2 px-7 h-12 rounded-full bg-white text-ink font-bold shadow-soft hover:-translate-y-0.5 transition-transform">
                <MessageCircle className="w-4 h-4" /> Start a chat
              </Link>
              <Link to="/find-help" className="inline-flex items-center gap-2 px-7 h-12 rounded-full bg-white/20 text-white font-bold border border-white/40 backdrop-blur hover:bg-white/30 transition-colors">
                Find help now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
