import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">
        <li>
          <Link href="/dashboard" className="hover:text-[#26A69A] dark:hover:text-[#3FC3B6] transition-colors">
            Basin Console
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <span className="text-[#E2E5E8] dark:text-[#364356]">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-[#26A69A] dark:hover:text-[#3FC3B6] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#252B33] dark:text-white font-extrabold" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
