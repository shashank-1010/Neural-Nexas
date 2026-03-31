import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let colorClass = "bg-gray-100 text-gray-800";
  
  switch (status.toLowerCase()) {
    case "pending":
      colorClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      break;
    case "confirmed":
    case "processing":
      colorClass = "bg-blue-100 text-blue-800 hover:bg-blue-200";
      break;
    case "completed":
    case "delivered":
      colorClass = "bg-green-100 text-green-800 hover:bg-green-200";
      break;
    case "cancelled":
      colorClass = "bg-red-100 text-red-800 hover:bg-red-200";
      break;
    case "out-for-delivery":
      colorClass = "bg-purple-100 text-purple-800 hover:bg-purple-200";
      break;
  }

  return (
    <Badge className={`${colorClass} font-medium border-0 capitalize shadow-none`}>
      {status.replace(/-/g, ' ')}
    </Badge>
  );
}
