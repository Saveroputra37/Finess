"use client";

interface PostProps {
  name: string;
  username: string;
  content: string;
  time: string;
  avatar?: string;
}

export default function PostCard({ name, username, content, time, avatar }: PostProps) {
  return (
    <div className="p-4 border-b border-custom hover:bg-white/2 transition-premium cursor-pointer group bg-card my-10 rounded-2xl shadow-lg">
      <div className="flex gap-3 ">
        <div className="h-12 w-12 rounded-full bg-slate-800 flex-shrink-0 overflow-hidden border border-custom ">
          {avatar && <img src={avatar} alt={name} className="h-full w-full object-cover" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-white hover:underline decoration-1">{name}</span>
            <span className="text-text-muted text-sm">@{username} · {time}</span>
          </div>
          <p className="mt-1 text-[15px] text-slate-100 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
          
          <div className="flex justify-between mt-3 max-w-sm text-text-muted">
            <button className="flex items-center gap-2 group/btn hover:text-primary transition-premium">
              <div className="p-2 group-hover/btn:bg-primary/10 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xs font-medium">12</span>
            </button>
            <button className="flex items-center gap-2 group/btn hover:text-emerald-500 transition-premium">
              <div className="p-2 group-hover/btn:bg-emerald-500/10 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-xs font-medium">4</span>
            </button>
            <button className="flex items-center gap-2 group/btn hover:text-pink-500 transition-premium">
              <div className="p-2 group-hover/btn:bg-pink-500/10 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium">82</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}