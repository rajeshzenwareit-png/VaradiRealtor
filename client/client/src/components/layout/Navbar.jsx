// src/components/layout/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBell, FiMessageSquare, FiExternalLink, FiLogOut, FiSearch, FiMenu, FiX,
} from "react-icons/fi";

export default function Navbar({
  logoText = "MyBrand",
  logoHref = "/admin",
  websiteHref = "/",
  onLogout = () => {},
  onSearch = () => {},
  notificationCount = 0,
  messageCount = 0,
  profileImg = "https://i.pravatar.cc/64?img=3",

  // NEW (for sidebar toggle)
  showMenuButton = true,
  onMenuClick = () => {},
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Close mobile search on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const SubmitSearch = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    onSearch((q || "").toString());
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 h-14 flex items-center gap-2">
        {/* Left: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-2">
          {showMenuButton && (
            <button
              type="button"
              onClick={onMenuClick}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50"
              aria-label="Open menu"
              title="Menu"
            >
              <FiMenu />
            </button>
          )}
          <Link to={logoHref} className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-rose-600 text-white grid place-items-center font-bold">M</div>
            <span className="hidden sm:block font-semibold text-slate-900">{logoText}</span>
          </Link>
        </div>

        {/* Middle: Search (desktop only) */}
        <form onSubmit={SubmitSearch} className="hidden md:flex flex-1 justify-center">
          <div className="w-full max-w-xl relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              type="search"
              placeholder="Search properties, city, price…"
              className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Mobile search button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50"
            aria-label="Search"
            title="Search"
          >
            <FiSearch />
          </button>

          {/* View Website (hide label on smaller screens) */}
          <a
            href={websiteHref}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            title="View Website"
          >
            <FiExternalLink />
            <span className="hidden md:inline">View Website</span>
          </a>

          {/* Notifications */}
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50"
            aria-label="Notifications"
            title="Notifications"
          >
            <FiBell />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-600 text-white text-[10px] grid place-items-center px-1">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>

          {/* Messages */}
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50"
            aria-label="Messages"
            title="Messages"
          >
            <FiMessageSquare />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-rose-600 text-white text-[10px] grid place-items-center px-1">
                {messageCount > 99 ? "99+" : messageCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full"
            title="Profile"
            aria-label="Profile"
          >
            <img
              src={profileImg}
              alt="Profile"
              className="h-10 w-10 rounded-full border border-slate-300 object-cover"
            />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-rose-600 text-white px-3 py-2 hover:bg-rose-700"
            title="Logout"
          >
            <FiLogOut />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${searchOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!searchOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${searchOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSearchOpen(false)}
        />
        <div
          className={`absolute left-0 right-0 top-0 bg-white border-b shadow-sm p-3 transition-transform
            ${searchOpen ? "translate-y-0" : "-translate-y-full"}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300"
              aria-label="Close search"
              title="Close"
            >
              <FiX />
            </button>
            <form onSubmit={SubmitSearch} className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  name="q"
                  type="search"
                  placeholder="Search…"
                  className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
