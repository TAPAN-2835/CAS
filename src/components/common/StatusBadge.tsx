import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusType = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();

  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let label = status;

  switch (normalizedStatus) {
    case "APPROVED":
      variant = "default"; // or a custom green if configured, default is usually primary
      label = "Approved";
      break;
    case "PENDING":
      variant = "secondary";
      label = "Pending Approval";
      break;
    case "REJECTED":
      variant = "destructive";
      label = "Rejected";
      break;
    case "DRAFT":
      variant = "outline";
      label = "Draft";
      break;
    default:
      variant = "secondary";
      label = status;
  }

  // Custom coloring override if needed, though shadcn variants are preferred for consistency
  // If we want specific colors (e.g. green for approved), we might need custom classes
  const colorClasses = {
    APPROVED: "bg-green-600 hover:bg-green-700 border-transparent",
    PENDING: "bg-yellow-500 hover:bg-yellow-600 border-transparent text-white",
    REJECTED: "bg-red-600 hover:bg-red-700 border-transparent",
    DRAFT: "bg-gray-200 text-gray-800 hover:bg-gray-300 border-transparent",
  };

  const specificColor = colorClasses[normalizedStatus as keyof typeof colorClasses];

  return (
    <Badge 
      variant={variant} 
      className={cn("capitalize whitespace-nowrap", specificColor, className)}
    >
      {label}
    </Badge>
  );
}
