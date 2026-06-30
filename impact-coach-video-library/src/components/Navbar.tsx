import Link from 'next/link';
import { signOut } from '@/app/actions';

interface NavbarProps {
  active: 'library' | 'add' | 'admin';
  isAdmin: boolean;
  coachName: string;
}

export default function Navbar({ active, isAdmin, coachName }: NavbarProps) {
  const link = (href: string, key: NavbarProps['active'], label: string) => (
    <Link
      href={href}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        active === key ? 'bg-orange-100 text-brand' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/library" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-lg">
            🏀
          </span>
          <span className="hidden text-sm font-bold text-gray-900 sm:inline">
            Impact Coach
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {link('/library', 'library', 'Library')}
          {link('/add', 'add', 'Add')}
          {isAdmin && link('/admin', 'admin', 'Admin')}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden max-w-[8rem] truncate text-xs text-gray-500 sm:inline">
            {coachName}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
