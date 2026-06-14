import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className="w-72 border-r border-slate-200 bg-white p-6">
        <div className="mb-10 text-xl font-semibold">Finess</div>
        <nav className="space-y-3 text-sm text-slate-700">
          <a className="block rounded-xl px-3 py-2 hover:bg-slate-100" href="/">Home</a>
          <a className="block rounded-xl px-3 py-2 hover:bg-slate-100" href="/explore">Explore</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
      <aside className="w-80 border-l border-slate-200 bg-white p-6">Right sidebar</aside>
    </div>
  );
}
