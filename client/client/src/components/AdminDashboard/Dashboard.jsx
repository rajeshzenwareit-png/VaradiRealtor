// src/components/AdminDashboard/Dashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiBell,
  FiLogOut,
  FiGrid,          // Dashboard
  FiHome,          // Real Estate
  FiFileText,      // Pages
  FiBookOpen,      // Blog
  FiMessageSquare, // Testimonials
  FiUserCheck,     // Consults
  FiUser,          // Accounts
  FiMail,          // Contact
  FiSliders,       // Simple Sliders
  FiSend,          // News Letters
  FiMapPin,        // Locations
  FiImage,         // Media
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";

function navLinkBase({ isActive }) {
  return `
    flex items-center gap-3 px-3 py-2 rounded-lg transition
    ${isActive ? "bg-sky-100 text-sky-800 font-semibold" : "hover:bg-gray-100 text-gray-700"}
  `;
}

export default function Dashboard() {
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);           // mobile drawer
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse
  const [openSections, setOpenSections] = useState({});            // expanded: { [label]: bool }
  const [activeFlyout, setActiveFlyout] = useState(null);          // collapsed: label | null

  // Refs + router
  const sidebarRef = useRef(null);
  const firstLinkRef = useRef(null);
  const nav = useNavigate();
  const location = useLocation();

  const handleLogout = () => nav("/login");

  // -------- NAV ITEMS --------
  const navItems = [
    { to: "/admin", end: true, label: "Dashboard", Icon: FiGrid },
    {
      to: "/admin/real-estate",
      label: "Real Estate",
      Icon: FiHome,
      children: [
        { to: "/admin/Adminproperties",    label: "Properties" },
        { to: "/admin/Adminprojects",      label: "Projects" },
        { to: "/admin/Adminfeatures",      label: "Features" },
        { to: "/admin/Adminfacilities",    label: "Facilities" },
        { to: "/admin/Admininvestors",     label: "Investors" },
        { to: "/admin/categories",    label: "Categories" },
        { to: "/admin/reviews",       label: "Reviews" },
        { to: "/admin/custom-fields", label: "Custom Fields" },
      ],
    },
    { to: "/admin/pages", label: "Pages", Icon: FiFileText },
    { to: "/admin/blogs", label: "Blog", Icon: FiBookOpen },
    { to: "/admin/testimonials", label: "Testimonials", Icon: FiMessageSquare },
    { to: "/admin/consults", label: "Consults", Icon: FiUserCheck },
    { to: "/admin/accounts", label: "Accounts", Icon: FiUser },
    { to: "/admin/contact", label: "Contact", Icon: FiMail },
    { to: "/admin/sliders", label: "Simple Sliders", Icon: FiSliders },
    { to: "/admin/newsletters", label: "News Letters", Icon: FiSend },
    { to: "/admin/locations", label: "Locations", Icon: FiMapPin },
    { to: "/admin/media", label: "Media", Icon: FiImage },
  ];

  // -------- HELPERS --------
  const isParentActive = (parentTo) =>
    location.pathname === parentTo || location.pathname.startsWith(parentTo + "/");

  const toggleSection = (label) =>
    setOpenSections((s) => ({ ...s, [label]: !s[label] }));

  // Close mobile drawer on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setActiveFlyout(null);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Focus first link when opening mobile drawer
  useEffect(() => {
    if (sidebarOpen) setTimeout(() => firstLinkRef.current?.focus(), 0);
  }, [sidebarOpen]);

  // Outside click closes flyout (collapsed mode)
  useEffect(() => {
    function onDocClick(e) {
      if (
        e.target.closest(".sidebar-parent") ||
        e.target.closest(".sidebar-flyout")
      ) return;
      setActiveFlyout(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="w-screen h-[100svh] flex flex-col bg-sky-200 overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 inset-x-0 z-40 bg-sky-200 border-b h-16 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Mobile sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-sky-300/60"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              aria-expanded={sidebarOpen}
              aria-controls="admin-sidebar"
            >
              {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>

            {/* Brand */}
            <a href="/admin" className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-sky-600 text-white font-bold">
                A
              </span>
              <span className="text-lg font-bold tracking-tight">Admin</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {/* Search (hidden on xs) */}
            <label className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border bg-white">
              <FiSearch className="text-gray-400" />
              <input
                placeholder="Search…"
                className="outline-none text-sm w-40 bg-transparent"
                aria-label="Search"
              />
            </label>

            <button
              className="h-10 w-10 rounded-md hover:bg-sky-300/60 flex items-center justify-center"
              aria-label="Notifications"
              title="Notifications"
            >
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

      {/* Shell */}
      <div
        className={`
          w-full flex-1 min-h-0 grid grid-cols-1
          lg:grid-cols-[auto_1fr]
        `}
      >
        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <button
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            tabIndex={-1}
          />
        )}

        {/* Sidebar */}
        <aside
          id="admin-sidebar"
          ref={sidebarRef}
          className={`
            fixed z-40 top-16 bottom-0 left-0
            w-72 ${sidebarCollapsed ? "lg:w-[64px]" : "lg:w-[240px]"}
            lg:static lg:translate-x-0
            transition-[transform,width] duration-200 ease-in-out will-change-transform
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            bg-white border-r lg:border-r-0
            flex flex-col
          `}
          aria-label="Sidebar"
        >
          {/* Collapse toggle (desktop only) */}
          <div className="hidden lg:flex items-center justify-end px-2 py-2 border-b">
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 text-gray-700"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand" : "Collapse"}
            >
              {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
              <span className={`text-sm ${sidebarCollapsed ? "lg:hidden" : "hidden lg:inline"}`}>
                Collapse
              </span>
            </button>
          </div>

          <div className="h-full overflow-y-auto px-3 py-3">
            {!sidebarCollapsed && (
              <div className="mb-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Navigation
              </div>
            )}

            <nav className="space-y-1">
              {navItems.map(({ to, end, label, Icon, children }, idx) => {
                // ----- COLLAPSED: use CLICK flyout -----
                if (children && sidebarCollapsed) {
                  const parentActive = isParentActive(to);
                  const openedFlyout = activeFlyout === label;

                  return (
                    <div key={label} className="relative">
                      <button
                        onClick={() => setActiveFlyout(openedFlyout ? null : label)}
                        title={label}
                        aria-expanded={openedFlyout}
                        aria-controls={`flyout-${label}`}
                        className={`${navLinkBase({ isActive: parentActive })} lg:justify-center w-full sidebar-parent`}
                      >
                        <Icon className="shrink-0" />
                      </button>

                      {openedFlyout && (
                        <div
                          id={`flyout-${label}`}
                          className="sidebar-flyout absolute left-[72px] top-0 z-50 min-w-52 rounded-xl border bg-white p-2 text-sm shadow-xl"
                        >
                          <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {label}
                          </div>
                          {children.map((c) => (
                            <NavLink
                              key={c.to}
                              to={c.to}
                              className={({ isActive }) =>
                                `flex items-center gap-2 rounded-lg px-3 py-2 ${
                                  isActive ? "bg-sky-100 text-sky-800 font-semibold" : "hover:bg-gray-100 text-gray-700"
                                }`
                              }
                              onClick={() => {
                                setActiveFlyout(null);
                                setSidebarOpen(false);
                              }}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                              {c.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // ----- EXPANDED: clickable parent toggles children -----
                if (children && !sidebarCollapsed) {
                  const parentActive = isParentActive(to);
                  const opened = openSections[label] ?? parentActive;

                  return (
                    <div key={label} className="w-full">
                      <button
                        onClick={() => toggleSection(label)}
                        aria-expanded={opened}
                        aria-controls={`section-${label}`}
                        className={`${navLinkBase({ isActive: parentActive })} w-full`}
                        title={label}
                      >
                        <Icon className="shrink-0" />
                        <span className="inline">{label}</span>
                        <FiChevronDown className={`ml-auto transition ${opened ? "rotate-180" : ""}`} />
                      </button>

                      <div id={`section-${label}`} className={`${opened ? "block" : "hidden"} pl-9`}>
                        {children.map((c) => (
                          <NavLink
                            key={c.to}
                            to={c.to}
                            className={({ isActive }) =>
                              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                                isActive ? "bg-sky-50 text-sky-800 font-semibold" : "hover:bg-gray-100 text-gray-700"
                              }`
                            }
                            onClick={() => setSidebarOpen(false)}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                            {c.label}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  );
                }

                // ----- SINGLE LINK -----
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `${navLinkBase({ isActive })} ${sidebarCollapsed ? "lg:justify-center" : ""}`
                    }
                    onClick={() => setSidebarOpen(false)}
                    ref={idx === 0 ? firstLinkRef : undefined}
                    title={sidebarCollapsed ? label : undefined}
                  >
                    <Icon className="shrink-0" />
                    <span className={`inline ${sidebarCollapsed ? "lg:hidden" : "lg:inline"}`}>{label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content area */}
        <main className="bg-gray-50 w-full min-h-0 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Example widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Active Properties", value: "7" },
                { label: "Pending Properties", value: "2" },
                { label: "Expired Properites", value: "3" },
                { label: "Agents", value: "6" },
              ].map((c) => (
                <div key={c.label} className="bg-pink-200 rounded-xl border shadow-sm p-4">
                  <div className="text-sm text-gray-700">{c.label}</div>
                  <div className="text-2xl font-bold mt-1">{c.value}</div>
                </div>
              ))}
            </div>

            {/* Nested routes render here */}
            <div className="bg-white rounded-xl border shadow-sm min-h-[40vh]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
