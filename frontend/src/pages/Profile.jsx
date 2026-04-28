import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, User as UserIcon, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const ICON_3D = "https://static.prod-images.emergentagent.com/jobs/76efff76-2b4d-4175-af2a-a2e0b061631b/images/7d25bfae837b89944f90c51ec3f2dea9d9cc7d59ade3dd037e69ec889187e076.png";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "", phone: user?.phone || "", location: user?.location || "",
  });
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      updateUser(data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not update");
    } finally { setBusy(false); }
  };

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-6" data-testid="profile-page">
      <motion.aside initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="card-soft p-6 text-center">
        <motion.img src={ICON_3D} className="w-32 h-32 mx-auto" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }} />
        <h2 className="font-heading text-xl text-ink mt-4">{user?.name}</h2>
        <p className="text-sm text-muted">{user?.email}</p>
        <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
          <div className="p-3 rounded-2xl bg-sage/10 text-sage font-medium">Member</div>
          <div className="p-3 rounded-2xl bg-success/15 text-success font-medium">Verified</div>
        </div>
      </motion.aside>

      <motion.form
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={save} className="card-soft p-8 space-y-5"
      >
        <div>
          <h2 className="font-heading text-2xl text-ink">My profile</h2>
          <p className="text-muted text-sm">Keep your details up to date so we can connect you faster.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="label-cap">Full name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input data-testid="profile-name" className="input-base pl-11" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label-cap">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input data-testid="profile-email" disabled className="input-base pl-11 bg-cream text-muted" value={user?.email || ""} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label-cap">Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input data-testid="profile-phone" className="input-base pl-11" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label-cap">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input data-testid="profile-location" className="input-base pl-11" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, area" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button data-testid="profile-save" type="submit" className="btn-primary" disabled={busy}>
            <Save className="w-4 h-4" /> {busy ? "Saving…" : "Update profile"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
