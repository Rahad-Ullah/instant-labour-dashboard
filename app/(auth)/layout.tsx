import React from "react";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Authentication | Instant Labour",
  description: "Instant Labour Admin Authentication Portal",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#F8FAFC] overflow-x-hidden px-4 py-8 sm:py-12 selection:bg-amber-100 selection:text-amber-900">
      {/* Decorative ambient auras matching Instant Labour brand colors (#0057DC & #FFC823) */}
      <div
        className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-[#0057DC]/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-[#FFC823]/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-blue-300/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle modern dot grid texture */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.22] pointer-events-none"
        aria-hidden="true"
      />

      {/* Spacer / Top Header */}
      <div className="relative z-10 w-full max-w-md flex justify-center mb-2">
        {/* Placeholder for top branding if needed */}
      </div>

      {/* Main Auth Content Container */}
      <main className="relative z-10 w-full flex items-center justify-center my-auto">
        {children}
      </main>

      {/* Trust & Security Footer */}
      <footer className="relative z-10 w-full max-w-md pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <span>© {new Date().getFullYear()} Instant Labour. All rights reserved.</span>
        <span className="hidden sm:inline text-slate-300">•</span>
        <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Encrypted Admin Portal
        </span>
      </footer>
    </div>
  );
}
