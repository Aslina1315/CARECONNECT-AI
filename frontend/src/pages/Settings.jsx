import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Lock, Save, Heart } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

const Toggle = ({ on, onChange, testid }) => (
  <button
    type="button" onClick={() => onChange(!on)}
    data-testid={testid}
    className={`relative w-12 h-7 rounded-full transition-colors ${on ? "bg-sage" : "bg-line"}`}
    aria-pressed={on}
  >
    <motion.span
      className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow"
      animate={{ x: on ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </button>
);

const Row = ({ icon: Icon, title, desc, children }) => (
  <div className="flex items-start justify-between gap-6 py-5 border-b border-line/70 last:border-0">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-2xl bg-sage/10 text-sage flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="font-medium text-ink">{title}</div>
        <div className="text-sm text-muted mt-0.5">{desc}</div>
      </div>
    </div>
    {children}
  </div>
);

export default function Settings() {
  const [s, setS] = useState({ notifications: true, dark_mode: false, save_activity: true });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get("/settings").then((r) => setS(r.data)).catch(() => {});
  }, []);

  const save = async () => {
    setBusy(true);
    try {
      await api.put("/settings", s);
      toast.success("Settings saved");
    } catch { toast.error("Could not save settings"); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-6 max-w-3xl" data-testid="settings-page">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-4xl font-semibold text-ink tracking-tight">Settings</h1>
        <p className="text-muted mt-1">Tune CareConnect to feel right for you.</p>
      </motion.div>

      <div className="glass-card p-6 sm:p-8">
        <Row icon={Bell} title="Notifications" desc="Get gentle nudges when help is matched.">
          <Toggle on={s.notifications} onChange={(v) => setS({ ...s, notifications: v })} testid="set-notifications" />
        </Row>
        <Row icon={Moon} title="Dark mode" desc="Coming soon — preview toggle for now.">
          <Toggle on={s.dark_mode} onChange={(v) => setS({ ...s, dark_mode: v })} testid="set-dark" />
        </Row>
        <Row icon={Lock} title="Save activity data" desc="Helps us tailor your dashboard insights.">
          <Toggle on={s.save_activity} onChange={(v) => setS({ ...s, save_activity: v })} testid="set-save" />
        </Row>

        <div className="pt-6 flex justify-end">
          <button onClick={save} disabled={busy} className="btn-primary" data-testid="settings-save">
            <Save className="w-4 h-4" /> {busy ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>

      <div className="glass-card p-6 flex items-center gap-3">
        <Heart className="w-4 h-4 text-urgent" />
        <p className="text-sm text-muted">Your data stays yours. We never sell or share personal information.</p>
      </div>
    </div>
  );
}
