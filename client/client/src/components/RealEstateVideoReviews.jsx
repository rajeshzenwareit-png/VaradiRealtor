import React, { useEffect, useMemo, useRef, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { fetchReviews } from "../services/api";

// ---- helpers: build embeddable URLs for common providers ----
function toEmbedUrl(raw = "") {
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");

    // YouTube watch
    if (host === "youtube.com" || host === "m.youtube.com") {
      const v = url.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      // /shorts/:id
      const mShorts = url.pathname.match(/^\/shorts\/([^/]+)/);
      if (mShorts) return `https://www.youtube.com/embed/${mShorts[1]}`;
    }
    // youtu.be
    if (host === "youtu.be") {
      const id = url.pathname.split("/")[1];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    // Vimeo
    if (host === "vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

export default function RealEstateVideoReviews() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [apiItems, setApiItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await fetchReviews();
        const list = Array.isArray(data) ? data : data.items || [];
        if (!cancelled) setApiItems(list);
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load reviews");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Map API results -> view model & keep only those with valid embed field present
  const data = useMemo(() => {
    return (apiItems || [])
      .filter((r) => typeof r?.video_review === "string" && r.video_review.trim() !== "")
      .map((r, i) => {
        const embed = toEmbedUrl(r.video_review);
        return {
          id: r._id || i,
          embedUrl: embed,
          rawUrl: r.video_review,
          name: r.name || "Anonymous",
          rating: typeof r.rating === "number" ? r.rating : 5,
          review: r.comment || "",
          createdAt: r.createdAt,
        };
      });
  }, [apiItems]);

  const StarBar = ({ rating = 5 }) => {
    const full = Math.max(0, Math.min(5, Math.round(rating)));
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) =>
          i < full ? (
            <AiFillStar key={i} className="h-4 w-4 text-yellow-400" />
          ) : (
            <AiOutlineStar key={i} className="h-4 w-4 text-yellow-400" />
          )
        )}
      </div>
    );
  };

  const trackRef = useRef(null);

  const scrollByCards = (dir = 1) => {
    const el = trackRef.current;
    if (!el) return;

    const firstCard = el.querySelector("[data-card]");
    const cardW = firstCard ? firstCard.getBoundingClientRect().width : el.clientWidth;

    // Larger jumps on desktop, smaller on mobile for control
    const multiplier = window.innerWidth >= 1024 ? 3 : 1.6;
    const step = Math.max(cardW * multiplier, el.clientWidth * 0.9);

    const target = el.scrollLeft + dir * step;
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <section className="bg-gray-200 py-10 sm:py-12 mt-10 mb-10 rounded-lg shadow-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Reviews from Home Seekers
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollByCards(-1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow border border-gray-200 hover:shadow-md disabled:opacity-50"
              disabled={loading || data.length === 0}
              aria-label="Scroll left"
            >
              <HiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollByCards(1)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow border border-gray-200 hover:shadow-md disabled:opacity-50"
              disabled={loading || data.length === 0}
              aria-label="Scroll right"
            >
              <HiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Loading / Error / Empty states */}
        {loading && (
          <div className="py-12 text-center text-gray-600">Loading video reviews…</div>
        )}
        {err && !loading && (
          <div className="py-12 text-center text-red-600">{err}</div>
        )}

        {!loading && !err && (
          <>
            {/* If there are reviews but none embeddable, show message */}
            {data.filter((d) => d.embedUrl).length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-gray-700 font-medium">
                  No embeddable video reviews found.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Only YouTube/Vimeo links are supported for inline playback.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Scrollable track */}
                <div
                  ref={trackRef}
                  className="
                    flex gap-6 snap-x snap-mandatory
                    overflow-x-auto scroll-smooth overscroll-x-contain
                    [scrollbar-width:none] [-ms-overflow-style:none]
                    [&::-webkit-scrollbar]:hidden
                    pb-2
                  "
                >
                  {data.map((item) => {
                    const canEmbed = !!item.embedUrl;
                    return (
                      <article
                        key={item.id}
                        data-card
                        className="
                          group snap-start shrink-0
                          w-[88%] sm:w-[60%] md:w-[45%] lg:w-[32%] xl:w-[24%] 2xl:w-[19%]
                          bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden
                        "
                      >
                        <div className="relative aspect-video bg-black/5">
                          {canEmbed ? (
                            <iframe
                              title={`Review by ${item.name}`}
                              src={item.embedUrl}
                              className="h-full w-full"
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <a
                                href={item.rawUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-600 underline"
                              >
                                Open video
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="p-4 sm:p-5">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-1">
                              {item.name}
                            </h3>
                            <StarBar rating={item.rating} />
                          </div>
                          {item.review && (
                            <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-4">
                              {item.review}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
