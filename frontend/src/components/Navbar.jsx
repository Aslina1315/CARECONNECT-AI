import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, MessageCircle, Search, BarChart3, User, Settings, LogOut, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../lib/auth";

const NAV = [
  { to: "/", label: "Home", icon: Home, testid: "nav-home" },
  { to: "/chat", label: "Chat", icon: MessageCircle, testid: "nav-chat" },
  { to: "/find-help", label: "Find Help", icon: Search, testid: "nav-find" },
  { to: "/dashboard", label: "Dashboard", icon: BarChart3, testid: "nav-dashboard" },
  { to: "/profile", label: "Profile", icon: User, testid: "nav-profile" },
  { to: "/settings", label: "Settings", icon: Settings, testid: "nav-settings" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    nav("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 lg:px-10 pt-4">
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="glass rounded-full shadow-soft px-3 sm:px-5 py-2 flex items-center justify-between gap-3"
        data-testid="top-navbar"
      >
        <Logo size={38} />

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV.map(({ to, label, icon: Icon, testid }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              data-testid={testid}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-4 h-10 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "text-white shadow-soft"
                    : "text-ink/75 hover:text-ink hover:bg-white"
                }`
              }
              style={({ isActive }) => isActive ? {
                background: "linear-gradient(135deg, #6B8E7F 0%, #D9B89C 100%)",
                boxShadow: "0 8px 22px rgba(107, 142, 127, 0.32)",
              } : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="hidden sm:flex items-center gap-2 pl-1 pr-3 h-10 rounded-full bg-white border border-line shadow-soft"
            data-testid="profile-chip"
          >
            {user?.picture ? (
              <img
                src={user.picture}
                alt=""
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs"
                style={{ background: "linear-gradient(135deg, #6B8E7F, #D9B89C)" }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <span className="max-w-[120px] truncate text-sm font-semibold text-ink">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            data-testid="logout-btn"
            className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full text-muted hover:text-urgent hover:bg-urgent/10 transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-line text-ink"
            onClick={() => setOpen((o) => !o)}
            data-testid="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mt-2 glass rounded-3xl shadow-soft p-3 grid grid-cols-2 gap-2"
          data-testid="mobile-menu"
        >
          {NAV.map(({ to, label, icon: Icon, testid }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setOpen(false)}
              data-testid={`mobile-${testid}`}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 h-11 rounded-2xl text-sm font-semibold ${
                  isActive ? "text-white" : "text-ink hover:bg-white"
                }`
              }
              style={({ isActive }) => isActive ? {
                background: "linear-gradient(135deg, #6B8E7F, #D9B89C)",
              } : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="col-span-2 flex items-center justify-center gap-2 h-11 rounded-2xl bg-urgent/10 text-urgent font-semibold"
            data-testid="mobile-logout-btn"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </motion.div>
      )}
    </header>
  );
}
