import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchProperties } from "../services/api";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Footer from "./Footer";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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

          setPost(selected);
          setOtherPosts(rest);
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (err) return <p className="p-6 text-red-500">{err}</p>;
  if (!post) return <p className="p-6">Post not found</p>;

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      {/* Navbar */}
      <Navbar />

      {/* Full width blog image */}
      <div className="relative w-full">
        {Array.isArray(post.images) && post.images[0] && (
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-[500px] object-cover"
          />
        )}
      </div>

      {/* Title + description */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-center">{post.title}</h1>
        <p className="text-lg text-gray-700 leading-relaxed text-justify">{post.description}</p>
      </div>

      {/* More Blogs */}
      <div className="w-full px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6 flex justify-center">More Blogs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((p) => (
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

              <h3 className="text-lg font-semibold line-clamp-1">
                {p.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 mt-1 text-justify">
                {p.description || "—"}
              </p>

              {/* Read more → aligned right at bottom */}
              <div className="mt-auto flex justify-end p-5">
                <Link
                  to={`/blog/${p._id}`}
                  className="text-sky-600 hover:underline font-medium"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Signup + Footer */}
      <section>
        {/* <Signup /> */}
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
};

export default BlogDetails;
