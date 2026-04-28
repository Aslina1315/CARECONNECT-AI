import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Phone, ExternalLink, Star, Zap, Plus, Locate, Share2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";

// Pools of warm, real-feel imagery per category — different image for each card.
const IMAGE_POOLS = {
  Food: [
    "https://images.pexels.com/photos/6646987/pexels-photo-6646987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6995208/pexels-photo-6995208.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6995234/pexels-photo-6995234.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6995242/pexels-photo-6995242.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/3902881/pexels-photo-3902881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
  ],
  Medical: [
    "https://images.pexels.com/photos/3958422/pexels-photo-3958422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4173324/pexels-photo-4173324.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4031818/pexels-photo-4031818.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
  ],
  MentalHealth: [
    "https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/3768914/pexels-photo-3768914.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/3958456/pexels-photo-3958456.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4101144/pexels-photo-4101144.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/3760137/pexels-photo-3760137.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4101135/pexels-photo-4101135.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
  ],
  Financial: [
    "https://images.pexels.com/photos/6646926/pexels-photo-6646926.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6964107/pexels-photo-6964107.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4968630/pexels-photo-4968630.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4968391/pexels-photo-4968391.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6863251/pexels-photo-6863251.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4968382/pexels-photo-4968382.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
  ],
  Education: [
    "https://images.pexels.com/photos/4145354/pexels-photo-4145354.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/8617768/pexels-photo-8617768.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/8612923/pexels-photo-8612923.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/4145351/pexels-photo-4145351.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6929187/pexels-photo-6929187.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
  ],
  General: [
    "https://images.pexels.com/photos/6646987/pexels-photo-6646987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6995208/pexels-photo-6995208.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/8074552/pexels-photo-8074552.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    "https://images.pexels.com/photos/6995198/pexels-photo-6995198.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
  ],
};

const poolKey = (category) => {
  const c = (category || "").toLowerCase();
  if (c.includes("food")) return "Food";
  if (c.includes("medical")) return "Medical";
  if (c.includes("mental")) return "MentalHealth";
  if (c.includes("financial")) return "Financial";
  if (c.includes("education")) return "Education";
  return "General";
};

const imageFor = (category, idx) => {
  const pool = IMAGE_POOLS[poolKey(category)] || IMAGE_POOLS.General;
  return pool[idx % pool.length];
};

const urgencyClasses = (u) => {
  if (u === "HIGH") return "pill-urgent";
  if (u === "MEDIUM") return "pill-amber";
  return "pill-success";
};

