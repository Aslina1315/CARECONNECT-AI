import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { TrendingUp, Users, Link2, AlertTriangle, Activity, Globe2 } from "lucide-react";
import { api } from "../lib/api";

const COLORS = ["#5E8B7E", "#D4A373", "#81B29A", "#E07A5F", "#6B7F78", "#B3875B"];

const Metric = ({ icon: Icon, label, value, hue, idx }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}
    className="glass-card p-6"
  >
    <div className="flex items-center justify-between">
      <span className="label-cap">{label}</span>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hue}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="mt-4 font-heading text-4xl font-semibold text-ink">{value}</div>
  </motion.div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard").then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="glass-card p-12 text-center text-muted">Loading insights…</div>;
  if (!data || data.metrics.requests === 0) {
    return (
      <div className="glass-card p-12 text-center" data-testid="dashboard-empty">
        <BarChart className="w-12 h-12 mx-auto text-sage" />
        <h3 className="font-heading text-2xl text-ink mt-4">No data yet</h3>
        <p className="text-muted mt-2">Submit a request or use Find Help to populate your dashboard.</p>
      </div>
    );
  }

  const needData = Object.entries(data.by_need).map(([name, value]) => ({ name, value }));
  const urgencyData = Object.entries(data.by_urgency).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8" data-testid="dashboard-page">
      <section>
        <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-ink tracking-tight">Impact dashboard</h1>
        <p className="text-muted mt-2">A gentle overview of your activity and the help you've engaged with.</p>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <Metric idx={0} icon={TrendingUp} label="Requests" value={data.metrics.requests} hue="bg-sage/10 text-sage" />
        <Metric idx={1} icon={Users} label="People helped" value={data.metrics.helped} hue="bg-success/15 text-success" />
        <Metric idx={2} icon={Link2} label="Matches" value={data.metrics.matches} hue="bg-terracotta/15 text-terracotta-hover" />
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="font-heading text-lg font-bold text-ink flex items-center gap-2"><Activity className="w-4 h-4 text-sage" /> Need distribution</h3>
          <div className="h-64 mt-4 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={needData}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7F78" }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7F78" }} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(94,139,126,0.08)" }} contentStyle={{ borderRadius: 12, border: "1px solid #E8E5DF" }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {needData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-heading text-lg font-bold text-ink flex items-center gap-2"><Activity className="w-4 h-4 text-urgent" /> Urgency mix</h3>
          <div className="h-64 mt-4 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={urgencyData}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7F78" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7F78" }} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(224,122,95,0.08)" }} contentStyle={{ borderRadius: 12, border: "1px solid #E8E5DF" }} />
                <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                  {urgencyData.map((u, i) => (
                    <Cell key={i} fill={u.name === "HIGH" ? "#E07A5F" : u.name === "MEDIUM" ? "#D4A373" : "#81B29A"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        <div className="glass-card p-6">
          <h3 className="font-heading text-lg font-bold text-ink flex items-center gap-2"><Globe2 className="w-4 h-4 text-sage" /> Locations</h3>
          <ul className="mt-4 space-y-2">
            {Object.entries(data.by_location).slice(0, 8).map(([loc, n]) => (
              <li key={loc} className="flex items-center justify-between p-3 rounded-2xl bg-cream border border-line/60">
                <span className="text-ink">{loc}</span>
                <span className="pill bg-sage/10 text-sage">{n} request{n > 1 ? "s" : ""}</span>
              </li>
            ))}
            {Object.keys(data.by_location).length === 0 && <li className="text-muted text-sm">No locations yet.</li>}
          </ul>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-heading text-lg font-bold text-ink flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-urgent" /> High priority</h3>
          {data.high_priority.length === 0 ? (
            <p className="text-muted mt-3 text-sm">No high-priority requests right now.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {data.high_priority.map((h) => (
                <li key={h.id} className="p-3 rounded-2xl bg-urgent/5 border border-urgent/20" data-testid="high-priority-item">
                  <div className="font-medium text-ink">{h.category}</div>
                  <div className="text-xs text-muted mt-1">{h.location} · {new Date(h.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="glass-card p-6">
        <h3 className="font-heading text-lg font-bold text-ink flex items-center gap-2"><Activity className="w-4 h-4 text-sage" /> Recent activity</h3>
        <ul className="mt-4 divide-y divide-line/70">
          {data.recent.map((r) => (
            <li key={r.id} className="py-3 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-ink font-medium">{r.category}</div>
                <div className="text-xs text-muted">{r.location}</div>
              </div>
              <span className={`pill ${r.urgency === "HIGH" ? "bg-urgent/10 text-urgent" : r.urgency === "MEDIUM" ? "bg-terracotta/15 text-terracotta-hover" : "bg-success/15 text-success"}`}>
                {r.urgency}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
