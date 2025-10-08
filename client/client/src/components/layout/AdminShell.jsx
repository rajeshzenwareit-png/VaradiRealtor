// src/components/layout/AdminShell.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminShell() {
  const [open, setOpen] = useState(false);

  // Close drawer on Esc
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when drawer is open (mobile)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top navbar with hamburger control for mobile */}
      <Navbar
        logoText="Admin"
        websiteHref="/"
        showMenuButton
        onMenuClick={() => setOpen((v) => !v)}
        onLogout={() => { /* TODO: hook logout */ }}
        onSearch={(q) => console.log("search:", q)}
      />

      {/* Layout area */}
      <div className="relative flex-1 flex">
        {/* Desktop sidebar (scrollable, fixed width) */}
        <div className="hidden md:flex md:flex-col md:w-64 md:shrink-0">
          <div className="fixed inset-y-0 left-0 w-64 z-40 overflow-y-auto">
            <Sidebar className="h-full" />
          </div>
        </div>

        {/* Content (adds left padding to avoid overlay under fixed sidebar) */}
        <main className="flex-1 md:pl-64 px-4 sm:px-6 lg:px-8 py-6 min-w-0 overflow-x-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
          <Outlet />
        </main>

        {/* Mobile backdrop */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          className={`md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity ${
            open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Mobile drawer (slide-in) */}
        <aside
          className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}`}
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
        >
          <div className="h-full overflow-y-auto bg-blue-700">
            <Sidebar className="h-full" onNavigate={() => setOpen(false)} />
          </div>
        </aside>
      </div>
    </div>
  );
}
