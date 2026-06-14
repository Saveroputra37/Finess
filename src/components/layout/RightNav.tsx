export default function RightNav() {
  return (
    <aside className="hidden lg:block w-80 p-6 h-screen sticky top-0 space-y-4">
      <div className="bg-card rounded-2xl border border-custom p-4">
        <h2 className="text-xl font-bold mb-4">What's happening</h2>
        <div className="space-y-4 text-sm">
          <div className="cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
            <p className="text-text-muted">Trending in Indonesia</p>
            <p className="font-bold">#FinessApp</p>
            <p className="text-text-muted">1.2K Posts</p>
          </div>
          <div className="cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
            <p className="text-text-muted">Technology · Trending</p>
            <p className="font-bold">Next.js 15</p>
            <p className="text-text-muted">45.8K Posts</p>
          </div>
        </div>
      </div>
      <div className="text-text-muted text-xs px-4">
        © 2024 Finess Inc.
      </div>
    </aside>
  );
}