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
    nav("/login");
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-10 pt-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass rounded-3xl shadow-soft px-4 sm:px-5 py-3 flex items-center justify-between gap-3"
          data-testid="top-navbar"
        >
          <Logo size={36} />

          <div className="hidden lg:flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon, testid }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                data-testid={testid}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 h-10 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-sage text-white shadow-soft"
                      : "text-ink/80 hover:bg-sage-50 hover:text-ink"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 h-10 rounded-full bg-sage-50 text-ink text-sm font-medium" data-testid="profile-chip">
              <div className="w-7 h-7 rounded-full bg-sage text-white flex items-center justify-center font-semibold text-xs">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="max-w-[120px] truncate">{user?.name}</span>
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
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-sage-50 text-ink"
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
            initial={{ opacity: 0, y: -10 }}
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
                  `flex items-center gap-2 px-3 h-11 rounded-2xl text-sm font-medium ${
                    isActive ? "bg-sage text-white" : "text-ink hover:bg-sage-50"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="col-span-2 flex items-center justify-center gap-2 h-11 rounded-2xl bg-urgent/10 text-urgent font-medium"
              data-testid="mobile-logout-btn"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
}
