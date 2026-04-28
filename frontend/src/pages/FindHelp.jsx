import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Phone, ExternalLink, Star, Zap, Plus, Locate } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

export default function FindHelp() {
  const [need, setNeed] = useState("");
  const [location, setLocation] = useState("");
  const [count, setCount] = useState(6);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

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

  return (
    <div className="space-y-8" data-testid="find-help-page">
      <section>
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl sm:text-5xl font-semibold text-ink tracking-tight"
        >
          Find help <span className="italic text-sage">near you</span>
        </motion.h1>
        <p className="text-muted mt-2 max-w-xl">Describe what you need. We'll match you with thoughtful, real-feel resources.</p>
      </section>

      <form onSubmit={search} className="card-soft p-6 sm:p-8 grid md:grid-cols-[2fr_1.2fr_auto] gap-3 items-end">
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
            <span className={`pill border ${result.urgency === "HIGH" ? "bg-urgent/10 text-urgent border-urgent/30" : result.urgency === "MEDIUM" ? "bg-terracotta/15 text-terracotta-hover border-terracotta/30" : "bg-success/15 text-success border-success/30"}`}>
              <Zap className="w-3.5 h-3.5" /> {result.urgency} urgency
            </span>
            <span className="text-sm text-muted">{result.organizations.length} matches</span>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {result.organizations.map((o, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card-soft overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all"
                data-testid="org-card"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={o.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="pill bg-white/90 backdrop-blur text-ink"><Star className="w-3 h-3 text-sage" /> {o.match_score}%</span>
                    <span className="pill bg-urgent/90 text-white"><Zap className="w-3 h-3" /> {o.priority_score}</span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-heading text-lg text-ink leading-tight">{o.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted"><MapPin className="w-3.5 h-3.5" /> {o.location}</div>
                  <p className="text-sm text-muted leading-relaxed line-clamp-3">{o.description}</p>
                  {o.reason && (
                    <div className="text-xs text-sage bg-sage/5 px-3 py-2 rounded-xl border border-sage/15">
                      <span className="font-medium">Why this fits: </span>{o.reason}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-line/70">
                    {o.contact && (
                      <a href={/^[\d+\-\s()]+$/.test(o.contact) ? `tel:${o.contact}` : o.contact}
                         className="inline-flex items-center gap-1.5 text-sm text-ink hover:text-sage" target="_blank" rel="noreferrer">
                        <Phone className="w-3.5 h-3.5" /> {o.contact.length > 18 ? o.contact.slice(0, 18) + "…" : o.contact}
                      </a>
                    )}
                    <a href={o.maps_link} target="_blank" rel="noreferrer"
                       className="inline-flex items-center gap-1 text-sm text-sage hover:text-sage-hover font-medium">
                      Map <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="flex justify-center">
            <button onClick={loadMore} className="btn-ghost" disabled={busy} data-testid="find-load-more">
              <Plus className="w-4 h-4" /> Load more results
            </button>
          </div>
        </section>
      )}

      {!result && !busy && (
        <div className="card-soft p-12 text-center">
          <Search className="w-12 h-12 mx-auto text-sage" />
          <h3 className="font-heading text-2xl text-ink mt-4">Ready when you are</h3>
          <p className="text-muted mt-2">Describe your need above to discover personalized resources.</p>
        </div>
      )}
    </div>
  );
}
