import React, { useEffect, useState } from 'react';
import { fetchAgents } from '../services/api';

export default function Agents(){
  const [agents, setAgents] = useState([]);
  useEffect(()=> fetchAgents().then(setAgents).catch(console.error),[]);
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold mb-4">Meet Our Agents</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {agents.map(a => (
          <div key={a._id} className="border p-4 rounded">
            <div className="h-24 w-24 bg-gray-200 mb-2"></div>
            <h3 className="font-semibold">{a.name}</h3>
            <p className="text-sm">{a.about}</p>
            <p className="text-sm mt-2">{a.phone}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
