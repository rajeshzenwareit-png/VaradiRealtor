import React, { useEffect, useState } from 'react';
import { fetchReviews } from '../services/api';

export default function Testimonials(){
  const [reviews, setReviews] = useState([]);
  useEffect(()=> fetchReviews().then(setReviews).catch(console.error),[]);
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">Our Happy Clients</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map(r => (
          <div key={r._id} className="border p-4 rounded">
            <p className="italic">“{r.comment}”</p>
            <div className="mt-2"><strong>{r.name}</strong> — {r.rating}.0</div>
          </div>
        ))}
      </div>
    </section>
  );
}
