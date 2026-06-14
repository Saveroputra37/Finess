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
      <div className="max-w-7xl mx-auto flex justify-center">
        <SideNav />
        <main className="flex-1 max-w-[600px] border-r border-custom min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <RightNav />
      </div>
    </div>
  );
}
