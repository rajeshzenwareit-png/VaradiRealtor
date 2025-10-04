// src/components/AdminDashboard/Dashboard.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiMenu, FiX, FiSearch, FiBell, FiLogOut, FiHome, FiFileText,
  FiLayers, FiStar, FiUsers, FiSettings
} from "react-icons/fi";

function navLinkClass({ isActive }) {
  return `
    flex items-center gap-3 px-3 py-2 rounded-lg transition
    ${isActive ? "bg-sky-100 text-sky-800 font-semibold" : "hover:bg-gray-100 text-gray-700"}
  `;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = useNavigate();
  const handleLogout = () => nav("/login");

  return (
    <div className="w-screen h-[100svh] flex flex-col bg-sky-200 overflow-hidden">
      {/* Header (full width, fixed height) */}
      <header className="sticky top-0 inset-x-0 z-40 bg-sky-200 border-b h-16 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-sky-300/60"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
            <a href="/admin" className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-sky-600 text-white font-bold">A</span>
              <span className="text-lg font-bold tracking-tight">Admin</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border bg-white">
              <FiSearch className="text-gray-400" />
              <input placeholder="Search…" className="outline-none text-sm w-40 bg-transparent" />
            </div>
            <button className="h-10 w-10 rounded-md hover:bg-sky-300/60 flex items-center justify-center">
              <FiBell className="text-lg" />
            </button>
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Shell: fills the rest of the viewport */}
      <div className="w-full flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[240px_1fr]">
        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar (slides on mobile, static on lg) */}
        <aside
          className={`
            fixed z-40 top-16 bottom-0 left-0 w-72 lg:w-auto
            lg:static lg:translate-x-0
            transition-transform
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            bg-white border-r lg:border-r-0
          `}
          aria-label="Sidebar"
        >
          <div className="h-full w-72 lg:w-60 overflow-y-auto px-3 py-4">
            <div className="mb-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Management
            </div>
            <nav className="space-y-1">
              <NavLink to="/admin" end className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                <FiHome /> Overview
              </NavLink>
              <NavLink to="/admin/blogs" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                <FiFileText /> Blogs
              </NavLink>
              <NavLink to="/admin/properties" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                <FiLayers /> Properties
              </NavLink>
              <NavLink to="/admin/features" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                <FiStar /> Features
              </NavLink>
              <NavLink to="/admin/users" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                <FiUsers /> Users
              </NavLink>

              <div className="mt-4 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                System
              </div>
              <NavLink to="/admin/settings" className={navLinkClass} onClick={() => setSidebarOpen(false)}>
                <FiSettings /> Settings
              </NavLink>
              <button
                onClick={handleLogout}
                className="mt-2 w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <FiLogOut /> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Content area (scrolls within the viewport) */}
        <main className="bg-gray-50 w-full min-h-0 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Example widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Blogs", value: "128" },
                { label: "Properties", value: "56" },
                { label: "Enquiries", value: "342" },
                { label: "Users", value: "14" },
              ].map((c, i) => (
                <div key={i} className="bg-pink-200 rounded-xl border shadow-sm p-4">
                  <div className="text-sm text-gray-700">{c.label}</div>
                  <div className="text-2xl font-bold mt-1">{c.value}</div>
                </div>
              ))}
            </div>

            {/* Nested routes */}
            <div className="bg-white rounded-xl border shadow-sm min-h-[40vh]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
