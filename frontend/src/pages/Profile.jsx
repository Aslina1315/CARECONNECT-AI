import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Save, User as UserIcon, Mail, Phone, MapPin, Camera, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

const MAX_FILE_BYTES = 1_000_000; // ~1 MB raw

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    location: user?.location || "",
    bio: user?.bio || "",
    picture: user?.picture || "",
  });
  const [busy, setBusy] = useState(false);

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("Image must be under 1 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, picture: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const removePicture = () => setForm((f) => ({ ...f, picture: "" }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.put("/auth/profile", form);
      updateUser(data);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Could not update profile");
    } finally {
      setBusy(false);
    }
  };

  const initial = (form.name || user?.email || "?")[0].toUpperCase();

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6" data-testid="profile-page">
      {/* Avatar + Identity */}
      <motion.aside
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6 text-center relative overflow-hidden"
      >
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30"
          style={{ background: "linear-gradient(135deg, #6B8E7F, #D9B89C)" }}
        />
        <div className="relative inline-block">
          <div
            className="relative w-32 h-32 mx-auto rounded-full p-1"
            style={{ background: "linear-gradient(135deg, #6B8E7F, #D9B89C)" }}
          >
            {form.picture ? (
              <img
                src={form.picture}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                data-testid="profile-avatar-img"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-heading font-bold text-5xl text-ink">
                {initial}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            data-testid="profile-avatar-edit"
            className="absolute bottom-1 right-1 w-10 h-10 rounded-full text-white flex items-center justify-center shadow-soft hover:-translate-y-0.5 transition-transform"
            style={{ background: "linear-gradient(135deg, #6B8E7F, #D9B89C)" }}
            title="Change photo"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickFile}
            data-testid="profile-avatar-input"
          />
        </div>

        <h2 className="font-heading text-xl text-ink mt-5 font-bold">{form.name || "Your name"}</h2>
        <p className="text-sm text-muted">{user?.email}</p>

        {form.picture && (
          <button
            type="button"
            onClick={removePicture}
            data-testid="profile-avatar-remove"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-urgent hover:underline font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove photo
          </button>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
          <div className="p-3 rounded-2xl bg-sage/10 text-sage font-bold">Member</div>
          <div className="p-3 rounded-2xl bg-success/10 text-success font-bold">Verified</div>
        </div>
      </motion.aside>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={save} className="glass-card p-8 space-y-6"
      >
        <div>
          <h2 className="font-heading text-3xl text-ink font-bold tracking-tight">My profile</h2>
          <p className="text-muted text-sm">Keep your details up to date so we can connect you faster.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="label-cap">Full name</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                data-testid="profile-name" className="input-base pl-11"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label-cap">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                data-testid="profile-email" disabled
                className="input-base pl-11 bg-cream text-muted cursor-not-allowed"
                value={user?.email || ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label-cap">Phone number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                data-testid="profile-phone" className="input-base pl-11"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="So we can reach you"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="label-cap">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                data-testid="profile-location" className="input-base pl-11"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, area"
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="label-cap">About you</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-4 h-4 text-muted" />
              <textarea
                data-testid="profile-bio" rows={3}
                className="input-base pl-11 h-auto py-3 resize-none"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="A short bio — what brings you here, what kind of help you're seeking, or how you'd like to support others."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button data-testid="profile-save" type="submit" className="btn-primary" disabled={busy}>
            <Save className="w-4 h-4" /> {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
