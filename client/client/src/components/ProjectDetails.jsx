import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { FiShare2, FiDownload, FiMapPin } from "react-icons/fi";
import { HiCheckCircle } from "react-icons/hi";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Footer from "./Footer";
import { fetchProperties, postEnquiry } from "../services/api";

function getYouTubeId(url = "") {
  const m = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
  );
  return m ? m[1] : null;
}

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [otherProjects, setOtherProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProperties();
        if (cancelled) return;

        if (Array.isArray(data)) {
          const selected = data.find((p) => p._id === id);
          const rest = data.filter((p) => p._id !== id).slice(0, 6);

          setProject(selected);
          setOtherProjects(rest);
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load project");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const locationOptions = useMemo(() => {
    const opts = project?.locationOptions;
    return Array.isArray(opts) && opts.length
      ? opts
      : ["Tirupati", "Bengaluru", "Chennai", "Hyderabad", "Other"];
  }, [project?.locationOptions]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setToast("");
    setFormLoading(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Validation
    const errors = {};
    if (!data.name?.trim()) errors.name = "Name is required";
    if (!data.email?.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Invalid email format";
    if (!data.phone?.trim()) errors.phone = "Phone is required";
    else if (!/^[\d+\- ]{8,20}$/.test(data.phone)) errors.phone = "Invalid phone number";
    if (!data.preferred_location) errors.preferred_location = "Select a location";

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      setFormLoading(false);
      return;
    }

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      preferred_location: data.preferred_location,
      message: data.message || "",
      property_title: project.title,
      property_id: project._id,
    };

    try {
      const res = await postEnquiry(payload);
      setFormLoading(false);

      if (res.ok) {
        setToast(res.data?.message || "✅ Thanks! We'll contact you soon.");
        form.reset();
      } else {
        setFormErrors(res.errors || {});
        setToast(res.message || "⚠️ Please fix the errors and try again.");
      }
    } catch (err) {
      setFormLoading(false);
      setToast("Something went wrong. Please try again.");
    }

    setTimeout(() => setToast(""), 4000);
  };

  const handleShare = async () => {
    const shareData = {
      title: project?.title || "Project",
      text:
        project?.description?.slice?.(0, 120) || "Check out this property project",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareData.url);
      setToast("Link copied!");
      setTimeout(() => setToast(""), 4000);
    }
  };

  const handleDownload = () => {
    const url = project?.brochureUrl || project?.pdf || project?.fileUrl;
    if (!url) {
      setToast("No brochure available to download.");
      setTimeout(() => setToast(""), 4000);
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (err) return <p className="p-6 text-center text-red-500">{err}</p>;
  if (!project) return <p className="p-6 text-center">Project not found</p>;

  const ytId = getYouTubeId(project?.videoUrl || "");
  const isYouTube = !!ytId;

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Navbar />

      {/* Project Hero Image */}
      {Array.isArray(project.images) && project.images[0] && (
        <div className="relative w-full">
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-[500px] object-cover"
          />
        </div>
      )}

      {/* Main Grid */}
      <div className="w-full px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details */}
          <div className="bg-white rounded-2xl p-10 border border-gray-300 shadow-md space-y-6">
            <h1 className="text-4xl font-bold leading-tight">{project.title}</h1>
            <p className="text-gray-600 text-lg flex items-center gap-2">
              <FiMapPin className="text-sky-600 text-xl" />
              {project.location || "Location not specified"}
            </p>
            {project.price && (
              <p className="text-green-600 text-lg font-semibold">
                <span className="font-semibold">Price:</span> ₹
                {project.price.toLocaleString()}
              </p>
            )}
            {project.propertyType && (
              <p className="text-gray-700 text-lg">
                <span className="font-semibold">Type:</span> {project.propertyType}
              </p>
            )}
            {project.description && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-gray-700 leading-relaxed text-justify text-base sm:text-lg">
                  {project.description}
                </p>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Amenities</h2>
            {Array.isArray(project.amenities) && project.amenities.length > 0 ? (
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {project.amenities.map((a, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <HiCheckCircle className="text-emerald-600 text-lg" />
                    <span className="text-gray-700 text-sm">{a}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No amenities available.</p>
            )}
          </div>

          {/* Property Video */}
          <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Property Video</h2>
            {project?.videoUrl ? (
              isYouTube ? (
                <div className="relative w-full aspect-video rounded overflow-hidden">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=1&rel=0`}
                    title={project.title || "Video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded overflow-hidden">
                  <video
                    src={project.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
              )
            ) : (
              <p className="flex items-center justify-center w-full h-64 text-white">
                Video not available for this property.
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <aside className="space-y-6 lg:space-y-7">
          <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-sm space-y-4">
            <h2 className="text-2xl font-semibold">Contact Us</h2>

            {/* Contact Form */}
            <form
              className="space-y-4 w-full"
              onSubmit={handleFormSubmit}
            >
              <input
                name="name"
                placeholder="Your Name"
                className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-sky-500 ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.name && (
                <p className="text-xs text-red-600">{formErrors.name}</p>
              )}

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-sky-500 ${
                  formErrors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.email && (
                <p className="text-xs text-red-600">{formErrors.email}</p>
              )}

              <input
                type="text"
                name="phone"
                placeholder="+91 9XXXXXXXXX"
                minLength={10}
                className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-sky-500 ${
                  formErrors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.phone && (
                <p className="text-xs text-red-600">{formErrors.phone}</p>
              )}

              <select
                name="preferred_location"
                defaultValue=""
                className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-sky-500 ${
                  formErrors.preferred_location ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="" disabled>
                  Select Preferred Location
                </option>
                {locationOptions.map((loc, i) => (
                  <option key={i} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {formErrors.preferred_location && (
                <p className="text-xs text-red-600">{formErrors.preferred_location}</p>
              )}

              <textarea
                name="message"
                rows={4}
                placeholder="Message (optional)"
                className={`w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  formErrors.message ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.message && <p className="text-xs text-red-600">{formErrors.message}</p>}

              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 disabled:opacity-60"
              >
                {formLoading ? "Submitting..." : "Submit"}
              </button>

              {toast && (
                <p
                  className={`mt-3 text-sm font-medium ${
                    Object.keys(formErrors).length ? "text-red-600" : "text-green-700"
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {toast}
                </p>
              )}
            </form>

            {/* Share & Download Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
              >
                <FiShare2 /> Share
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center justify-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
              >
                <FiDownload /> Download
              </button>
            </div>
          </div>

          {/* Google Map */}
          <div className="bg-white rounded-xl p-8 border border-gray-300 shadow-sm min-h-[400px]">
            <h2 className="text-xl font-semibold mb-3">Location</h2>
            <div className="w-full h-96">
              <iframe
                title={`Map - ${project.location}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  project.location || "Tirupati"
                )}&output=embed`}
                loading="lazy"
                className="w-full h-full border-0 rounded"
                allowFullScreen
              />
            </div>
          </div>
        </aside>
      </div>

      {/* More Projects */}
      <div className="w-full px-4 py-5">
        <h2 className="text-2xl font-semibold mb-6 flex justify-center">
          More Results
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((p) => (
            <article
              key={p._id}
              className="border rounded-xl p-4 bg-white hover:shadow-md transition flex flex-col"
            >
              {Array.isArray(p.images) && p.images[0] && (
                <img
                  src={p.images[0]}
                  alt={p.title || "Cover"}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="text-lg font-semibold line-clamp-1">{p.title || "Untitled"}</h3>
              <p className="text-sm text-gray-600 line-clamp-3 mt-1 text-justify">
                {p.description || "—"}
              </p>
              <div className="mt-auto flex justify-end">
                <Link
                  to={`/project/${p._id}`}
                  className="text-sky-600 hover:underline font-medium"
                >
                  More Info →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* <Signup /> */}
      <Footer />
    </div>
  );
};

export default ProjectDetails;
