import React, { useState } from "react";
import { postEnquiry } from "../services/api";

const ContactForm = ({ property }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const locationOptions = ["Tirupati", "Bengaluru", "Chennai", "Hyderabad", "Other"];

  return (
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

        try {
          const res = await postEnquiry(payload);
          setLoading(false);

          if (res.ok) {
            setToast(res.data?.message || "✅ Thanks! We’ll contact you soon.");
            form.reset();
          } else {
            setErrors(res.errors || {});
            setToast(res.message || "⚠️ Please fix the errors and try again.");
          }
        } catch (err) {
          setLoading(false);
          setToast("❌ Something went wrong. Please try again.");
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
        <label htmlFor="preferred_location" className="text-sm font-medium">Preferred Location</label>
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
          maxLength={20}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-600 text-white px-4 py-2.5 font-medium hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {/* Toast */}
      {!!toast && (
        <p
          className={`mt-3 text-sm font-medium ${Object.keys(errors).length ? "text-red-600" : "text-green-700"}`}
          role="status"
          aria-live="polite"
        >
          {toast}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
