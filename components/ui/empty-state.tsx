import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";

export interface EmptyStateProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  variant?: "default" | "card" | "table" | "dashed" | "compact";
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  iconClassName,
  variant = "card",
  children,
}: EmptyStateProps) {
  const containerVariants = {
    default: "py-12 px-6 text-center flex flex-col items-center justify-center",
    card: "bg-white border border-slate-200/80 rounded-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center shadow-xs",
    table: "py-12 md:py-16 px-6 text-center flex flex-col items-center justify-center",
    dashed: "border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center",
    compact: "p-6 text-center flex flex-col items-center justify-center",
  };

  return (
    <div
      className={cn(
        containerVariants[variant] || containerVariants.card,
        "w-full transition-all animate-in fade-in-50 duration-300",
        className
      )}
    >
      {/* Icon with modern multi-layer soft ring */}
      <div className="relative mb-4 flex items-center justify-center">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0057DC] ring-8 ring-blue-50/60 shadow-xs">
          <Icon className={cn("w-7 h-7 md:w-8 md:h-8 stroke-[1.75]", iconClassName)} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base md:text-lg font-semibold text-slate-800 tracking-tight">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-1.5 text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {/* Action / CTA */}
      {action && <div className="mt-5 flex items-center justify-center gap-3">{action}</div>}

      {/* Additional custom children if needed */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export interface EmptyTableRowProps extends Omit<EmptyStateProps, "variant"> {
  colSpan: number;
}

export function EmptyTableRow({
  colSpan,
  icon,
  title,
  description,
  action,
  className,
  iconClassName,
  children,
}: EmptyTableRowProps) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="p-0">
        <EmptyState
          variant="table"
          icon={icon}
          title={title}
          description={description}
          action={action}
          className={className}
          iconClassName={iconClassName}
        >
          {children}
        </EmptyState>
      </TableCell>
    </TableRow>
  );
}

export default EmptyState;
