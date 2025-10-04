import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-50"> {/* Removed border-b */}
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/images/logo.png"
              alt="SLN Properties logo"
              className="h-16 w-16 object-contain"
              decoding="async"
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6 text-md font-bold">
            <Link
              to="/"
              className="hover:text-sky-700 hover:border-b-2 hover:border-sky-500 transition pb-1"
            >
              Home
            </Link>
            <Link
              to="/properties"
              className="hover:text-sky-700 hover:border-b-2 hover:border-sky-500 transition pb-1"
            >
              Properties
            </Link>
            <Link
              to="/blogsection"
              className="hover:text-sky-700 hover:border-b-2 hover:border-sky-500 transition pb-1"
            >
              Blog
            </Link>
            <Link
              to="/projectsection"
              className="hover:text-sky-700 hover:border-b-2 hover:border-sky-500 transition pb-1"
            >
              Projects
            </Link>
            <Link
              to="/contactsection"
              className="hover:text-sky-700 hover:border-b-2 hover:border-sky-500 transition pb-1"
            >
              Contact
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
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

      {/* Mobile menu panel */}
      <div
        className={`md:hidden transition-[max-height] duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8 pb-4">
          <div className="rounded-lg border border-gray-200 text-white bg-sky-500 shadow-sm font-bold">
            <div className="flex flex-col p-2 text-sm font-semibold">
              <Link
                to="/"
                className="px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/properties"
                className="px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Properties
              </Link>
              <Link
                to="/blogsection"
                className="px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/projectsection"
                className="px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Projects
              </Link>
              <Link
                to="/contactsection"
                className="px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
