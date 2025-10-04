import React, { useState } from 'react';
import HeroSearch from './HeroSearch';

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
          <source src="/videos/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" />
      </div>

      {/* Top Navigation */}
      <nav className="absolute top-5 left-0 right-0 z-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between relative">
          {/* Left: Logo */}
          <a href="/" className="flex items-center gap-3 xl:ml-[5rem]">
            <img
  src="/images/logo.png"
  alt="Company logo"
  className="h-12 sm:h-12 md:h-16 lg:h-18 xl:h-22 w-auto object-contain shrink-0"
  decoding="async"
/>

          </a>

          {/* Center: Desktop Menu */}
          <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-6 font-semibold">
            <li><a href="/" className="text-white/90 transition hover:text-white hover:border-b-2 hover:border-sky-500">HOME</a></li>
            <li><a href="/properties" className="text-white/90 hover:text-white transition hover:border-b-2 hover:border-sky-500">PROPERTIES</a></li>
            <li><a href="/blogsection" className="text-white/90 hover:text-white transition hover:border-b-2 hover:border-sky-500">BLOG</a></li>
            <li><a href="/projectsection" className="text-white/90 hover:text-white transition hover:border-b-2 hover:border-sky-500">PROJECTS</a></li>
            <li><a href="/aboutsection" className="text-white/90 hover:text-white transition hover:border-b-2 hover:border-sky-500">ABOUT</a></li>
          </ul>

          {/* Right: Contact (Desktop) + Mobile controls */}
          <div className="flex items-center gap-3">
            <a
              href="/contactsection"
              className="hidden md:inline-flex items-center justify-center px-10 py-3 rounded-full  bg-sky-500/100 text-white font-semibold shadow transition xl:mr-[5rem] hover:bg-sky-600"
            >
              CONTACT
            </a>

            {/* Mobile: Contact + Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <a
                href="/contactsection"
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-sky-500/100 hover:bg-sky-600 text-white text-sm font-medium shadow transition"
              >
                Contact
              </a>
              <button
                aria-label="Open menu"
                onClick={() => setMenuOpen(v => !v)}
                className="p-2 rounded-md text-white/90 hover:text-white hover:bg-blue/10 transition"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
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

      {/* Hero Content */}
      <div className="absolute inset-0 z-10 flex items-center top-12 mt-5">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full p-3 sm:p-6 md:p-8 lg:p-10 shadow-lg rounded-none md:rounded-xl text-center">
            {/* Headline */}
            <h1 className="leading-tight">
              <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
                <span className="text-sky-500/100">Find</span>{' '}
                <span className="text-white drop-shadow">Your</span>
              </span>
              <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
                <span className="text-white drop-shadow">Dream Home</span>{' '}
                <span className="text-black">Today</span>
              </span>
            </h1>

            {/* Subheadline */}
            <div className="mt-5 sm:mt-8">
              <p className="text-sm sm:text-lg md:text-xl leading-relaxed text-center text-white font-medium">
                <span className="block">Explore Exceptional Properties and Effortless Home-Buying</span>
                <span className="block">Experiences Tailored Just for You.</span>
              </p>
            </div>

            {/* Search */}
            <div className="mt-5 sm:mt-12 md:mt-16 w-full">
              <HeroSearch />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
