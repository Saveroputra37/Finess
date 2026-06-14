"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Image, Video, BarChart2, Smile, Calendar } from "lucide-react";

export default function PostEditor() {
  const { user } = useUser();
  const [content, setContent] = useState("");

  return (
    <div className="w-full max-w-155 bg-[#151b26] border border-[#1e2738] rounded-2xl p-4 text-white font-sans shadow-xl">
      {/* BARIS ATAS: Avatar + Input Kapsul + Tombol Post */}
      <div className="flex items-center gap-3 w-full">
        {/* Lingkaran Avatar / Logo */}
        <div className="h-10 w-10 overflow-hidden rounded-full border border-[#1e2738] shrink-0 bg-[#0085ff] flex items-center justify-center font-bold text-lg select-none">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="tracking-tighter transform -skew-x-12 text-white">
              D
            </span>
          )}
        </div>

        {/* Input Field Capsule */}
        <div className="flex-1 bg-[#1c2331] rounded-full px-5 py-2.5 flex items-center border border-transparent focus-within:border-[#0085ff]/40 transition-all duration-200">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="5 Key Benefitsof Web 3 Worth Knowing"
            className="w-full bg-transparent text-[14px] text-white outline-none border-none placeholder:text-slate-400"
          />
        </div>

        {/* Tombol Post Utama */}
        <button
          disabled={!content.trim()}
          className="bg-[#0085ff] hover:bg-[#0076e5] disabled:opacity-40 disabled:hover:bg-[#0085ff] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all duration-200 active:scale-95 shadow-md"
        >
          Post
        </button>
      </div>

      {/* BARIS BAWAH: Toolbar Tombol Media Aksi */}
      <div className="flex items-center justify-center gap-2 mt-4 w-full">
        {/* 1. Image Button */}
        <button
          type="button"
          className="p-2.5 bg-[#1c2331] hover:bg-[#242f42] text-emerald-400 rounded-xl transition duration-200 group"
          title="Media"
        >
          <Image className="w-4.5 h-4.5 group-hover:scale-105 transition-transform" />
        </button>

        {/* 2. Video Button */}
        <button
          type="button"
          className="p-2.5 bg-[#1c2331] hover:bg-[#242f42] text-blue-400 rounded-xl transition duration-200 group"
          title="Video"
        >
          <Video className="w-4.5 h-4.5 group-hover:scale-105 transition-transform" />
        </button>

        {/* 3. GIF Badge Button */}
        <button
          type="button"
          className="w-9.5 h-9.5 bg-[#1c2331] hover:bg-[#242f42] text-pink-500 rounded-xl transition duration-200 flex items-center justify-center font-black text-[10px] tracking-wider border border-transparent"
          title="GIF"
        >
          <span className="border-2 border-pink-500 px-0.5 py-px rounded-md text-[9px] font-extrabold leading-none">
            GIF
          </span>
        </button>

        {/* 4. Poll Button */}
        <button
          type="button"
          className="p-2.5 bg-[#1c2331] hover:bg-[#242f42] text-rose-400 rounded-xl transition duration-200 group"
          title="Poll"
        >
          <BarChart2 className="w-4.5 h-4.5 rotate-90 group-hover:scale-105 transition-transform" />
        </button>

        {/* 5. Emoji Button */}
        <button
          type="button"
          className="p-2.5 bg-[#1c2331] hover:bg-[#242f42] text-indigo-400 rounded-xl transition duration-200 group"
          title="Emoji"
        >
          <Smile className="w-4.5 h-4.5 group-hover:scale-105 transition-transform" />
        </button>

        {/* 7. Schedule Button */}
        <button
          type="button"
          className="p-2.5 bg-[#1c2331] hover:bg-[#242f42] text-amber-400 rounded-xl transition duration-200 group"
          title="Schedule"
        >
          <Calendar className="w-4.5 h-4.5 group-hover:scale-105 transition-transform" />
        </button>
      </div>
    </div>
  );
}