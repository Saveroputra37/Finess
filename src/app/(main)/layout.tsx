import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-white">
      <aside className="w-72 border-r border-custom bg-card p-6 text-white">
        <div className="mb-10 text-xl font-semibold">Finess</div>
        <nav className="space-y-3 text-sm text-muted">
          <a
            className="block rounded-xl px-3 py-2 transition-premium bg-card-hover text-white"
            href="/"
          >
            Home
          </a>
          <a
            className="block rounded-xl px-3 py-2 transition-premium bg-card-hover text-white"
            href="/explore"
          >
            Explore
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
      <aside className="w-80 border-l border-custom bg-card p-6 text-white">
        Right sidebar
      </aside>
    </div>
  );
}
