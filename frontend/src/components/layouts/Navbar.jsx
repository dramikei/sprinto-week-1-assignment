"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const navigation = [
  { name: "Books", href: "/books", current: false },
  { name: "Authors", href: "/authors", current: false },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="bg-slate-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-semibold">Book Management</Link>
          <nav className="flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="text-gray-300 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
