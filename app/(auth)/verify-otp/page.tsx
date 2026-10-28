"use client";

import { useState, useEffect } from "react";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

export default function OtpVerificationPage() {
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleResend = () => {
    setTimer(59);
    setOtpValue("");
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length < 6) return;
    router.push("/new-password");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Verify OTP Card */}
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-900/5 transition-all text-center">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#0057DC] shadow-xs ring-4 ring-blue-50/50 mb-3">
            <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Verify Code
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xs leading-relaxed">
            Enter the 6-digit verification code sent to your email to continue.
          </p>
        </div>

        {/* OTP Input Form */}
        <form onSubmit={handleContinue} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={(value) => setOtpValue(value)}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            >
              <InputOTPGroup className="gap-2 sm:gap-2.5">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="w-10 h-12 sm:w-12 sm:h-13 text-base sm:text-lg font-bold rounded-xl border border-slate-200 bg-slate-50/60 data-[active=true]:border-[#0057DC] data-[active=true]:ring-4 data-[active=true]:ring-blue-500/10 data-[active=true]:bg-white transition-all shadow-xs"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Timer / Resend */}
          <div className="text-center text-xs">
            {timer > 0 ? (
              <p className="text-slate-500">
                Resend code in{" "}
                <span className="font-semibold text-slate-800">
                  0:{timer < 10 ? `0${timer}` : timer}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="inline-flex items-center gap-1.5 font-medium text-[#0057DC] hover:text-[#0047b3] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend Code</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={otpValue.length < 6}
            className="w-full bg-[#FFC823] hover:bg-[#F5BD18] active:scale-[0.99] text-slate-950 font-semibold h-11 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Verify & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-1">
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
