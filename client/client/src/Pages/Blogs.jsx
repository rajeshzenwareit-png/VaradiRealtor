import React, { useEffect, useState } from 'react';
import { fetchBlogs } from '../services/api';

export default function Blogs(){
  const [blogs, setBlogs] = useState([]);
  console.log(blogs)

  useEffect(()=> { fetchBlogs().then(setBlogs).catch(console.error); }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map(b => (
          <article key={b._id} className="card p-4">
            <img src={b.coverImage || '/assets/blog-placeholder.jpg'} className="w-full h-44 object-cover rounded-md mb-3" alt={b.title}/>
            <h3 className="text-xl font-semibold">{b.title}</h3>
            <p className="text-gray-600 mt-2">{b.excerpt}</p>
            <div className="mt-3"><a className="text-brand-500 font-medium" href="#">Read more →</a></div>
          </article>
        ))}
      </div>
    </div>
  );
}
