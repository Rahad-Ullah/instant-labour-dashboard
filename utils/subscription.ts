import { IUserSubscriptions } from "@/types/users";

/**
 * Formats a subscription date which could be a Unix timestamp in seconds (Stripe),
 * milliseconds, an ISO date string, or a Date object.
 */
export function formatSubscriptionDate(
  dateVal?: number | string | Date | null
): string {
  if (dateVal === undefined || dateVal === null || dateVal === "") {
    return "N/A";
  }

  try {
    let date: Date;

    if (typeof dateVal === "number") {
      // If it's a Unix timestamp in seconds (e.g. Stripe timestamps < 100 billion)
      date = new Date(dateVal < 100_000_000_000 ? dateVal * 1000 : dateVal);
    } else if (typeof dateVal === "string") {
      // Check if it's a numeric string (e.g., "1735689600")
      const parsedNum = Number(dateVal);
      if (!isNaN(parsedNum) && dateVal.trim() !== "") {
        date = new Date(
          parsedNum < 100_000_000_000 ? parsedNum * 1000 : parsedNum
        );
      } else {
        date = new Date(dateVal);
      }
    } else {
      date = new Date(dateVal);
    }

    if (isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

/**
 * Returns the resolved plan name from subscription data.
 */
export function getSubscriptionPlanName(
  sub?: IUserSubscriptions | null
): string | null {
  if (!sub) return null;
  if (sub.packageType && typeof sub.packageType === "string") {
    return sub.packageType;
  }
  if (
    sub.packageId &&
    typeof sub.packageId === "object" &&
    sub.packageId?.type
  ) {
    return sub.packageId.type;
  }
  return null;
}

/**
 * Returns a display string for quotas (e.g. -1 means Unlimited).
 */
export function getQuotaDisplay(quota?: number | null): string {
  if (quota === undefined || quota === null) return "0";
  if (quota === -1) return "Unlimited";
  return String(quota);
}
