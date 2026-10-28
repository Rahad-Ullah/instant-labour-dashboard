"use client";

import React from "react";
import {
  LayoutDashboard,
  Layers,
  Home,
  Info,
  Mail,
  Package,
  Lock,
  ShieldCheck,
  ScrollText,
  Handshake,
  Headset,
  CircleHelp,
  BadgeCheck,
  LogOut,
  UsersRound,
  BriefcaseBusiness,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogout } from "@/lib/query/hooks";

export const sidebarMenu = [
  // 1. Dashboard Overview
  { id: 1, label: "Overview", icon: LayoutDashboard, path: "/" },

  // 2. User & Verification Management
  {
    id: 2,
    label: "Employers",
    icon: BriefcaseBusiness,
    path: "/all-employe-list",
  },
  {
    id: 3,
    label: "Workers",
    icon: UsersRound,
    path: "/all-worker",
  },
  {
    id: 4,
    label: "Verify Requests",
    icon: BadgeCheck,
    path: "/verify-request",
  },

  // 3. Marketplace & Monetization
  {
    id: 5,
    label: "Categories",
    icon: Layers,
    path: "/all-category",
  },
  {
    id: 6,
    label: "Subscription Packages",
    icon: Package,
    path: "/subscription-packages",
  },

  // 4. Website CMS & Landing Pages
  {
    id: 7,
    label: "Home Page",
    icon: Home,
    path: "/home-page",
  },
  { id: 8, label: "About Us", icon: Info, path: "/about-us" },
  {
    id: 9,
    label: "Contact Page",
    icon: Mail,
    path: "/contact-us",
  },
  {
    id: 10,
    label: "Clients",
    icon: Handshake,
    path: "/our-clients",
  },

  // 5. Support & FAQs
  {
    id: 11,
    label: "Support",
    icon: Headset,
    path: "/support",
  },
  {
    id: 12,
    label: "FAQs",
    icon: CircleHelp,
    path: "/faq",
  },

  // 6. Legal & Policies
  {
    id: 13,
    label: "Privacy Policy",
    icon: ShieldCheck,
    path: "/privacy-policy",
  },
  {
    id: 14,
    label: "Terms & Conditions",
    icon: ScrollText,
    path: "/terms-condition",
  },

  // 7. Account Settings & Exit
  {
    id: 15,
    label: "Change Password",
    icon: Lock,
    path: "/change-password",
  },
  { id: 16, label: "Logout", icon: LogOut, path: "/logout", isLogout: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="">
      <Link href="/">
        <h1 className="text-[#0057DC] text-xl font-semibold text-center my-5 sticky top-0">
          Instantlabour
        </h1>
      </Link>
      <div className="h-[calc(100vh-100px)] overflow-y-auto">
        <div
          className=" bg-white p-4 space-y-1 overflow-y-scroll text-sm hide-scrollbar"
          style={{ height: "calc(100vh-30px)" }}
        >
          {sidebarMenu.map((item) => {
            const isActive = pathname === item.path;
            const dubleActive =
              item.path === "/all-worker" && pathname === "/worker-details";
            const Icon = item.icon;

            // Handle logout separately
            if (item.isLogout) {
              return (
                <div key={item.id} className="pt-2 mt-2 border-t border-gray-100">
                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 border border-red-100 transition-all duration-200 rounded-lg font-medium group"
                  >
                    <Icon className="w-5 h-5 shrink-0 text-red-500 group-hover:text-red-700 transition-colors" />
                    <span className="truncate">{item.label}</span>
                  </div>
                </div>
              );
            }

            return (
              <Link key={item.id} href={item.path} className="">
                <div
                  className={`flex items-center gap-3 px-4 my-1 py-2.5 cursor-pointer rounded-lg transition-colors ${
                    isActive || dubleActive
                      ? "bg-blue-600 text-white font-medium shadow-sm"
                      : "text-gray-800 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
