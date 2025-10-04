import React, { useEffect, useRef, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { fetchBlogs } from "../services/api";

export default function BlogShowcase({
  imgHeight = "180px",
  imgWidth = "300px",
  limit = 3,
  query = "",
  sort = "-createdAt",
}) {
  const [items, setItems] = useState([]);
  const [openIdx, setOpenIdx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const cardRefs = useRef([]);

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");

        // Ask only for fields needed by this UI
        const res = await fetchBlogs(
          {
            page: 1,
            limit,
            q: query,
            sort,
            fields: "title,img,text,longText,coverImage,excerpt,content,createdAt,_id,slug",
          },
          { signal: ctrl.signal } // ok if your helper ignores it
        );

        const raw = Array.isArray(res) ? res : res?.data || [];
        const normalized = raw.map((b, i) => ({
          id: b._id || b.id || b.slug || `row-${i}`,
          title: b.title || "Untitled",
          img: b.img || b.coverImage || "",
          text: b.text || b.excerpt || "",
          longText: b.longText || b.content || "",
        }));

        setItems(normalized.slice(0, limit));
      } catch (e) {
        if (e?.name !== "AbortError") setErr(e?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [limit, query, sort]);

  const handleToggle = (idx) => {
    const next = openIdx === idx ? null : idx;
    setOpenIdx(next);
    requestAnimationFrame(() => {
      const el = cardRefs.current[idx];
      if (next !== null && el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  };

  const Skeleton = () => (
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 animate-pulse">
      <div
        className="rounded-lg bg-gray-200"
        style={{
          width: `clamp(120px, 32vw, ${imgWidth})`,
          height: `clamp(140px, 22vw, ${imgHeight})`,
        }}
      />
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-8 bg-gray-200 rounded w-28" />
      </div>
    </div>
  );

  return (
    <section className="w-full bg-gray-100 rounded-2xl shadow-xl px-4 py-8 sm:p-8 lg:p-10">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column */}
        <div className="flex flex-col justify-center space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 text-center md:text-left">
            Latest Property Info &amp; Tips
          </h2>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed text-center md:text-left">
            Fresh insights from our blog—market trends, buying tips, layouts, finance, and more.
          </p>

          <div className="flex justify-center md:justify-start">
            <a
              href="/blogsection"
              className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-white font-semibold hover:bg-sky-600 transition mt-6 sm:mt-10"
            >
              Explore Our Blog
            </a>
          </div>
        </div>

        {/* Right Column: list of cards */}
        <div className="flex flex-col gap-6">
          {loading && (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}

          {!loading && err && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-red-200">
              <p className="text-red-600 font-medium">Couldn’t load posts: {err}</p>
            </div>
          )}

          {!loading && !err && items.length === 0 && (
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-gray-600">No posts found.</p>
            </div>
          )}

          {!loading &&
            !err &&
            items.map((it, idx) => {
              const isOpen = openIdx === idx;
              return (
                <article
                  key={it.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  className="
                    bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition
                    grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4
                  "
                >
                  {/* Thumbnail */}
                  <div
                    className="
                      overflow-hidden rounded-lg
                      aspect-[16/9] sm:aspect-auto
                      w-full sm:w-auto
                    "
                    style={{
                      width: `clamp(120px, 32vw, ${imgWidth})`,
                      height: `clamp(140px, 22vw, ${imgHeight})`,
                    }}
                  >
                    <img
                      src={it.img || "https://via.placeholder.com/600x400?text=No+Image"}
                      alt={it.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  {/* Text + Button */}
                  <div className="flex flex-col">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {it.title}
                    </h3>
                    <p className="mt-1 text-sm sm:text-base text-gray-600 line-clamp-3 sm:line-clamp-2">
                      {it.text}
                    </p>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => handleToggle(idx)}
                        className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-3 py-2 text-white text-sm font-medium hover:bg-sky-600 transition"
                        aria-expanded={isOpen}
                        aria-controls={`blog-card-details-${idx}`}
                      >
                        {isOpen ? "Read less" : "Read more"}
                        <FiArrowRight className="text-white" />
                      </button>
                    </div>

                    {/* Expanded details */}
                    <div
                      id={`blog-card-details-${idx}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-4 border-t pt-4 space-y-4">
                          <div className="w-full">
                            <img
                              // src={it.img || "https://via.placeholder.com/1200x800?text=No+Image"}
                              alt={`${it.title} large`}
                              className="w-full h-auto rounded-lg object-cover"
                              loading="lazy"
                            />
                          </div>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            {it.longText || it.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </section>
  );
}
