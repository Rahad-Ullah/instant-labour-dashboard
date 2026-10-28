"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, ArrowRight, ArrowLeft, LockKeyhole, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function NewPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMatching = Boolean(password && confirmPassword && password === confirmPassword);
  const isValidLength = password.length >= 6;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isMatching || !isValidLength) return;

    setIsSubmitting(true);
    // Simulating completion or calling api, then redirect to login
    setTimeout(() => {
      router.push("/login");
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* New Password Card */}
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 transition-all">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#0057DC] shadow-xs ring-4 ring-blue-50/50 mb-3">
            <LockKeyhole className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Set New Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs leading-relaxed">
            Create a new secure password for your Instant Labour admin account.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label
              htmlFor="password"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              New Password
            </Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
                className="pl-10 pr-11 h-11 bg-slate-50/60 border-slate-200 focus:bg-white focus:border-[#0057DC] focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="pl-10 pr-11 h-11 bg-slate-50/60 border-slate-200 focus:bg-white focus:border-[#0057DC] focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && !isMatching && (
              <p className="text-[11px] text-red-500 mt-1 pl-1">
                Passwords do not match
              </p>
            )}
            {confirmPassword && isMatching && (
              <p className="text-[11px] text-emerald-600 mt-1 pl-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Passwords match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isMatching || !isValidLength || isSubmitting}
            className="w-full mt-2 bg-[#FFC823] hover:bg-[#F5BD18] active:scale-[0.99] text-slate-950 font-semibold h-11 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Update Password</span>
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
