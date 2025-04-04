
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import CommentSection from "@/components/CommentSection";
import LocationPicker from "@/components/LocationPicker";
import ImageUpload from "@/components/ImageUpload";
import { 
  Report, 
  Comment, 
  Barangay,
  fetchReportById, 
  fetchCommentsByReportId, 
  upvoteReport, 
  createComment
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, ArrowLeft, MessageCircle, Calendar, MapPin, Clock, AlertCircle, Loader } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upvoting, setUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch report details
        const reportData = await fetchReportById(id);
        setReport(reportData);
        
        // Fetch comments
        const commentsData = await fetchCommentsByReportId(id);
        setComments(commentsData);
        
        setError(null);
      } catch (err) {
        console.error("Failed to load report details:", err);
        setError("Failed to load report details. It may have been removed or is unavailable.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);
  
  const handleUpvote = async () => {
    if (!report || hasUpvoted || upvoting) return;
    
    try {
      setUpvoting(true);
      const updatedReport = await upvoteReport(report.id);
      setReport(updatedReport);
      setHasUpvoted(true);
      
      // Store upvote in localStorage to prevent multiple upvotes
      localStorage.setItem(`upvoted_${report.id}`, "true");
      
      toast({
        title: "Thank you!",
        description: "Your upvote has been recorded.",
      });
    } catch (err) {
      console.error("Failed to upvote:", err);
      toast({
        title: "Error",
        description: "Failed to record your upvote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUpvoting(false);
    }
  };
  
  const handleAddComment = async (commentData: { 
    reportId: string; 
    commenterName: string; 
    commenterPhoneNumber: string; 
    commenterBarangay: Barangay; 
    commentText: string;
  }) => {
    try {
      await createComment(commentData);
      
      // Refresh comments
      const updatedComments = await fetchCommentsByReportId(commentData.reportId);
      setComments(updatedComments);
      
      // Refresh report to get updated comment count
      const updatedReport = await fetchReportById(commentData.reportId);
      setReport(updatedReport);
      
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully.",
      });
    } catch (err) {
      console.error("Failed to add comment:", err);
      toast({
        title: "Error",
        description: "Failed to add your comment. Please try again.",
        variant: "destructive"
      });
      throw err; // Re-throw to handle in the component
    }
  };
  
  // Check if user has previously upvoted this report
  useEffect(() => {
    if (report) {
      const hasUpvotedBefore = localStorage.getItem(`upvoted_${report.id}`) === "true";
      setHasUpvoted(hasUpvotedBefore);
    }
  }, [report]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }
  
  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Reports
            </Link>
            
            <Card>
              <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Link to="/">
                  <Button>Return to Reports</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }
  
  const formattedDate = format(new Date(report.submissionTimestamp), "MMMM d, yyyy");
  const timeAgo = formatDistanceToNow(new Date(report.submissionTimestamp), { addSuffix: true });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Reports
          </Link>
          
          {/* Report Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{report.issueCategory}</h1>
              <StatusBadge status={report.status} className="text-sm py-1 px-3" />
            </div>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{timeAgo}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{report.reporterBarangay}</span>
              </div>
            </div>
          </div>
          
          {/* Report Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">Issue Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{report.issueDescription}</p>
                </CardContent>
              </Card>
              
              {/* Evidence Images */}
              {report.images.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-3">Evidence</h2>
                    <ImageUpload
                      onImagesSelected={() => {}}
                      previewUrls={report.images.map(img => img.url)}
                      readOnly={true}
                    />
                  </CardContent>
                </Card>
              )}
              
              {/* Upvote Section */}
              <Card>
                <CardContent className="pt-6 pb-6">
                  <div className="flex flex-col items-center">
                    <p className="text-center mb-2">Is this issue affecting you too?</p>
                    <Button
                      variant={hasUpvoted ? "secondary" : "default"}
                      size="lg"
                      className="flex items-center gap-2 min-w-[180px]"
                      onClick={handleUpvote}
                      disabled={hasUpvoted || upvoting}
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span>{hasUpvoted ? "Upvoted" : "I saw that too!"}</span>
                      <span className="bg-white bg-opacity-20 py-0.5 px-2 rounded-full">
                        {report.upvoteCount}
                      </span>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      {hasUpvoted 
                        ? "Thank you for confirming this issue" 
                        : "Help prioritize this issue by upvoting"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Location Map */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">Location</h2>
                  <LocationPicker
                    initialLat={report.latitude}
                    initialLng={report.longitude}
                    onLocationSelected={() => {}}
                    readOnly={true}
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                  </p>
                </CardContent>
              </Card>
              
              {/* Report Stats */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">Report Information</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium">{report.status}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground">Reported by</p>
                      <p className="font-medium">{report.reporterName}</p>
                      <p className="text-xs text-muted-foreground">{report.reporterBarangay}</p>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ThumbsUp className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{report.upvoteCount} upvotes</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{report.commentCount} comments</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Comments Section */}
          <Card>
            <CardContent className="pt-6">
              <CommentSection 
                comments={comments} 
                reportId={report.id} 
                onAddComment={handleAddComment}
              />
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} San Pedro EcoWatch - A hackathon project for environmental monitoring in San Pedro, Laguna
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ReportDetail;
