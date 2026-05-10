import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "hsl(220, 30%, 5%)" }}>
      {children}
    </div>
  );
}
