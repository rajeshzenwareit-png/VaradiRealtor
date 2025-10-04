// src/components/LoaderOverlay.jsx
import React from "react";

export default function LoaderOverlay({ show = false, text = "Loading…" }) {
  return (
    <div
      aria-hidden={!show}
      aria-busy={show}
      className={[
        "fixed inset-0 z-[9999]",
        "flex items-center justify-center",
        "bg-white/95 backdrop-blur-sm",
        "transition-opacity duration-200",
        show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="flex flex-col items-center gap-4 select-none">
        <img
          src="/logo.png"  // put logo.png in /public
          alt="Loading"
          className="w-24 h-24 animate-pulse"
          draggable="false"
        />
        <div className="flex items-center gap-2 text-gray-700">
          {/* simple Tailwind spinner (border trick) */}
          <span className="inline-block h-4 w-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
          <span className="text-sm font-medium">{text}</span>
        </div>
      </div>
    </div>
  );
}
