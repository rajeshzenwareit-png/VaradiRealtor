import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <section className="bg-sky-100 py-4 mt-4 mb-4 rounded-xl shadow-xl w-full">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:space-x-10">
          {/* Left Column */}
          <div className="text-center sm:text-left sm:px-4">
            <h2 className="text-2xl font-bold">
              Want to Become a Real Estate Agent?
            </h2>
            <p className="text-xl text-gray-700">
              We'll help you to grow your career and growth.
            </p>
          </div>

          {/* Right Column: Button */}
          <div className="sm:px-4">
           <a
  href="/signupsection"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex rounded-full bg-sky-500 px-6 py-3 text-white font-bold shadow-xl hover:bg-sky-600 active:bg-sky-700 transition"
>
  Sign Up Today
</a>

          </div>
        </div>
      </div>
    </section>
  );
}
