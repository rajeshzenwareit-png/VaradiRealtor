import React, { useEffect, useMemo, useState } from "react";
import { FiShare2, FiDownload, FiMapPin } from "react-icons/fi";
import { HiCheckCircle } from "react-icons/hi";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Footer from "./Footer";
import { postEnquiry } from "../services/api";

export default function ListingCard({ property = {} }) {
  const [open, setOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

   const videoUrl = (property.videoUrl || "").trim();
  const ytId = getYouTubeId(videoUrl);
  const isYouTube = !!ytId;


  function getYouTubeId(url = "") {
  const m = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}


  // Poster: posterUrl > first image > placeholder (used for non-YouTube videos)
  // const poster = useMemo(() => {
  //   if (property.posterUrl && property.posterUrl.trim()) return property.posterUrl.trim();
  //   if (Array.isArray(property.images) && property.images[0]) return property.images[0];
  //   return "/assets/placeholder-1200x800.jpg";
  // }, [property.posterUrl, property.images]);



  // Images
  const images = useMemo(() => {
    const arr = Array.isArray(property?.images) ? property.images : [];
    return arr.length ? arr : ["/assets/placeholder-1200x800.jpg"];
  }, [property?.images]);
  const cover = images[activeImageIdx];


  // Location options
  const locationOptions = useMemo(() => {
    const opts = property?.locationOptions;
    return Array.isArray(opts) && opts.length
      ? opts
      : ["Tirupati", "Bengaluru", "Chennai", "Hyderabad", "Other"];
  }, [property?.locationOptions]);

  // Close modal on ESC + lock scroll
  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && setOpen(false);
    if (open) {
      window.addEventListener("keydown", onKeyDown);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Share
  const handleShare = async () => {
    const shareData = {
      title: property?.title || "Property",
      text: property?.description?.slice?.(0, 120) || "Check this property",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert("Link copied!");
    }
  };

  // Download brochure
  const handleDownload = () => {
    const url = property?.brochureUrl || property?.pdf || property?.fileUrl;
    if (!url) {
      alert("No brochure available to download.");
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      {/* Card */}
      <article className="card group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition transform hover:scale-[1.01] duration-300">
  <div className="relative w-full h-64">
    <img
      src={images[0]}
      alt={property?.title || "Property image"}
      className="w-full h-full object-cover"
    />

    {/* Rating badge (top-right) */}
    {property?.rating != null && (
      <span
        className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-black bg-white text-md sm:text-sm font-semibold backdrop-blur"
        aria-label={`Rating ${property.rating}`}
        title={`Rating ${property.rating}`}
      >
        <span className="font-bold">{property.rating}</span>&nbsp;<span className="text-yellow-500">★</span>
      </span>
    )}
  </div>

  <div className="p-5 sm:p-6">
    <h3 className="text-lg font-semibold leading-tight">{property?.title}</h3>
    <p className="mt-1 text-sm text-gray-600">{property?.location}</p>
    {property?.category_type && (
      <p className="mt-1 text-xs text-gray-500">{property.propertyType}</p>
    )}
    <div className="mt-4 flex items-center justify-between">
      <div className="text-lg font-bold">
        ₹ {property?.price?.toLocaleString?.() ?? property?.price ?? "—"}
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sky-700 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
      >
        More Info →
      </button>
    </div>
  </div>
</article>


      {/* FULL-SCREEN MODAL */}
      {open && (
        <div className="fixed inset-0 z-[999] flex" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="relative z-10 flex h-screen w-screen flex-col bg-white">
            <div className="py-3 px-4 sm:px-6 lg:px-8">
              <Navbar />
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Hero image + thumbnails */}
              <section className="w-full">
                <div className="w-full aspect-[16/9] bg-gray-100">
                  <img
                    src={cover}
                    alt={property?.title || "Property image large"}
                    className="w-full h-full object-cover"
                  />
                </div>

                {images.length > 1 && (
                  <div className="px-4 sm:px-6 lg:px-8 py-4 bg-white border-b">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      {images.map((src, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveImageIdx(i)}
                          className={`relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden border ${
                            i === activeImageIdx ? "border-sky-500" : "border-gray-200"
                          }`}
                          aria-label={`View image ${i + 1}`}
                        >
                          <img src={src} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Main grid */}
              <section className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {/* LEFT: Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-4 sm:p-5">
                      <div className="flex items-start sm:items-center justify-between gap-3">
                        <h1 className="text-xl sm:text-2xl font-semibold leading-tight">
                          {property?.title || "—"}
                        </h1>
                        {property?.category_type && (
                          <span className="shrink-0 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs sm:text-sm font-medium text-sky-700">
                            {property.category_type}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-gray-600">
                        <FiMapPin className="text-sky-600" />
                        <span className="text-sm sm:text-base">
                          {property?.location || "Location not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Sidebar */}
                  <aside className="space-y-6 lg:space-y-7 lg:row-span-2 lg:self-start">
                    {/* Enquiry Form */}
                    <div className="rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-4">
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setErrors({});
                          setToast("");
                          setLoading(true);

                          const form = e.currentTarget;
                          const data = Object.fromEntries(new FormData(form));
                          const payload = {
                            name: data.name,
                            email: data.email,
                            phone: data.phone,
                            preferred_location: data.preferred_location,
                            message: data.message || "",
                            property_title: data.property_title || "",
                            property_id: data.property_id || "",
                          };

                          const res = await postEnquiry(payload);
                          setLoading(false);

                          if (res.ok) {
                            setToast(res.data.message || "Thanks! We’ll contact you soon.");
                            form.reset();
                          } else {
                            setErrors(res.errors || {});
                            setToast(res.message || "Please fix the errors and try again.");
                          }
                        }}
                        className="space-y-4"
                      >
                        {/* Name */}
                        <div className="grid gap-1.5">
                          <label htmlFor="name" className="text-sm font-medium">Name</label>
                          <input
                            id="name"
                            name="name"
                            required
                            placeholder="Your full name"
                            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                              errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="grid gap-1.5">
                          <label htmlFor="email" className="text-sm font-medium">Email</label>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            placeholder="Enter your mail"
                            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                              errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                        </div>

                        {/* Preferred Location */}
                        <div className="grid gap-1.5">
                          <label htmlFor="preferred_location" className="text-sm font-medium">
                            Preferred Location
                          </label>
                          <select
                            id="preferred_location"
                            name="preferred_location"
                            required
                            defaultValue=""
                            className={`w-full rounded-lg border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                              errors.preferred_location ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            <option value="" disabled>Select a location</option>
                            {locationOptions.map((loc, i) => (
                              <option key={i} value={loc}>{loc}</option>
                            ))}
                          </select>
                          {errors.preferred_location && (
                            <p className="text-xs text-red-600 mt-1">{errors.preferred_location}</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="grid gap-1.5">
                          <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                          <input
                            id="phone"
                            name="phone"
                            required
                            inputMode="tel"
                            placeholder="+91 9XXXXXXXXX"
                            minLength={10}
                            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                              errors.phone ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                        </div>

                        {/* Message */}
                        <div className="grid gap-1.5">
                          <label htmlFor="message" className="text-sm font-medium">Message</label>
                          <textarea
                            id="message"
                            name="message"
                            rows={3}
                            placeholder={`I'm interested in ${property?.title || "this property"}...`}
                            className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                              errors.message ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
                        </div>

                        <input type="hidden" name="property_title" value={property?.title || ""} />
                        <input type="hidden" name="property_id" value={property?._id || property?.id || ""} />

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-lg bg-sky-600 text-white px-4 py-2.5 font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
                        >
                          {loading ? "Submitting..." : "Submit"}
                        </button>

                        {!!toast && (
                          <p className={`mt-3 text-semibold ${Object.keys(errors).length ? "text-red-600" : "text-green-700"}`} role="status" aria-live="polite">
                            {toast}
                          </p>
                        )}
                      </form>
                    </div>

                    {/* Share / Download */}
                    <div className="rounded-2xl border border-gray-200 p-4 sm:p-5 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button type="button" onClick={handleShare} className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
                          <FiShare2 className="text-base" /> Share
                        </button>

                        <button type="button" onClick={handleDownload} className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500">
                          <FiDownload className="text-base" /> Download
                        </button>
                      </div>
                    </div>

                    {/* Map */}
                    <div className="rounded-2xl border border-gray-200 overflow-hidden mt-6">
                      <div className="w-full h-80 sm:h-96 md:h-[28rem] lg:h-[32rem] xl:h-[36rem]">
                        <iframe
                          title="Map - Tirupati"
                          src="https://www.google.com/maps?q=Tirupati&output=embed"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full block border-0"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  </aside>

                  {/* LEFT: Rest of details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    {/* <div className="rounded-2xl border border-gray-200 mt-2">
                      <div className="px-4 sm:px-5 py-3 border-b border-gray-200">
                        <h3 className="font-semibold">Description</h3>
                      </div>
                      <div className="p-4 sm:p-5 text-justify">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                          {property?.description || "No description available."}
                        </p>
                      </div>
                    </div> */}

                    {/* Details & Features — place this ABOVE Description */}
<div className="rounded-2xl border border-gray-200 mt-2">
  <div className="px-4 sm:px-5 py-3 border-b border-gray-200">
    <h3 className="font-semibold">Details &amp; Features</h3>
  </div>

  <div className="p-4 sm:p-5">
    <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-2 sm:gap-x-10 text-gray-700">
      <p className="font-medium">
        Square:{" "}
        <span className="font-semibold tabular-nums">
          {typeof property?.square === "number"
            ? `${property.square.toLocaleString("en-IN")} ft2`
            : "—"}
        </span>
      </p>

      <p className="font-medium">
        Property Type:{" "}
        <span className="font-semibold">
          {property?.propertyType || "—"}
        </span>
      </p>

      {/* Optional: show Category */}
      {property?.category_type && (
        <p className="font-medium">
          Category:{" "}
          <span className="font-semibold capitalize">
            {property.category_type}
          </span>
        </p>
      )}
    </div>
  </div>
</div>

{/* Description (your existing block) */}
<div className="rounded-2xl border border-gray-200 mt-2">
  <div className="px-4 sm:px-5 py-3 border-b border-gray-200">
    <h3 className="font-semibold">Description</h3>
  </div>
  <div className="p-4 sm:p-5 text-justify">
    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
      {property?.description || "No description available."}
    </p>
  </div>
</div>


                    {/* Amenities */}
                    <div className="rounded-2xl border border-gray-200 mt-6">
                      <div className="px-4 sm:px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold">Amenities</h3>
                        {/* <span className="text-sm text-gray-500">{property?.location}</span> */}
                      </div>
                      <div className="p-4 sm:p-5">
                        {Array.isArray(property?.amenities) && property.amenities.length > 0 ? (
                          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {property.amenities.map((label, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <HiCheckCircle className="text-emerald-600 text-lg" />
                                <span className="text-sm text-gray-700">{label}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No amenities available.</p>
                        )}
                      </div>
                    </div>

                    {/* Property Video */}
                    <div className="rounded-2xl border border-gray-200 overflow-hidden mt-6">
                      <div className="px-4 sm:px-5 py-3 border-b border-gray-200">
                        <h3 className="font-semibold">Property Video</h3>
                      </div>
                       <div className="relative w-full h-[420px] overflow-hidden rounded-lg">
      {isYouTube ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&rel=0&modestbranding=1&playsinline=1`}
          title={property.title || "Video"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
                        ) : (
                          <p className="text-sm text-gray-500 p-4">No video available for this property.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              {/* <section className="mt-0 px-4 sm:px-6 lg:px-8">
                <Signup />
              </section> */}
              <section className="mt-6">
                <Footer />
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
