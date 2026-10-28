"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetProfile } from "@/lib/query/hooks";
import { getImageUrl } from "@/utils/image";
import Image from "next/image";

const authRoutes = [
  "/login",
  "/forgot-password",
  "/new-password",
  "/verify-otp",
];

export default function Header() {
  const pathname = usePathname();
  const isAuthPage = authRoutes.includes(pathname);

  // Fetch admin profile
  const { data: profile } = useGetProfile();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [profile?.profile]);

  if (isAuthPage) return null;

  const avatarSrc =
    !imgError && profile?.profile
      ? getImageUrl(profile.profile)
      : "/user-avatar.png";

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200/80 px-8 h-[68px] z-50">
      {/* Left side greeting / status */}
      <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
        <span>Welcome back,</span>
        <span className="font-semibold text-gray-800">
          {profile?.name || "Admin"}
        </span>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notification Bell */}
        <Link
          href="/notification"
          className="relative p-2.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100/80 rounded-full transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
        </Link>

        {/* Subtle divider */}
        <div className="h-6 w-px bg-gray-200" />

        {/* Profile pill */}
        <Link
          href="/profile"
          className="flex items-center gap-3 py-1 px-2 rounded-xl hover:bg-gray-100/70 transition-colors group cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all">
            <Image
              src={avatarSrc}
              alt={profile?.name || "Admin Avatar"}
              fill
              sizes="36px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          </div>
          <div className="text-left leading-tight hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {profile?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-400 capitalize font-medium">
              {profile?.role || "Administrator"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
