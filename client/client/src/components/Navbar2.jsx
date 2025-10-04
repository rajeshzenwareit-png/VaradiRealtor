import React, { useState } from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

export default function Navbar2({
  items = [],
  contactHref = "/contactsection",
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="absolute top-5 left-0 right-0 z-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative">
        {/* Left: Logo */}
        <Logo />

        {/* Center: Desktop Menu */}
        <NavLinks items={items} />

        {/* Right: Contact + Mobile controls */}
        <div className="flex items-center gap-3">
          <a
            href={contactHref}
            className="hidden md:inline-flex items-center justify-center px-10 py-3 rounded-full bg-sky-500 text-white font-semibold shadow transition hover:bg-sky-600 xl:mr-[5rem]"
          >
            CONTACT
          </a>

          {/* Mobile: Contact + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href={contactHref}
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-sky-500 text-white text-sm font-medium shadow transition hover:bg-sky-600"
            >
              Contact
            </a>
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="md:hidden w-full px-4 sm:px-6 lg:px-8 pb-4">
          <div className="rounded-lg bg-sky-600 backdrop-blur border border-white/10 p-4 space-y-2 font-semibold">
            {items.map(({ label, href }, i) => (
              <a key={i} href={href} className="block py-2 text-white/90 hover:text-white">
                {label}
              </a>
            ))}
            <a href={contactHref} className="block py-2 text-white/90 hover:text-white">
              CONTACT
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
