import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-[60%] p-8 rounded-3xl shadow-lg">
        {children}
      </div>
    </div>
  );
}
