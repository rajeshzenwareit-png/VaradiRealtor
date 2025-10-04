import React from 'react'
import { useState } from 'react';
import ListingsGrid from './ListingsGrid';
import Signup from './Signup';
import Footer from './Footer';
import { Lock, Instagram, FileText } from "lucide-react";

const AboutSection = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div>
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
                      href="#contact"
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
                    <a href="/contactsection" className="block py-2 text-white/90 hover:text-white">
                      CONTACT
                    </a>
                  </div>
                </div>
              )}
            </nav>

            {/* Hero Content */}
            <div className="absolute inset-0 z-10 flex items-center">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl p-0 text-center">
                  {/* Headline */}
                  <h1 className="leading-tight m-0">
                    <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
                      <span className="text-sky-500">ABOUT US</span>
                    </span>
                  </h1>
                  {/* spacer removed */}
                </div>
              </div>
            </div>
          </header>
        </section>

        <div className="bg-gray-200 px-4 sm:px-6 lg:px-8 py-4 mt-0 rounded-lg">
          <section id="about" className="w-full py-12 sm:py-16 lg:py-20 bg-white rounded-lg">
            <div className="w-full px-4 sm:px-6 lg:px-8 mb-0">
              {/* Grid */}
              <section id="about" className="w-full py-12 sm:py-16 lg:py-20 bg-white mt-0">
                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xl mt-0">
                  {/* 01 - Text */}
                  <div className="p-8 bg-gray-100 rounded-lg shadow text-justify">
                    <h3 className="text-2xl font-bold mb-4">Our Story</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Every great journey begins with a single step. What started as a small idea
                      has grown into something bigger than we ever imagined. Through dedication,
                      teamwork, and the belief that anything is possible, we’ve built a space
                      where creativity thrives and innovation leads the way.
                    </p>
                  </div>

                  {/* 02 - Image */}
                  <div className="flex items-center justify-center bg-gray-50 rounded-lg shadow p-4 h-72 w-full transform transition-transform duration-300 hover:scale-105">
                    <img
                      src="/images/eight.jpg"
                      alt="Our Story"
                      className="rounded-md object-cover h-full w-full"
                    />
                  </div>

                  {/* 03 - Image */}
                  <div className="flex items-center justify-center bg-gray-50 rounded-lg shadow p-4 h-72 w-full transform transition-transform duration-300 hover:scale-105">
                    <img
                      src="/images/two.jpg"
                      alt="Apartments"
                      className="rounded-md object-cover h-full w-full"
                    />
                  </div>

                  {/* 04 - Text */}
                  <div className="p-8 bg-gray-100 rounded-lg shadow text-justify">
                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Our mission is to simplify the real estate journey for our clients.
                      By combining market insights, modern tools, and personal guidance, we
                      ensure that every decision you make is backed by clarity and
                      confidence. We believe finding a home is more than a transaction—it’s
                      a life-changing experience.
                    </p>
                  </div>

                  {/* 05 - Text */}
                  <div className="p-8 bg-gray-100 rounded-lg shadow text-justify">
                    <h3 className="text-2xl font-bold mb-4">Why Choose Us</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Choosing the right real estate partner can make all the difference.
                      With years of experience, a client-first approach, and access to
                      exclusive listings, we go above and beyond to match you with
                      properties that align with your goals and dreams.
                    </p>
                  </div>

                  {/* 06 - Image */}
                  <div className="flex items-center justify-center bg-gray-50 rounded-lg shadow p-4 h-72 w-full transform transition-transform duration-300 hover:scale-105">
                    <img
                      src="/images/three.jpg"
                      alt="Real Estate"
                      className="rounded-md object-cover h-full w-full"
                    />
                  </div>
                </div>
              </section>

              <section className="w-full py-12 bg-gray-200 rounded-lg">
                <div className="text-center mb-10 px-4">
                  <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">
                    Our Mission & Work Process
                  </h2>
                  <p className="mt-3 text-lg text-gray-600">
                    Professional & Dedicated Team
                  </p>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                  {/* Left Side: Image */}
                  <div className="flex justify-center transition-transform duration-300 hover:scale-105">
                    <img
                      src="/images/six.jpg"
                      alt="About Us Illustration"
                      className="rounded-lg shadow-lg w-full h-[450px] object-cover"
                    />
                  </div>

                  {/* Right Side: Cards */}
                  <aside className="space-y-6">
                    {/* Card 1 */}
                    <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition hover:scale-105">
                      <div className="p-3 bg-sky-100 rounded-full mt-2 sm:mt-3 lg:mt-4">
                        <Lock className="text-sky-500 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Fully Secure & 24x7 Dedicated Support
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                          If you are an individual client, or just a business startup
                          looking for good backlinks for your website.
                        </p>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition hover:scale-105">
                      <div className="p-3 bg-sky-100 rounded-full mt-2 sm:mt-3 lg:mt-4">
                        <Instagram className="text-pink-500 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Manage your Social & Business Account Carefully
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                          If you are an individual client, or just a business startup
                          looking for good backlinks for your website.
                        </p>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition hover:scale-105">
                      <div className="p-3 bg-sky-100 rounded-full mt-2 sm:mt-3 lg:mt-4">
                        <FileText className="text-green-500 w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          We are Very Hard Worker and Loving
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                          If you are an individual client, or just a business startup
                          looking for good backlinks for your website.
                        </p>
                      </div>
                    </div>
                  </aside>
                </div>
              </section>
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
    </div>
  )
}

export default AboutSection
