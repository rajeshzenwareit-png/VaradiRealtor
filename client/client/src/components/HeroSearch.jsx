// components/HeroSearch.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiMapPin, FiSearch } from "react-icons/fi";
import { fetchProperties } from '../services/api';

/* ---------- Generic Searchable Dropdown ---------- */
function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  className = "",
  iconLeft = null,
  resetToken,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { setOpen(false); setQuery(""); setHighlight(0); }, [resetToken]);

  useEffect(() => {
    const handler = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const currentLabel = useMemo(() => options.find(o => o.value === value)?.label || "", [value, options]);

  const handleOpen = () => {
    if (disabled) return;
    setOpen(true); setQuery(""); setHighlight(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commit = (opt) => { onChange?.(opt.value); setOpen(false); setQuery(""); };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) { e.preventDefault(); handleOpen(); return; }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlight(h => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); const opt = filtered[highlight] ?? filtered[0]; if (opt) commit(opt); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); setQuery(""); }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : handleOpen())}
        disabled={disabled}
        className={`w-full border rounded-full px-4 pl-11 pr-10 py-3 text-left relative
                    ${disabled ? "bg-gray-100 text-gray-400" : "bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"}`}
      >
        {iconLeft}
        <span className="block truncate">{currentLabel || placeholder}</span>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="relative p-2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
              placeholder="Search…"
              className="w-full border rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <ul role="listbox" className="max-h-56 overflow-auto py-1">
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-gray-500">No matches</li>}
            {filtered.map((opt, idx) => {
              const active = idx === highlight;
              const selected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setHighlight(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(opt)}
                  className={`px-3 py-2 cursor-pointer text-sm rounded-md mx-1
                              ${active ? "bg-sky-50" : ""} ${selected ? "font-semibold" : ""}`}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ---------- Price Dropdown with Ranges ---------- */
function PriceDropdown({ value, onChange }) {
  const [priceRanges, setPriceRanges] = useState([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    async function loadPrices() {
      try {
        const properties = await fetchProperties();
        const prices = properties.map((p) => p.price).filter(Boolean);
        const maxPrice = Math.max(...prices);

        // Define static ranges
        const ranges = [
          { min: 0, max: 300000, label: "0 – 3L" },
          { min: 300000, max: 900000, label: "3L – 9L" },
          { min: 900000, max: 1200000, label: "9L – 12L" },
          { min: 1200000, max: 1500000, label: "12L – 15L" },
          { min: 1500000, max: 1800000, label: "15L – 18L" },
        ];

        // Add last dynamic range if needed
        if (maxPrice > 1800000) {
          ranges.push({
            min: 1800000,
            max: maxPrice,
            label: `18L – ${Math.round(maxPrice / 100000)}L`,
          });
        }

        setPriceRanges(ranges);
      } catch (err) {
        console.error("Failed to fetch prices:", err);
      }
    }
    loadPrices();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query) return priceRanges;
    return priceRanges.filter(r =>
      r.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [priceRanges, query]);

  const currentLabel = value ? value.label : "";

  const commit = (range) => {
    onChange?.(range); // send {min,max,label}
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className="relative w-full md:w-2/5">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => open ? setOpen(false) : (setOpen(true), setTimeout(() => inputRef.current?.focus(), 0))}
        className="w-full border rounded-full px-4 pl-11 pr-10 py-3 text-left relative bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 select-none">₹</span>
        <span className="block truncate">{currentLabel || "Select Price Range"}</span>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="relative p-2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlight(0); }}
              placeholder="Search price range…"
              className="w-full border rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <ul role="listbox" className="max-h-56 overflow-auto py-1">
            {filtered.length === 0 && <li className="px-3 py-2 text-sm text-gray-500">No matches</li>}
            {filtered.map((r, idx) => {
              const active = idx === highlight;
              const selected = r.label === value?.label;
              return (
                <li
                  key={r.label}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setHighlight(idx)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(r)}
                  className={`px-3 py-2 cursor-pointer text-sm rounded-md mx-1
                              ${active ? "bg-sky-50" : ""} ${selected ? "font-semibold" : ""}`}
                >
                  {r.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- Main Form --------------------------------- */
export default function HeroSearch({ onSearching, setResults }) {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(null); // now stores {min,max,label}
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(0);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setOptionsLoading(true);
        const data = await fetchProperties({});
        const list = Array.isArray(data) ? data : [];

        const uniq = (arr) => {
          const seen = new Set();
          const out = [];
          for (const v of arr) {
            const s = String(v ?? "").trim();
            if (!s) continue;
            const key = s.toLowerCase();
            if (!seen.has(key)) { seen.add(key); out.push(s); }
          }
          return out;
        };

        const types = uniq(list.map(p => p.propertyType)).sort((a, b) => a.localeCompare(b));
        const locs  = uniq(list.map(p => p.location)).sort((a, b) => a.localeCompare(b));

        if (!cancelled) {
          setCategoryOptions(types.map(v => ({ value: v, label: v })));
          setLocationOptions(locs.map(v => ({ value: v, label: v })));
        }
      } catch (e) {
        if (!cancelled) {
          setCategoryOptions([]);
          setLocationOptions([]);
        }
        console.error("Failed to load dropdown data:", e);
      } finally {
        if (!cancelled) setOptionsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();

    const q = {};
    if (category) q.type = category;
    if (location) q.location = location;
    if (price?.min !== undefined && price?.max !== undefined) {
      q.pricerange = `${price.min}-${price.max}`;
    }

    try {
      setLoading(true);
      const data = await fetchProperties(q);
      setResults?.(data);
      onSearching?.(q, data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults?.([]);
    } finally {
      setLoading(false);
      setCategory('');
      setLocation('');
      setPrice(null);
      setResetToken(t => t + 1);
    }

    document.getElementById("gridlist")?.scrollIntoView({ behavior: "smooth", block: "start" });
    navigate('/', { state: { q } });
  };

  return (
    <form onSubmit={onSearch} className="flex flex-col md:flex-row gap-3 items-center">
      {/* Category */}
      <SearchableSelect
        options={categoryOptions}
        value={category}
        onChange={setCategory}
        placeholder={optionsLoading ? "Loading categories…" : "Category"}
        className="w-full md:w-2/5"
        resetToken={resetToken}
        disabled={optionsLoading || categoryOptions.length === 0}
        iconLeft={<FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
      />

      {/* Location */}
      <SearchableSelect
        options={locationOptions}
        value={location}
        onChange={setLocation}
        placeholder={optionsLoading ? "Loading locations…" : "Location"}
        className="w-full md:w-2/5"
        resetToken={resetToken}
        disabled={optionsLoading || locationOptions.length === 0}
        iconLeft={<FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
      />

      {/* Price */}
      <PriceDropdown value={price} onChange={setPrice} />

      {/* CTA */}
      <button
        type="submit"
        className="text-white rounded-full px-4 py-3 w-full md:w-2/5 bg-sky-500 hover:bg-sky-600 font-bold disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "SEARCHING..." : "SEARCH NOW"}
      </button>
    </form>
  );
}