export default function FindHelp() {
  const [params] = useSearchParams();
  const [need, setNeed] = useState(params.get("q") || "");
  const [location, setLocation] = useState("");
  const [count, setCount] = useState(6);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => { /* keep input in sync if route updates */ }, [params]);

  const detectLocation = async () => {
    try {
      const r = await fetch("https://ipinfo.io/json");
      const j = await r.json();
      const c = j.city ? `${j.city}${j.region ? ", " + j.region : ""}` : "";
      if (c) {
        setLocation(c);
        toast.success(`Detected: ${c}`);
      } else { toast.error("Could not detect location"); }
    } catch { toast.error("Location detection failed"); }
  };

  const search = async (e) => {
    e?.preventDefault();
    if (!need.trim() || !location.trim()) {
      toast.error("Need and location are required"); return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/find-help", { need, location, count });
      setResult(data);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not fetch help");
    } finally { setBusy(false); }
  };

  const loadMore = async () => {
    setCount((c) => c + 4);
    await search();
  };

  const shareOrg = async (org) => {
    const text =
      `🤝 Found help on CareConnect:\n\n` +
      `${org.name}\n📍 ${org.location}\n` +
      (org.contact ? `📞 ${org.contact}\n` : "") +
      `\n${org.description}\n\nMap: ${org.maps_link}`;
    if (navigator.share) {
      try { await navigator.share({ title: org.name, text, url: org.maps_link }); return; }
      catch (e) { if (e?.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied — share it with someone who needs it.");
    } catch { toast.error("Could not share or copy"); }
  };

  return (
    <div className="space-y-8" data-testid="find-help-page">
      <section>
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl sm:text-5xl font-bold text-ink tracking-tight"
        >
          Find help <span className="heading-italic text-gradient">near you</span>
        </motion.h1>
        <p className="text-muted mt-2 max-w-xl">Describe what you need. We'll match you with thoughtful, real-feel resources.</p>
      </section>

      <form onSubmit={search} className="glass-card p-6 sm:p-8 grid md:grid-cols-[2fr_1.2fr_auto] gap-3 items-end">
        <div className="space-y-2">
          <label className="label-cap">Describe your need</label>
          <input
            data-testid="find-need" className="input-base"
            placeholder="e.g. urgent food support for elderly parents"
            value={need} onChange={(e) => setNeed(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="label-cap">Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              data-testid="find-location" className="input-base pl-11 pr-12"
              placeholder="City or area"
              value={location} onChange={(e) => setLocation(e.target.value)}
            />
            <button
              type="button" onClick={detectLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-sage-50 text-sage hover:bg-sage hover:text-white transition-all flex items-center justify-center"
              title="Auto-detect location"
              data-testid="find-detect-location"
            >
              <Locate className="w-4 h-4" />
            </button>
          </div>
        </div>
        <button data-testid="find-submit" className="btn-primary h-12" disabled={busy}>
          {busy ? "Searching…" : <>Find Best Help <Search className="w-4 h-4" /></>}
        </button>
      </form>

      {result && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="pill bg-sage/10 text-sage border border-sage/20">
              <Star className="w-3.5 h-3.5" /> {result.category}
            </span>
            <span className={urgencyClasses(result.urgency)} data-testid="urgency-badge">
              <Zap className="w-3.5 h-3.5" /> {result.urgency} urgency
            </span>
            <span className="text-sm text-muted">{result.organizations.length} matches</span>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {result.organizations.map((o, i) => {
              const img = imageFor(result.category, i);
              return (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all"
                  data-testid="org-card"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy"
                         onError={(e) => { e.currentTarget.src = IMAGE_POOLS.General[i % IMAGE_POOLS.General.length]; }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35) 100%)" }} />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="pill bg-white/95 text-ink"><Star className="w-3 h-3 text-sage" /> {o.match_score}%</span>
                      {result.urgency === "HIGH" ? (
                        <span className="pill bg-urgent text-white shadow-soft"><Zap className="w-3 h-3" /> URGENT</span>
                      ) : (
                        <span className="pill bg-white/95 text-ink"><Zap className="w-3 h-3" /> {o.priority_score}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-heading text-lg text-ink leading-tight font-bold">{o.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted"><MapPin className="w-3.5 h-3.5" /> {o.location}</div>
                    <p className="text-sm text-muted leading-relaxed line-clamp-3">{o.description}</p>
                    {o.reason && (
                      <div className="text-xs text-sage bg-sage/5 px-3 py-2 rounded-xl border border-sage/15">
                        <span className="font-bold">Why this fits: </span>{o.reason}
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-line/70">
                      {o.contact && (
                        <a href={/^[\d+\-\s()]+$/.test(o.contact) ? `tel:${o.contact}` : o.contact}
                           className="inline-flex items-center gap-1.5 text-sm text-ink hover:text-sage font-semibold" target="_blank" rel="noreferrer">
                          <Phone className="w-3.5 h-3.5" /> {o.contact.length > 18 ? o.contact.slice(0, 18) + "…" : o.contact}
                        </a>
                      )}
                      <div className="flex items-center gap-3">
                        <button onClick={() => shareOrg(o)} data-testid="org-share-btn"
                                className="inline-flex items-center gap-1 text-sm text-terracotta-hover hover:text-terracotta font-bold"
                                title="Share with a friend">
                          <Share2 className="w-3.5 h-3.5" /> Share
                        </button>
                        <a href={o.maps_link} target="_blank" rel="noreferrer"
                           className="inline-flex items-center gap-1 text-sm text-sage hover:text-sage-hover font-bold">
                          Map <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="flex justify-center">
            <button onClick={loadMore} className="btn-ghost" disabled={busy} data-testid="find-load-more">
              <Plus className="w-4 h-4" /> Load more results
            </button>
          </div>
        </section>
      )}

      {!result && !busy && (
        <div className="glass-card p-12 text-center">
          <Search className="w-12 h-12 mx-auto text-sage" />
          <h3 className="font-heading text-2xl font-bold text-ink mt-4">Ready when you are</h3>
          <p className="text-muted mt-2">Describe your need above to discover personalized resources.</p>
        </div>
      )}
    </div>
  );
}
