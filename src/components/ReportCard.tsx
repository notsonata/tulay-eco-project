
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Report } from "@/lib/data";
import StatusBadge from "./StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { ThumbsUp, MessageSquare, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface ReportCardProps {
  report: Report;
}

const ReportCard = ({ report }: ReportCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(report.submissionTimestamp), { 
    addSuffix: true 
  });
  
  return (
    <Link to={`/report/${report.id}`}>
      <Card className="hover-grow hover-glow overflow-hidden cursor-pointer h-full flex flex-col">
        {report.images.length > 0 && (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={report.images[0].url} 
              alt={report.issueCategory}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
        <CardContent className="pt-5 pb-2 flex-1">
          <div className="flex items-center justify-between mb-2">
            <StatusBadge status={report.status} />
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          <h3 className="font-semibold text-lg mb-1">{report.issueCategory}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{report.issueDescription}</p>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{report.reporterBarangay}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3 pb-3">
          <div className="flex justify-between w-full text-sm">
            <div className="flex items-center space-x-1">
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              <span>{report.upvoteCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span>{report.commentCount}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ReportCard;
