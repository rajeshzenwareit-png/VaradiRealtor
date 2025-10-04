import React from "react";
import { FaFacebook, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 rounded-lg shadow-xl">
      {/* Top: 4 columns */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Logo + About */}
          <div className="space-y-5">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="/" id="home" className="inline-block" aria-label="Go to home">
  <img
    src="https://framerusercontent.com/images/yAcMqxLf1eS96Dxivx1XQXCPN5A.png"
    alt="Real Estate Agency"
    className="h-20 w-20 object-contain rounded-xl ring-1 ring-gray-200/70"
    loading="lazy"
    decoding="async"
  />
</a>

            </div>

            {/* About */}
            <div>
              <h4 className="text-lg font-extrabold tracking-tight mb-3">About</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="font-semibold text-gray-600 hover:text-sky-600 transition-colors">About Us</a></li>
                <li><a href="/" className="font-semibold text-gray-600 hover:text-sky-600 transition-colors">Contact Us</a></li>
                <li><a href="/" className="font-semibold text-gray-600 hover:text-sky-600 transition-colors">Terms &amp; Conditions</a></li>
              </ul>
            </div>
          </div>

          {/* Col 2: News */}
          <div>
            <h4 className="text-lg font-extrabold tracking-tight mb-4">News</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/" className="font-semibold text-gray-600 hover:text-sky-600 transition-colors">Latest News</a></li>
              <li><a href="/" className="font-semibold text-gray-600 hover:text-sky-600 transition-colors">House Architecture</a></li>
              <li><a href="/" className="font-semibold text-gray-600 hover:text-sky-600 transition-colors">House Design</a></li>
              <li><a href="/" className="font-semibold text-gray-600 hover:text-sky-600 transition-colors">Building Materials</a></li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="text-lg font-extrabold tracking-tight mb-1">Contact</h4>

            {/* Location */}
            <div className="flex items-start gap-3 rounded-xl p-3 ">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 shadow-sm">
                <FiMapPin className="h-5 w-5 text-white" />
              </span>
              <p className="text-sm leading-6 font-bold text-gray-700">
                Tirupati, Andhra Pradesh
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 rounded-xl p-3 ">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 shadow-sm">
                <FiPhone className="h-5 w-5 text-white" />
              </span>
              <a
                href="tel:+919876543210"
                className="text-sm leading-6 font-bold text-gray-700 hover:text-sky-600 transition-colors"
              >
                +91 98765 43210
              </a>
            </div>

            {/* Mail */}
            <div className="flex items-start gap-3 rounded-xl p-3 ">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 shadow-sm">
                <FiMail className="h-5 w-5 text-white" />
              </span>
              <a
                href="mailto:Vamseedharsainathuni@gmail.com"
                className="text-sm leading-6 font-bold text-gray-700 hover:text-sky-600 break-all transition-colors"
              >
                Vamseedharsainathuni@gmail.com
              </a>
            </div>
          </div>

          {/* Col 4: Subscribe */}
          <div>
            <h4 className="text-lg font-extrabold tracking-tight mb-4">Subscribe</h4>
            <p className="text-sm text-gray-600 mb-4 font-semibold">
              Enter your email to get notified about our new solutions
            </p>

            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative w-full">
                <input
                  type="email"
                  placeholder="E-Mail"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  required
                />
                <FiMail className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-sky-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-sky-600 active:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 transition"
                aria-label="Subscribe"
              >
                Get In Touch
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom: Copyright + Socials */}
      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-gray-600 font-bold">
              © 2025 Real Estate Agency — All Rights
            </p>

            {/* Socials (brand colors) */}
            <div className="flex items-center gap-3">
              {[
                { Icon: FaFacebook, href: "https://facebook.com/yourpage", color: "#1877F2", label: "Facebook" },
                { Icon: FaInstagram, href: "https://instagram.com/yourhandle", color: "#E4405F", label: "Instagram" },
                { Icon: FaXTwitter, href: "https://x.com/yourhandle", color: "#111111", label: "X (formerly Twitter)" },
                { Icon: FaYoutube, href: "https://youtube.com/@yourchannel", color: "#FF0000", label: "YouTube" },
              ].map(({ Icon, href, color, label }, i) => (
                <a
                  key={i}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 ring-1 ring-gray-200 bg-white hover:scale-105 hover:ring-sky-300 transition"
                  style={{ color }}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            {/* Credits */}
            <p className="text-sm text-gray-500">
              Developed by{" "}
              <a
                href="https://zenwareit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-600 hover:text-sky-700 underline underline-offset-4 decoration-sky-300 hover:decoration-sky-500"
              >
                ZenwareIT Software Solutions LLP
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
