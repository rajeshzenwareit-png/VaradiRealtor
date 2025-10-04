import React from "react";

export default function ExclusiveBanner() {
  return (
    <section className="w-full bg-gray-50 py-6 sm:py-8 lg:py-10 my-4 sm:my-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl shadow-lg overflow-hidden bg-white">
          
          {/* Left: Headline */}
          <div className="flex items-center md:items-start md:justify-start p-4 sm:p-6 lg:p-8">
            <h2 className="text-left font-semibold tracking-tight text-gray-900 leading-tight">
              <span className="block text-[clamp(20px,6vw,48px)]">
                Explore Exclusive
              </span>
              <span className="block text-[clamp(20px,6vw,48px)]">
                Properties Find Your
              </span>
              <span className="block text-[clamp(20px,6vw,48px)]">
                Dream Home Today
              </span>
            </h2>
          </div>

          {/* Right: Description */}
          <div className="flex items-center justify-center md:justify-end p-4 sm:p-6 lg:p-8">
            <p className="max-w-prose text-gray-700 text-[clamp(14px,2.5vw,18px)] leading-relaxed text-justify">
              Discover your dream property in the heart of Tirupati with our trusted
              real-estate services. From premium residential homes to high-value
              commercial spaces, we bring you the best options. Invest smartly in
              Tirupati’s growing real-estate market with us today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
