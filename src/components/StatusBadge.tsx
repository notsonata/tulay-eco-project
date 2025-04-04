
import { cn } from "@/lib/utils";
import { ReportStatus } from "@/lib/data";

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  let colorClasses = '';
  
  switch (status) {
    case 'Reported':
      colorClasses = 'bg-gray-100 text-gray-800';
      break;
    case 'Verified':
      colorClasses = 'bg-blue-100 text-blue-800';
      break;
    case 'Invalid/Spam':
      colorClasses = 'bg-red-100 text-red-800';
      break;
    case 'Action Taken':
      colorClasses = 'bg-amber-100 text-amber-800';
      break;
    case 'Resolved':
      colorClasses = 'bg-green-100 text-green-800';
      break;
    default:
      colorClasses = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span 
      className={cn(
        "inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium", 
        colorClasses,
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
