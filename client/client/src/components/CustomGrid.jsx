// CustomGrid.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FaHome,
  FaBuilding,
  FaMapMarkedAlt,
  FaHandshake,
  FaMoneyBillWave,
  FaUserTie,
} from "react-icons/fa";
import { fetchFeatures } from "../services/api";

const ICONS = {
  FaHome,
  FaBuilding,
  FaMapMarkedAlt,
  FaHandshake,
  FaMoneyBillWave,
  FaUserTie,
};

export default function CustomGrid({
  heroImg = "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1600&q=80",
}) {
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchFeatures({ active: "true", limit: 12 }, { signal: ctrl.signal })
      .then((res) => setFeatures(Array.isArray(res) ? res : []))
      .catch(() => setFeatures([]));
    return () => ctrl.abort();
  }, []);

  return (
    <section className="mt-16 bg-gray-200 py-12  rounded-lg shadow-xl">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-10">
        {/* ===== Top row: 12-col grid -> 6/6 split ===== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Left: heading + button (spans 6 columns on md+) */}
          <div className="md:col-span-6 bg-white rounded-2xl p-8 sm:p-10 shadow-md flex flex-col justify-center  hover:scale-105">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900">
              With Best Price and{"\n"}
              Full Service for Your{"\n"}
              Property Needs
            </h2>

            <p className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed ">
              Transparent guidance, expert agents, and curated listings—so you can buy,
              sell, or invest with confidence.
            </p>

            <div className="mt-6 flex justify-center">
              <a
                href="/aboutsection"
                className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-600  hover:scale-105"
              >
                Meet Our Agents
              </a>
            </div>
          </div>

          {/* Right: image (spans 6 columns on md+) */}
          <div className="md:col-span-6">
            <div className="relative w-full h-full">
              <div className="aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-md  hover:scale-105">
                <img
                  src={heroImg}
                  alt="Our agents help you with full-service property solutions"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Features grid (your original, responsive) ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((item) => {
            const Icon = ICONS[item?.icon] ?? FaHome;
            return (
              <div
                key={item?._id || Math.random()}
                className="flex flex-col items-center bg-white p-6 sm:p-7 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition"
              >
                <Icon className="w-10 h-10 text-sky-500 mb-4" />
                <p className="text-center font-semibold text-gray-800 text-base">
                  {item?.text || "Feature"}
                </p>
                <p className="text-center text-gray-600 text-sm mt-2">
                  {item?.desc || ""}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
