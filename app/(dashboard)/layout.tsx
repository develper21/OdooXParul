import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full relative overflow-hidden" style={{ background: "#050810" }}>
      {/* Premium Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        
        {/* Soft glowing orbs */}
        <div className="absolute w-[800px] h-[800px] rounded-full -top-40 -left-40 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06), transparent 70%)" }} />
        <div className="absolute w-[600px] h-[600px] rounded-full -bottom-32 -right-32 blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.05), transparent 70%)" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full top-1/2 right-1/4 blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.04), transparent 70%)" }} />
      </div>

      <div className="z-10 flex w-full h-full">
        <Sidebar />
        <MobileSidebar />
        <main className="flex-1 h-full overflow-y-auto min-w-0 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
