/**
 * Query Keys Factory
 *
 * Centralized query key management for type safety and consistency.
 * Uses hierarchical structure for easy cache invalidation.
 */

import { IUserFilterableFields } from "@/types/users";

export const queryKeys = {
  /**
   * Authentication related queries
   */
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
    status: () => [...queryKeys.auth.all, "status"] as const,
  },

  /**
   * Dashboard related queries
   */
  dashboard: {
    all: ["dashboard"] as const,
    section: (slug: string) =>
      [...queryKeys.dashboard.all, "section", slug] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    revenue: (params?: { year?: number; month?: number }) =>
      [...queryKeys.dashboard.all, "revenue", params] as const,
    subscriptions: (params?: { year?: number; month?: number }) =>
      [...queryKeys.dashboard.all, "subscriptions", params] as const,
    userStats: (params?: { year?: number; month?: number }) =>
      [...queryKeys.dashboard.all, "userStats", params] as const,
    users: (params?: IUserFilterableFields) =>
      [...queryKeys.dashboard.all, "users", params] as const,
    verifyRequests: (params?: IUserFilterableFields) =>
      [...queryKeys.dashboard.all, "verifyRequests", params] as const,
    detail: (id: string) => [...queryKeys.dashboard.all, "detail", id] as const,
    updateStatus: (id: string) =>
      [...queryKeys.dashboard.all, "updateStatus", id] as const,
    categories: () => [...queryKeys.dashboard.all, "categories"] as const,
    // users: () => [...queryKeys.dashboard.all, "users"] as const,
    public: (type: string) =>
      [...queryKeys.dashboard.all, "public", type] as const,
    faq: () => [...queryKeys.dashboard.all, "faq"] as const,
    allSupportMessage: (slug: string) =>
      [...queryKeys.dashboard.all, "supportMessage", slug] as const,
    supportMessage: () =>
      [...queryKeys.dashboard.all, "supportMessage"] as const,
    clientReview: (slug: string) =>
      [...queryKeys.dashboard.all, slug, "clientReview"] as const,
    package: () => [...queryKeys.dashboard.all, "package"] as const,
    coupon: () => [...queryKeys.dashboard.all, "coupon"] as const,
  },

  /**
   * Employer related queries
   */
  employers: {
    all: ["employers"] as const,
    list: (filters?: any) =>
      [...queryKeys.employers.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.employers.all, "detail", id] as const,
  },

  /**
   * Worker related queries
   */
  workers: {
    all: ["workers"] as const,
    list: (filters?: any) =>
      [...queryKeys.workers.all, "list", filters] as const,
    detail: (id: string) => [...queryKeys.workers.all, "detail", id] as const,
  },

  /**
   * Category related queries
   */
  categories: {
    all: ["categories"] as const,
    list: () => [...queryKeys.categories.all, "list"] as const,
    detail: (id: string) =>
      [...queryKeys.categories.all, "detail", id] as const,
  },
} as const;

/**
 * Type helper to extract query key type
 */
export type QueryKeys = typeof queryKeys;
