// src/components/layout/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiGrid, FiHome, FiChevronDown,
  FiFolder, FiPackage, FiStar, FiTool,
  FiUsers, FiTag, FiMessageSquare, FiSliders, FiX, FiFileText
} from "react-icons/fi";

const linkBase = "block px-3 py-2 rounded-lg text-sm transition hover:bg-slate-100";
const active = "bg-sky-100 text-sky-800 font-semibold";

/**
 * Props:
 * - onClose?: () => void            // called by the close button
 * - onNavigate?: () => void         // called when a nav item is clicked
 * - showClose?: "mobile"|"always"|"never"  // visibility of close button (default: "mobile")
 * - className?: string
 */
export default function Sidebar({
  className = "",
  onNavigate = () => {},
  onClose = () => {},
  showClose = "mobile",
}) {
  const { pathname } = useLocation();
  const isInRealEstate = pathname.startsWith("/admin/real-estate/");
  const [realEstateOpen, setRealEstateOpen] = useState(true);

  // Auto-open Real Estate group when inside it
  useEffect(() => {
    if (isInRealEstate) setRealEstateOpen(true);
  }, [isInRealEstate]);

  // Close button visibility classes
  const closeVisibility =
    showClose === "always" ? "" : showClose === "never" ? "hidden" : "md:hidden";

  return (
    <aside className={`w-64 bg-white border-r border-slate-200 ${className}`}>
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200">
        <span className="sr-only">Admin</span>
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className={`${closeVisibility} inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-slate-100 text-slate-600`}
          title="Close sidebar"
          aria-label="Close sidebar"
        >
          <FiX />
        </button>
      </div>

      <nav className="p-3 space-y-1">
        {/* Dashboard */}
        <NavLink
          to="/admin"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? active : "hover:bg-slate-100"}`
          }
        >
          <FiGrid /> <span>Dashboard</span>
        </NavLink>

        {/* Real Estate group */}
        <button
          type="button"
          onClick={() => setRealEstateOpen((v) => !v)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700"
        >
          <FiHome />
          <span className="flex-1 text-left">Real Estate</span>
          <FiChevronDown className={`transition ${realEstateOpen ? "rotate-180" : ""}`} />
        </button>

        {realEstateOpen && (
          <div className="ml-9 space-y-1">
            <NavLink
              to="/admin/real-estate/properties"
              onClick={onNavigate}
              className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
            >
              <span className="inline-flex items-center gap-2">
                <FiFolder /> Properties
              </span>
            </NavLink>

            <NavLink
              to="/admin/real-estate/projects"
              onClick={onNavigate}
              className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
            >
              <span className="inline-flex items-center gap-2">
                <FiPackage /> Projects
              </span>
            </NavLink>

            <NavLink
              to="/admin/real-estate/features"
              onClick={onNavigate}
              className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
            >
              <span className="inline-flex items-center gap-2">
                <FiStar /> Features
              </span>
            </NavLink>

            <NavLink
              to="/admin/real-estate/facilities"
              onClick={onNavigate}
              className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
            >
              <span className="inline-flex items-center gap-2">
                <FiTool /> Facilities
              </span>
            </NavLink>

            <NavLink
              to="/admin/real-estate/investors"
              onClick={onNavigate}
              className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
            >
              <span className="inline-flex items-center gap-2">
                <FiUsers /> Investors
              </span>
            </NavLink>

            <NavLink
              to="/admin/real-estate/categories"
              onClick={onNavigate}
              className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
            >
              <span className="inline-flex items-center gap-2">
                <FiTag /> Categories
              </span>
            </NavLink>

            <NavLink
              to="/admin/real-estate/reviews"
              onClick={onNavigate}
              className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
            >
              <span className="inline-flex items-center gap-2">
                <FiMessageSquare /> Reviews
              </span>
            </NavLink>

            <NavLink
              to="/admin/real-estate/custom-fields"
              onClick={onNavigate}
              className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
            >
              <span className="inline-flex items-center gap-2">
                <FiSliders /> Custom Fields
              </span>
            </NavLink>
          </div>
        )}

        {/* Pages (new) */}
        <NavLink
          to="/admin/pages"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? active : "hover:bg-slate-100"}`
          }
        >
          <FiFileText /> <span>Pages</span>
        </NavLink>
      </nav>
    </aside>
  );
}
