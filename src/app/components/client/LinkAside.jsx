import React from "react";
import Link from "next/link";

export default function LinkAside({ href, children, Icon, onClick }) {
  return (
    <Link href={href} className="flex rounded-md items-center gap-4 px-3 py-3 transition duration-300 hover:bg-white hover:text-primary group/link" onClick={onClick}>
      <div>
        <Icon width={20} className="fill-white group-hover/link:fill-primary inline-block" />
      </div>
      {children}
    </Link>
  );
}
