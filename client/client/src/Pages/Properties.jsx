import React, { useState, useEffect } from 'react';
import ListingsGrid from '../components/ListingsGrid';
import Footer from '../components/Footer';
import { FiSearch } from "react-icons/fi";
import { fetchProperties } from '../services/api';

export default function Properties() {
  const [menuOpen, setMenuOpen] = useState(false);

  // FILTER STATE
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState([]);
  const [type, setType] = useState('all'); // 'all' | 'sale' | 'rent'
  const [sort, setSort] = useState('latest');
  const [filters, setFilters] = useState({});

  // Fetch unique locations
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchProperties({});
        if (Array.isArray(data)) {
          const uniqueLocations = [...new Set(data.map(p => p.location).filter(Boolean))];
          setLocations(uniqueLocations);
        }
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    loadLocations();
  }, []);

  // Apply filters automatically on type or sort change
  useEffect(() => {
    const typeFilter = type !== 'all' ? { category_type: type } : {};
    const sortFilter = sort ? { sort } : {};
    setFilters({ ...typeFilter, ...sortFilter });
  }, [type, sort]);

  // Search button: filter only by location
  const handleSearch = () => {
    const locationFilter = location ? { location } : {};
    setFilters((prev) => ({ ...prev, ...locationFilter }));
  };

  return (
    <div>
      {/* VIDEO HEADER + NAVBAR */}
      <header className="relative h-screen min-h-[100svh]">
        <div className="absolute inset-0 -z-10">
          <video
            className="w-full h-full object-cover shadow-xl rounded-b-lg"
            autoPlay
            loop
            muted
            playsInline
            poster="/images/hero-fallback.jpg"
          >
            <source src="/videos/properties.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/30" /> {/* optional overlay */}
        </div>

        <nav className="absolute top-5 left-0 right-0 z-20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative">
            {/* LOGO */}
            <a href="/" className="flex items-center gap-3 xl:ml-[5rem]">
              <img
                src="/images/logo.png"
                alt="Company logo"
                className="h-12 sm:h-12 md:h-16 lg:h-20 w-auto object-contain shrink-0"
              />
            </a>

            <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-6 font-semibold">
              <li><a href="/" className="text-white/90 hover:text-white transition">HOME</a></li>
              <li><a href="/properties" className="text-white/90 hover:text-white transition">PROPERTIES</a></li>
              <li><a href="/blogsection" className="text-white/90 hover:text-white transition">BLOG</a></li>
              <li><a href="/projectsection" className="text-white/90 hover:text-white transition">PROJECTS</a></li>
              <li><a href="/aboutsection" className="text-white/90 hover:text-white transition">ABOUT</a></li>
            </ul>

            <div className="flex items-center gap-3">
              <a
                href="/contactsection"
                className="hidden md:inline-flex items-center justify-center px-10 py-3 rounded-full bg-sky-500 text-white font-semibold shadow transition xl:mr-[5rem] hover:bg-sky-600"
              >
                CONTACT
              </a>

              <div className="md:hidden flex items-center gap-2">
                <a href="/contactsection" className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium shadow transition">
                  Contact
                </a>
                <button
                  aria-label="Open menu"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-2 rounded-md text-white/90 hover:text-white hover:bg-blue/10 transition"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden w-full px-4 sm:px-6 lg:px-8 pb-4">
              <div className="rounded-lg bg-sky-600 backdrop-blur border border-white/10 p-4 space-y-2 font-semibold">
                <a href="/" className="block py-2 text-white/90 hover:text-white">HOME</a>
                <a href="/properties" className="block py-2 text-white/90 hover:text-white">PROPERTIES</a>
                <a href="/blogsection" className="block py-2 text-white/90 hover:text-white">BLOG</a>
                <a href="/projectsection" className="block py-2 text-white/90 hover:text-white">PROJECTS</a>
                <a href="/aboutsection" className="block py-2 text-white/90 hover:text-white">ABOUT</a>
                <a href="/contactsection" className="block py-2 text-white/90 hover:text-white">CONTACT</a>
              </div>
            </div>
          )}
        </nav>

        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white">
              <span className="text-sky-500">PROPERTIES</span>
            </h1>
          </div>
        </div>
      </header>

      {/* FILTER BAR */}
      <section>
        <div className="bg-sky-100 px-4 sm:px-6 lg:px-8 py-6 my-6 rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Type Radio Buttons */}
            <div className="flex items-center gap-4">
              {['all', 'sale', 'rent'].map((t) => (
                <label key={t} className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={type === t}
                    onChange={() => setType(t)}
                    className="peer hidden"
                  />
                  <span className="px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-medium shadow-sm peer-checked:bg-sky-500 peer-checked:text-white peer-checked:border-sky-500 transition capitalize">
                    {t === 'all' ? 'All' : t}
                  </span>
                </label>
              ))}
            </div>

            {/* Location Dropdown */}
            <div className="flex-1 w-full sm:max-w-md">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white/90 py-3 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500 transition"
              >
                <option value="">All Locations</option>
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center justify-center px-6 py-3 rounded-lg bg-sky-500 text-white font-semibold shadow-md hover:bg-sky-600 transition"
            >
              <FiSearch className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* SORT Dropdown */}
      <div className="bg-gray-100 px-4 sm:px-6 lg:px-8 py-4 my-6 rounded-lg flex items-center justify-between">
        <p className="text-sm sm:text-base font-medium text-gray-700">Sort By</p>
        <select
          id="sort"
          name="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="block w-full sm:w-auto border border-gray-300 rounded-md bg-white py-2 px-3 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
          <option value="a-z">A → Z</option>
          <option value="z-a">Z → A</option>
        </select>
      </div>

      {/* LISTINGS GRID */}
      <ListingsGrid filters={filters} />

      <Footer />
    </div>
  );
}
