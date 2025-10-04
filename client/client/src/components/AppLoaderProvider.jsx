import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const LoaderCtx = createContext({
  showLoader: () => {},
  hideLoader: () => {},
  loading: false,
});

export const useAppLoader = () => useContext(LoaderCtx);

export default function AppLoaderProvider({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Brief loader on every route change
  useEffect(() => {
    setLoading(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setLoading(false),400); // tweak duration
    return () => clearTimeout(timeoutRef.current);
  }, [location]);

  const api = useMemo(
    () => ({
      showLoader: () => {
        clearTimeout(timeoutRef.current);
        setLoading(true);
      },
      hideLoader: () => {
        clearTimeout(timeoutRef.current);
        setLoading(false);
      },
      loading,
    }),
    [loading]
  );

  return (
    <LoaderCtx.Provider value={api}>
        {loading && (
  <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/40">
    <div className="flex flex-col items-center gap-4">
      {/* Logo (adjust sizes as needed) */}
      <img
        src="/images/logo.png"
        alt="logo"
        className="w-20 h-20 md:w-24 md:h-24 object-contain"
      />

      {/* Spinner (light on dark overlay) */}
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-sky-400"
        role="status"
        aria-label="Loading"
      />
      <span className="sr-only">Loading…</span>
    </div>
  </div>
)}


      {children}
    </LoaderCtx.Provider>
  );
}
