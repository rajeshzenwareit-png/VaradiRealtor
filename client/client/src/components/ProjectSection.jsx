import React, { useState, useEffect, useMemo } from "react";
import Footer from "./Footer";
import { fetchProperties } from "../services/api";
import { Link } from "react-router-dom";

const USE_SERVER_FILTERS = false; // set to true if your API supports country/state/city/propertyType

const ProjectSection = ({ limit = 9 }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [allProps, setAllProps] = useState([]);

  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState(""); // maps to propertyType

  const norm = (v) => (typeof v === "string" ? v.trim().toLowerCase() : "");
  const getCountry = (p) => p.country || "";
  const getState = (p) => p.stateName || "";
  const getCity = (p) => p.city || "";
  const getCat = (p) => p.propertyType || "";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProperties({});
        if (cancelled) return;
        const arr = Array.isArray(data) ? data : [];
        setAllProps(arr);
        setPosts(arr.slice(0, limit));
        setErr("");
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [limit]);

  const countryOptions = useMemo(() => Array.from(new Set(allProps.map(getCountry).filter(Boolean))).sort(), [allProps]);
  const stateOptions = useMemo(() => {
    const pool = country ? allProps.filter((p) => getCountry(p) === country) : allProps;
    return Array.from(new Set(pool.map(getState).filter(Boolean))).sort();
  }, [allProps, country]);
  const cityOptions = useMemo(() => {
    const pool = allProps.filter((p) => {
      const okCountry = country ? getCountry(p) === country : true;
      const okState = stateName ? getState(p) === stateName : true;
      return okCountry && okState;
    });
    return Array.from(new Set(pool.map(getCity).filter(Boolean))).sort();
  }, [allProps, country, stateName]);
  const categoryOptions = useMemo(() => {
    const pool = allProps.filter((p) => {
      const okCountry = country ? getCountry(p) === country : true;
      const okState = stateName ? getState(p) === stateName : true;
      const okCity = city ? getCity(p) === city : true;
      return okCountry && okState && okCity;
    });
    return Array.from(new Set(pool.map(getCat).filter(Boolean))).sort();
  }, [allProps, country, stateName, city]);

  useEffect(() => { setStateName(""); setCity(""); }, [country]);
  useEffect(() => { setCity(""); }, [stateName]);

  const buildParams = () => {
    const obj = {};
    if (country) obj.country = country;
    if (stateName) obj.stateName = stateName;
    if (city) obj.city = city;
    if (category) obj.propertyType = category;
    return obj;
  };

  const clientFilter = () => {
    const c = norm(country);
    const s = norm(stateName);
    const ci = norm(city);
    const cat = norm(category);

    return allProps.filter((p) => {
      const okCountry = c ? norm(getCountry(p)) === c : true;
      const okState = s ? norm(getState(p)) === s : true;
      const okCity = ci ? norm(getCity(p)) === ci : true;
      const okCat = cat ? norm(getCat(p)) === cat : true;
      return okCountry && okState && okCity && okCat;
    });
  };

  const onSearch = async () => {
    if (!USE_SERVER_FILTERS) {
      const filtered = clientFilter();
      setPosts(filtered.slice(0, limit));
      return;
    }
    try {
      setLoading(true);
      const params = buildParams();
      const data = await fetchProperties(params);
      const arr = Array.isArray(data) ? data : [];
      setPosts(arr.slice(0, limit));
      setErr("");
    } catch (e) {
      setErr(e?.message || "Failed to load");
    } finally { setLoading(false); }
  };

  const onClear = () => {
    setCountry(""); setStateName(""); setCity(""); setCategory("");
    setPosts(allProps.slice(0, limit));
  };

  return (
    <div>
      {/* ---------- Header / Nav ---------- */}
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
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <nav className="absolute top-5 left-0 right-0 z-20">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative">
            {/* LOGO */}
            <a href="/" className="flex items-center gap-3 xl:ml-[5rem]">
              <img
                src="/images/logo.png"
                alt="Company logo"
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto object-contain shrink-0"
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
              <span className="text-sky-500">PROJECTS</span>
            </h1>
          </div>
        </div>
      </header>

      {/* ---------- Filter Bar ---------- */}
      <div className="mt-6">
        <section className="relative rounded-2xl overflow-hidden ring-1 ring-sky-100 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-sky-100" aria-hidden />
          <div className="relative px-4 py-6 sm:px-8 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="flex flex-col">
                <select value={country} onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white/90 py-3 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500 transition">
                  <option value="">All Countries</option>
                  {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <select value={stateName} onChange={(e) => setStateName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white/90 py-3 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500 transition"
                  disabled={stateOptions.length === 0}>
                  <option value="">All States</option>
                  {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <select value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white/90 py-3 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500 transition"
                  disabled={cityOptions.length === 0}>
                  <option value="">All Cities</option>
                  {cityOptions.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white/90 py-3 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500 transition"
                  disabled={categoryOptions.length === 0}>
                  <option value="">All Categories</option>
                  {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="flex items-end gap-3">
                <button type="button" onClick={onSearch}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-sky-600 text-white text-sm font-semibold shadow hover:bg-sky-700 transition">
                  Search
                </button>
                <button type="button" onClick={onClear}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white text-gray-700 border border-gray-300 text-sm font-semibold shadow hover:bg-gray-50 transition">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ---------- Projects Grid ---------- */}
      <div className="bg-gray-100 px-4 sm:px-6 lg:px-8 py-4 my-6 rounded-lg">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : err ? (
          <p className="text-center text-red-500">{err}</p>
        ) : posts.length === 0 ? (
          <p className="text-center py-10">No projects found.</p>
        ) : (
          <section className="w-full mx-auto px-4 py-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(p => (
                <article key={p._id} className="border rounded-xl p-4 bg-white hover:shadow-md transition">
                  {Array.isArray(p.images) && p.images[0] && (
                    <div className="relative">
                      <img src={p.images[0]} alt={p.title || "Cover"} className="w-full h-40 object-cover rounded-lg mb-3" loading="lazy"/>
                      {p.propertyType && (
                        <span className="absolute top-2 left-2 bg-sky-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
                          {p.propertyType}
                        </span>
                      )}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold line-clamp-1">{p.title || "Untitled"}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mt-1">{p.description || "—"}</p>
                  <Link to={`/project/${p._id}`} className="mt-3 text-sky-600 hover:underline font-medium flex justify-end p-5">
                    More Info →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ---------- Footer ---------- */}
      <Footer />
    </div>
  );
};

export default ProjectSection;
