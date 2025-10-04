import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { fetchBlogs } from "../services/api";
import { FiArrowLeft } from "react-icons/fi";

export default function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");
        // Fetch minimal set; adjust if you have a fetchBlogById
        const res = await fetchBlogs(
          { page: 1, limit: 20, sort: "-createdAt" },
          { signal: ctrl.signal }
        );
        const list = Array.isArray(res) ? res : res?.data || [];
        // normalize
        const mapped = list.map((b) => ({
          id: b._id || b.id || b.slug,
          title: b.title?.trim() || "Untitled",
          img: b.img || b.coverImage || "",
          text: b.text || b.excerpt || "",
          longText: b.longText || b.content || "",
          date: b.createdAt ? new Date(b.createdAt).toISOString() : null,
        }));

        const selected = mapped.find((x) => String(x.id) === String(id));
        setPost(selected || null);
        setOthers(mapped.filter((x) => String(x.id) !== String(id)).slice(0, 6));
      } catch (e) {
        if (e?.name !== "AbortError") setErr(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (err) return <p className="p-6 text-center text-red-500">{err}</p>;
  if (!post) return <p className="p-6 text-center">Post not found</p>;

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Navbar />

      {/* Hero Image full width */}
      {post.img && (
        <div className="relative w-full">
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-[420px] sm:h-[500px] object-cover"
          />
        </div>
      )}

      {/* Content */}
      <main className="w-full px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <Link
              to="/blogsection"
              className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-800 font-medium"
            >
              <FiArrowLeft /> Back to Blog
            </Link>
          </div>

          {/* White card with title & description */}
          <article className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <header className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{post.title}</h1>
              {post.date && (
                <time dateTime={post.date} className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </time>
              )}
            </header>

            {post.text && (
              <p className="mt-4 text-lg text-gray-700">{post.text}</p>
            )}

            {(post.longText || "").length > 0 && (
              <div className="prose max-w-none prose-slate mt-6">
                <p className="whitespace-pre-line leading-7 text-gray-800">
                  {post.longText}
                </p>
              </div>
            )}
          </article>

          {/* More Posts */}
          {others.length > 0 && (
            <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">More Posts</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map((b) => (
                  <article key={b.id} className="border rounded-xl p-4 bg-white hover:shadow-md transition flex flex-col">
                    {b.img && (
                      <img
                        src={b.img}
                        alt={b.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                        loading="lazy"
                      />
                    )}
                    <h3 className="text-lg font-semibold line-clamp-1">{b.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mt-1 text-justify">
                      {b.text || "—"}
                    </p>
                    <div className="mt-auto flex justify-end">
                      <Link
                        to={`/blog/${encodeURIComponent(b.id)}`}
                        className="text-sky-600 hover:underline font-medium"
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
