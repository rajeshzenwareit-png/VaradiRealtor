import React, { useState } from "react";
import Signup from "./Signup";
import Footer from "./Footer";
import TirupatiMap from "./TirupatiMap";

export default function SignUpSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks! We’ll get back to you soon.");
  };

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[100svh]">
        <header id="home" className="relative h-screen min-h-[100svh]">
          {/* Background Video */}
          <div className="absolute inset-0 -z-10">
            <video
              className="w-full h-full object-cover shadow-xl"
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
                  href="#contact"
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
                <h1 className="leading-tight">
                  <span className="block text-2xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold">
                    <span className="text-sky-500">
                      Want to Become a Real Estate Agent? We&apos;ll help you to grow your
                      career and growth
                    </span>
                  </span>
                </h1>
                <div className="mt-8 sm:mt-10 md:mt-14 w-full" />
              </div>
            </div>
          </div>
        </header>
      </section>

      {/* INFO BLURB */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-gray-100">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Want to become a real estate agent?
            </h2>
            <p className="mt-4 text-gray-700 leading-7">
              We provide the right platform and guidance to help you start and grow your career
              in the dynamic world of real estate. With expert mentorship, modern tools, and
              proven strategies, you’ll gain the confidence to attract clients, close deals, and
              achieve success. Our training helps you develop essential skills in sales,
              negotiation, and customer service while keeping you updated with the latest market
              trends. You’ll also have the opportunity to grow your professional network and
              unlock unlimited earning potential with our strong support system. Join us today
              and take the first step toward building a rewarding career in real estate.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT FORM (full-width) */}
<section id="contact" className="bg-gray-50">
  <form
    onSubmit={handleSubmit}
    className="w-full"
  >
    {/* Edge-to-edge bar with comfortable horizontal padding */}
    <div className="w-full bg-white px-4 sm:px-6 lg:px-10 py-10 shadow-sm ring-1 ring-gray-100">
      <h2 className="text-2xl font-extrabold tracking-tight">Contact Form</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Smith"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@gmail.com"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
            Location
          </label>
          <select
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          >
            <option value="" disabled>
              Select…
            </option>
            <option value="Tirupati">Tirupati</option>
            <option value="Chittoor">Chittoor</option>
            <option value="Nellore">Nellore</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 90000 70795"
            value={form.phone}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full rounded-full bg-sky-500 px-6 py-3 text-white font-bold shadow-md hover:bg-sky-600 active:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 transition"
        >
          Submit
        </button>
      </div>
    </div>
  </form>
</section>




      {/* MAP (uses TirupatiMap; shows iframe fallback if no API key) */}
      <section className="bg-gray-50">
        <TirupatiMap apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY} height="420px" zoom={12} />
      </section>

      {/* EXTRA SECTIONS */}
      {/* <section>
        <Signup />
      </section> */}

      <section>
        <Footer />
      </section>
    </>
  );
}
