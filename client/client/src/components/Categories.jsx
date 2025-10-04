// components/Categories.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaHome,
  FaBuilding,
  FaLeaf,
  FaBriefcase,
  FaHotel,
  FaWarehouse,
  FaStore,
  FaCity,
} from "react-icons/fa";
import { fetchCategories } from "../services/api";

// Fallback icons by category name (case-insensitive)
const ICON_BY_NAME = {
  house: FaHome,
  apartments: FaBuilding,
  apartment: FaBuilding,
  environment: FaLeaf,
  "office spaces": FaBriefcase,
  office: FaBriefcase,
  villas: FaHotel,
  villa: FaHotel,
  studios: FaWarehouse,
  studio: FaWarehouse,
  commercial: FaCity,
  retail: FaStore,
};

// Local fallback data (used while loading / if API returns nothing)
const LOCAL_FALLBACK = [
  { name: "House", colorClass: "text-blue-600" },
  { name: "Apartments", colorClass: "text-green-600" },
  { name: "Environment", colorClass: "text-emerald-500" },
  { name: "Office Spaces", colorClass: "text-purple-600" },
  { name: "Villas", colorClass: "text-pink-600" },
  { name: "Studios", colorClass: "text-orange-600" },
  { name: "Commercial", colorClass: "text-indigo-600" },
  { name: "Retail", colorClass: "text-red-600" },
];

export default function Categories() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  console.log(items)

  // Fetch categories from API
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchCategories(); // expects { data: [...] }
        const rows = Array.isArray(res?.data) ? res.data : [];

        // Normalize minimal shape we use: {name, colorClass}
        const normalized = rows.map((r) => ({
          name: r?.name || "",
          colorClass: r?.colorClass || "",
        }));

        if (alive) setItems(normalized.length ? normalized : LOCAL_FALLBACK);
      } catch (e) {
        if (alive) {
          setErr(e?.message || "Failed to load categories");
          setItems(LOCAL_FALLBACK);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Build UI objects with resolved icon components
  const cats = useMemo(() => {
    return (items || []).map((c) => {
      const key = String(c?.name || "").trim().toLowerCase();
      const Icon = ICON_BY_NAME[key] || FaHome; // default icon
      const color = c?.colorClass || "text-slate-700";
      return {
        name: c?.name || "Category",
        iconEl: <Icon className={`${color} text-4xl mx-auto mb-3`} />,
      };
    });
  }, [items]);

  // Duplicate the array so the loop looks seamless (50% width shift)
  const loopCats = useMemo(() => [...cats, ...cats], [cats]);

  return (
    <section className="p-10 mt-16 overflow-hidden bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-6 text-center">
        Explore Our Property Categories
      </h2>

      {/* Error banner (non-blocking) */}
      {err && (
        <div className="mx-auto mb-4 max-w-xl rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          {err}
        </div>
      )}

      {/* Loading shimmer */}
      {loading ? (
        <div className="flex gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[170px] max-w-[190px] h-[250px] flex-shrink-0 p-6 border rounded-xl bg-white shadow-lg animate-pulse"
            >
              <div className="h-10 w-10 mx-auto mb-3 rounded-full bg-slate-200" />
              <div className="h-4 w-2/3 mx-auto rounded bg-slate-200" />
              <div className="h-3 w-3/4 mx-auto mt-2 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 22,
            ease: "linear",
          }}
        >
          {loopCats.map((c, idx) => (
            <div
              key={`${c.name}-${idx}`}
              className="min-w-[170px] max-w-[190px] h-[250px] flex-shrink-0 p-6 border rounded-xl bg-white shadow-lg hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 text-center flex flex-col justify-center"
            >
              {c.iconEl}
              <h3 className="font-semibold text-lg">{c.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Find your perfect {c.name}
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
