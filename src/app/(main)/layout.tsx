import React from "react";
import SideNav from "@/components/layout/SideNav";
import RightNav from "@/components/layout/RightNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-white">
      <div className="max-w-[1600px] mx-auto flex justify-center">
        <SideNav />
        <main className="flex-1 max-w-[950px] border-r border-custom min-h-screen pb-24 md:pb-0 px-3 sm:px-6 md:px-8">
          {children}
        </main>
        <RightNav />
      </div>
    </div>
  );
}
