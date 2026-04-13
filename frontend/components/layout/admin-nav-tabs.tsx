"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const items = [
  { label: 'User Management', href: '/admin/users' },
  { label: 'All Articles', href: '/admin/articles' },
  { label: 'Moderation', href: '/admin/moderation' },
  { label: 'Profile Settings', href: '/admin/settings' },
];

export function AdminNavTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  return (
    <nav className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => {
        const active =
          item.label === 'Moderation'
            ? pathname === '/admin/moderation' || (pathname === '/admin/articles' && mode === 'moderation')
            : item.label === 'All Articles'
              ? pathname === '/admin/articles' && mode !== 'moderation'
              : pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-[8px] border px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? 'border-[#FB6503] bg-[#FFF0E6] text-[#C2410C]'
                : 'border-[#E5E7EB] bg-white text-[#57534D] hover:bg-[#FAFAF9]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
