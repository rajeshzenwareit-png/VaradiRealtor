import React from 'react'
import Navbar from './Navbar'
import { useState,useEffect } from 'react';
import ListingsGrid from './ListingsGrid';
import Signup from './Signup';
import Footer from './Footer';
import { fetchProperties } from "../services/api"; // you already have this
import { Link } from "react-router-dom"; // 👈 add this


const BlogSection = ({ limit = 6, params = {} }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");


      useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProperties(params);   // re-using properties API
        if (cancelled) return;
        // Expecting objects with { _id, title, description, images? }
        setPosts(Array.isArray(data) ? data.slice(0, limit) : []);
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [limit, JSON.stringify(params)]);

  return (
           <div>
              <section className="relative h-screen min-h-[100svh]">
                <header id="home" className="relative h-screen min-h-[100svh]">
                  {/* Background Video */}
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
                    <div className="absolute inset-0" />
                  </div>
        
                  {/* Top Navigation */}
                  <nav className="absolute top-5 left-0 right-0 z-20">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between relative">
                      {/* Left: Logo */}
                      <a href="/" className="flex items-center gap-3 xl:ml-[5rem]">
                        <img
                          src="/images/logo.png"
                          alt="Company logo"
                          className="h-12 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-auto object-contain shrink-0"
                          decoding="async"
                        />
                      </a>
        
                      {/* Center: Desktop Menu */}
                      <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-6 font-semibold">
                        <li>
                          <a href="/" className="text-white/90 hover:text-white transition">
                            HOME
                          </a>
                        </li>
                        <li>
                          <a href="/properties" className="text-white/90 hover:text-white transition">
                            PROPERTIES
                          </a>
                        </li>
                        <li>
                          <a href="/blogsection" className="text-white/90 hover:text-white transition">
                            BLOG
                          </a>
                        </li>
                        <li>
                          <a href="/projectsection" className="text-white/90 hover:text-white transition">
                            PROJECTS
                          </a>
                        </li>
                        <li>
                          <a href="/aboutsection" className="text-white/90 hover:text-white transition">
                            ABOUT
                          </a>
                        </li>
                      </ul>
        
                      {/* Right: Contact (Desktop) + Mobile controls */}
                      <div className="flex items-center gap-3">
                        <a
                          href="/contactsection"
                          className="hidden md:inline-flex items-center justify-center px-10 py-3 rounded-full bg-sky-500 text-white font-semibold shadow transition hover:bg-sky-600 xl:mr-[5rem]"
                        >
                          CONTACT
                        </a>
        
                        {/* Mobile: Contact + Hamburger */}
                        <div className="md:hidden flex items-center gap-2">
                          <a
                            href="/contactsection"
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
                          <a href="/" className="block py-2 text-white/90 hover:text-white">
                            HOME
                          </a>
                          <a href="/properties" className="block py-2 text-white/90 hover:text-white">
                            PROPERTIES
                          </a>
                          <a href="/blogsection" className="block py-2 text-white/90 hover:text-white">
                            BLOG
                          </a>
                          <a href="/projectsection" className="block py-2 text-white/90 hover:text-white">
                            PROJECTS
                          </a>
                          <a href="/aboutsection" className="block py-2 text-white/90 hover:text-white">
                            ABOUT
                          </a>
                          <a href="#contact" className="block py-2 text-white/90 hover:text-white">
                            CONTACT
                          </a>
                        </div>
                      </div>
                    )}
                  </nav>
        
                  {/* Hero Content */}
                  <div className="absolute inset-0 z-10 flex items-center">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                      <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 md:p-8 lg:p-10 text-center">
                        {/* Headline */}
                        <h1 className="leading-tight">
                          <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
                            <span className="text-sky-500">BLOGS</span>
                          </span>
                        </h1>
        
                        {/* Spacer before search */}
                        <div className="mt-8 sm:mt-10 md:mt-14 w-full" />
                      </div>
                    </div>
                  </div>
                </header>
              </section>
    
          
        
              <div className="bg-gray-100 px-4 sm:px-6 lg:px-8 py-4 my-6 rounded-lg ">
                 <section className="w-full mx-auto px-4 py-8">
      {/* <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2> */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p._id} className="border rounded-xl p-4 bg-white hover:shadow-md transition">
            {/* Optional cover */}
            {Array.isArray(p.images) && p.images[0] && (
              <img
                src={p.images[0]}
                alt={p.title || "Cover"}
                className="w-full h-40 object-cover rounded-lg mb-3"
                loading="lazy"
              />
            )}

            <h3 className="text-lg font-semibold line-clamp-1">{p.title || "Untitled"}</h3>
            <p className="text-sm text-gray-600 line-clamp-3 mt-1">
              {p.description || "—"}
            </p>

            {/* Link to details if you have a route */}
            <Link 
            to={`/blog/${p._id}`}
            className="mt-3 text-sky-600 hover:underline font-medium flex justify-end p-5">
              Read more →
            </Link>
          </article>
        ))}
      </div>
      </section>
              </div>
              <section>
                {/* <Signup /> */}
              </section>
              <section>
                <Footer />
              </section>
          </div>
  )
}

export default BlogSection