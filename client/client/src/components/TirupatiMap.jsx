import React, { useMemo } from "react";

// Only imported/used when apiKey is provided
let GoogleMap, Marker, useLoadScript;
try {
  // Lazy import types to avoid errors if package isn't installed for iframe-only usage
  const lib = require("@react-google-maps/api");
  GoogleMap = lib.GoogleMap;
  Marker = lib.Marker;
  useLoadScript = lib.useLoadScript;
} catch {}

/**
 * TirupatiMap
 * Props:
 * - apiKey?: string (Vite: import.meta.env.VITE_GOOGLE_MAPS_KEY)
 * - height?: string (e.g., "360px")
 * - zoom?: number (default 12)
 */
export default function TirupatiMap({ apiKey, height = "360px", zoom = 12 }) {
  const center = useMemo(() => ({ lat: 13.6288, lng: 79.4192 }), []);

  // Fallback to iframe if no apiKey provided
  if (!apiKey || !useLoadScript) {
    const src =
      "https://www.google.com/maps?q=Tirupati,%20Andhra%20Pradesh&output=embed";
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
        {/* <h2 className="text-2xl font-bold mb-4">Tirupati Location</h2> */}
        <div
          className="relative w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-gray-100"
          style={{ height }}
        >
          <iframe
            title="Tirupati Map"
            src={src}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
          />
        </div>
        <div className="mt-3">
          <a
            href="https://www.google.com/maps/place/Tirupati,+Andhra+Pradesh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-sky-600 hover:text-sky-700 underline underline-offset-4"
          >
            Open in Google Maps
          </a>
        </div>
      </section>
    );
  }

  // JS API mode (interactive)
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  if (loadError) {
    return (
      <p className="text-red-600">
        Failed to load Google Maps. Check API key, billing, and restrictions.
      </p>
    );
  }
  if (!isLoaded) return <p>Loading map…</p>;

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <h2 className="text-2xl font-bold mb-4">Tirupati Location</h2>
      <div
        className="w-full rounded-2xl shadow-md ring-1 ring-gray-100 overflow-hidden"
        style={{ height }}
      >
        <GoogleMap
          zoom={zoom}
          center={center}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            disableDefaultUI: false,
            clickableIcons: true,
            // mapId: "YOUR_CLOUD_MAP_ID", // optional styled map
          }}
        >
          <Marker position={center} title="Tirupati, Andhra Pradesh" />
        </GoogleMap>
      </div>
      <div className="mt-3">
        <a
          href="https://www.google.com/maps/place/Tirupati,+Andhra+Pradesh"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-sky-600 hover:text-sky-700 underline underline-offset-4"
        >
          Open in Google Maps
        </a>
      </div>
    </section>
  );
}
