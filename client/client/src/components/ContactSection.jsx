import React from "react";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { useState } from "react";
import Signup from "./Signup";
import Footer from "./Footer";
import TirupatiMap from "./TirupatiMap";
import ContactForm from "./ContactForm";

export default function ContactSection() {

    const [menuOpen, setMenuOpen] = useState(false);
  return (

        <div>
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
                          <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 md:p-8 lg:p-10 text-center">
                            {/* Headline */}
                            <h1 className="leading-tight">
                              <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
                                <span className="text-sky-500">CONTACT US</span>
                              </span>
                            </h1>
            
                            {/* Spacer before search */}
                            <div className="mt-8 sm:mt-10 md:mt-14 w-full" />
                          </div>
                        </div>
                      </div>
                    </header>
                  </section>
                  <section className="relative py-12 sm:py-16 bg-gray-100 rounded-lg mt-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading (optional) */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Contact Us
          </h2>
          <p className="mt-2 text-gray-600">
            We’d love to hear from you. Call, email, or send a message.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
          {/* LEFT: Details */}
          <div className="rounded-2xl bg-white p-5 sm:p-8 lg:p-10 shadow-md border border-gray-100">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Contact Information
            </h3>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed text-justify">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            </p>

            <div className="mt-[2rem] sm:mt-[4rem] space-y-[2rem] sm:space-y-[2.5rem]">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 sm:h-12 sm:w-12 flex-none items-center justify-center rounded-full bg-sky-500 text-white shadow">
                  <FiPhone className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Phone</p>
                  <a
                    href="tel:+919000070795"
                    className="block font-semibold text-gray-800 hover:text-sky-600 break-words"
                  >
                    +91 9000070795
                  </a>
                </div>
              </div>

              {/* Mail */}
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 sm:h-12 sm:w-12 flex-none items-center justify-center rounded-full bg-sky-500 text-white shadow">
                  <FiMail className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Mail</p>
                  <a
                    href="mailto:Vamseedharsainathuni@gmail.com"
                    className="block font-semibold text-gray-800 hover:text-sky-600 break-words"
                  >
                    Vamseedharsainathuni@gmail.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 sm:h-12 sm:w-12 flex-none items-center justify-center rounded-full bg-sky-500 text-white shadow">
                  <FiMapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Address</p>
                  <p className="font-semibold text-gray-800">Tirupati, AP</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="rounded-2xl bg-white p-5 sm:p-8 lg:p-10 shadow-md border border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold text-sky-600 mb-4 sm:mb-6">
              Send us a message
            </h3>

            <div className="w-full max-w-xl mx-auto">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* Bottom spacing for small screens */}
        <div className="mt-6 sm:mt-8" />
      </div>
    </section>
     <section className="mt-6 sm:mt-8" >
        <TirupatiMap/>
      </section>
                  <section>
                    {/* <Signup /> */}
                  </section>
                  <section>
                    <Footer />
                  </section>
                  <section>
                  </section>
        </div>


  );
}
