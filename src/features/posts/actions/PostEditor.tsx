"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function PostEditor() {
  const { user } = useUser();
  const [content, setContent] = useState("");

  return (
    <div className="border border-custom p-4 transition-colors mt-5">
      <div className="flex gap-4">
        <div className="h-12 w-12 overflow-hidden rounded-full border border-custom flex-shrink-0">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-slate-800" />
          )}
        </div>
        <div className="flex-1 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?!"
            className="w-full bg-transparent text-xl text-white outline-none resize-none placeholder:text-slate-500 min-h-[100px]"
          />
          <div className="flex items-center justify-between pt-3 border-t border-custom">
            <div className="flex gap-1 text-primary">
              <button
                type="button"
                className="p-2 hover:bg-primary/10 rounded-full transition-premium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            <button
              disabled={!content.trim()}
              className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-6 py-2 rounded-full font-bold transition-premium shadow-lg active:scale-95"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}