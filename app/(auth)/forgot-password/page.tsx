"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Navigate to OTP verification with email in query param if desired
    router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Forgot Password Card */}
      <div className="bg-white/95 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 transition-all">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-13 h-13 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-xs ring-4 ring-amber-50/50 mb-3">
            <KeyRound className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs leading-relaxed">
            Enter your admin email address to receive a 6-digit verification code.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label
              htmlFor="email"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@instantlabour.co.uk"
                className="pl-10 h-11 bg-slate-50/60 border-slate-200 focus:bg-white focus:border-[#0057DC] focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full mt-2 bg-[#FFC823] hover:bg-[#F5BD18] active:scale-[0.99] text-slate-950 font-semibold h-11 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#0057DC] transition-colors w-full text-center"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Log In</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
