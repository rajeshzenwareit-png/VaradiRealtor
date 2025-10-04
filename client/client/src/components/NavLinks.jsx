import React from "react";

export default function NavLinks({ items = [] }) {
  return (
    <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-6 font-semibold">
      {items.map(({ label, href }, i) => (
        <li key={i}>
          <a href={href} className="text-white/90 hover:text-white transition">
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
