"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: "🏠" },
    { label: "Explore", href: "/explore", icon: "🔍" },
  ];

  return (
    <>
      {/* Desktop Side Nav */}
      <aside className="hidden md:flex flex-col w-20 xl:w-72 border-r border-custom bg-card p-4 xl:p-6 h-screen sticky top-0">
        <div className="mb-10 text-2xl font-bold text-primary px-3">Finess</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 rounded-full px-4 py-3 transition-premium hover:bg-card-hover text-white ${
                pathname === item.href ? "font-bold" : "text-muted"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="hidden xl:block text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-custom bg-background/80 backdrop-blur-md z-50 flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="text-2xl p-2">
            {item.icon}
          </Link>
        ))}
      </nav>
    </>
  );
}