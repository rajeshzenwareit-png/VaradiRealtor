import React from "react";

export default function Logo({ href = "/" }) {
  return (
    <a href={href} className="flex items-center gap-3 xl:ml-[5rem]">
      <img
        src="/images/logo.png"
        alt="Company logo"
        className="h-12 sm:h-12 md:h-16 lg:h-20 xl:h-24 w-auto object-contain shrink-0"
        decoding="async"
      />
    </a>
  );
}
