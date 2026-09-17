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
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
        <li>
          <Link href="/dashboard" className="hover:text-neutral-950 dark:hover:text-white transition-colors">
            Basin Console
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-neutral-950 dark:hover:text-white transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-950 dark:text-white font-extrabold" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
