import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "danger" | "success";
  delay?: number;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = "default",
  delay = 0,
}: StatCardProps) {
  const variantStyles = {
    default: {
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      valueColor: "text-foreground",
    },
    danger: {
      iconBg: "bg-red-50 dark:bg-red-950/40",
      iconColor: "text-red-500 dark:text-red-400",
      valueColor: "text-red-500 dark:text-red-400",
    },
    success: {
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      valueColor: "text-emerald-600 dark:text-emerald-400",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className={`text-3xl font-bold ${styles.valueColor} mt-2`}>{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}>
          <Icon className={`h-6 w-6 ${styles.iconColor}`} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
