
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatusBadge from "@/components/StatusBadge";
import { 
  Report, 
  ReportStatus, 
  fetchReports, 
  updateReportStatus, 
  deleteReport 
} from "@/lib/data";
import { 
  Search, 
  LogOut,
  ThumbsUp,
  MessageSquare,
  Trash2,
  Filter,
  Check,
  Eye,
  AlertTriangle,
  CalendarClock,
  CheckCircle,
  Ban,
  Leaf,
  Loader,
  BarChart3
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

type FilterType = "all" | "reported" | "verified" | "action-taken" | "resolved" | "spam";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "most-upvotes">("newest");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Check if user is admin
  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [navigate]);
  
  // Load reports
  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await fetchReports();
        setReports(data);
      } catch (err) {
        console.error("Failed to load reports:", err);
        toast({
          title: "Error",
          description: "Failed to load reports. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadReports();
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("isAdmin");
    navigate("/admin");
  };
  
  // Handle status change
  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      const updatedReport = await updateReportStatus(reportId, newStatus);
      
      // Update reports list
      setReports(reports.map(report => 
        report.id === reportId ? updatedReport : report
      ));
      
      toast({
        title: "Status Updated",
        description: `Report status updated to "${newStatus}"`,
      });
      
    } catch (err) {
      console.error("Failed to update status:", err);
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    }
  };
  
  // Handle delete report
  const handleDeleteReport = async () => {
    if (!selectedReport) return;
    
    try {
      await deleteReport(selectedReport.id);
      
      // Remove from list
      setReports(reports.filter(report => report.id !== selectedReport.id));
      
      setIsDeleteDialogOpen(false);
      setSelectedReport(null);
      
      toast({
        title: "Report Deleted",
        description: "The report has been permanently deleted",
      });
      
    } catch (err) {
      console.error("Failed to delete report:", err);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    }
  };
  
  // Filter and sort reports
  const filteredReports = reports.filter(report => {
    // Apply status filter
    if (filterType !== "all") {
      if (filterType === "reported" && report.status !== "Reported") return false;
      if (filterType === "verified" && report.status !== "Verified") return false;
      if (filterType === "action-taken" && report.status !== "Action Taken") return false;
      if (filterType === "resolved" && report.status !== "Resolved") return false;
      if (filterType === "spam" && report.status !== "Invalid/Spam") return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        report.reporterName.toLowerCase().includes(searchLower) ||
        report.reporterBarangay.toLowerCase().includes(searchLower) ||
        report.issueCategory.toLowerCase().includes(searchLower) ||
        report.issueDescription.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  }).sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.submissionTimestamp).getTime() - new Date(a.submissionTimestamp).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.submissionTimestamp).getTime() - new Date(b.submissionTimestamp).getTime();
    } else {
      return b.upvoteCount - a.upvoteCount;
    }
  });
  
  // Get stats
  const totalReports = reports.length;
  const reportedCount = reports.filter(r => r.status === "Reported").length;
  const verifiedCount = reports.filter(r => r.status === "Verified").length;
  const actionTakenCount = reports.filter(r => r.status === "Action Taken").length;
  const resolvedCount = reports.filter(r => r.status === "Resolved").length;
  const spamCount = reports.filter(r => r.status === "Invalid/Spam").length;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6" />
              <h1 className="text-xl font-bold">San Pedro EcoWatch Admin</h1>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground">
                View Public Site
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground border-primary-foreground/30"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage environmental reports submitted by the public</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 pb-4 text-center">
              <BarChart3 className="mx-auto h-6 w-6 mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{totalReports}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50">
            <CardContent className="pt-6 pb-4 text-center">
              <AlertTriangle className="mx-auto h-6 w-6 mb-2 text-yellow-600" />
              <p className="text-2xl font-bold text-yellow-800">{reportedCount}</p>
              <p className="text-sm text-yellow-700">Reported</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50">
            <CardContent className="pt-6 pb-4 text-center">
              <Eye className="mx-auto h-6 w-6 mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-800">{verifiedCount}</p>
              <p className="text-sm text-blue-700">Verified</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50">
            <CardContent className="pt-6 pb-4 text-center">
              <CalendarClock className="mx-auto h-6 w-6 mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-amber-800">{actionTakenCount}</p>
              <p className="text-sm text-amber-700">Action Taken</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="pt-6 pb-4 text-center">
              <CheckCircle className="mx-auto h-6 w-6 mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-800">{resolvedCount}</p>
              <p className="text-sm text-green-700">Resolved</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50">
            <CardContent className="pt-6 pb-4 text-center">
              <Ban className="mx-auto h-6 w-6 mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-800">{spamCount}</p>
              <p className="text-sm text-red-700">Invalid/Spam</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search reports..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={filterType} onValueChange={(val) => setFilterType(val as FilterType)}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="reported">Reported</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="action-taken">Action Taken</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="spam">Invalid/Spam</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={(val) => setSortBy(val as "newest" | "oldest" | "most-upvotes")}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="most-upvotes">Most Upvotes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reports found matching your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Issue</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Reporter</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Barangay</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Engagement</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => {
                      const timeAgo = formatDistanceToNow(new Date(report.submissionTimestamp), {
                        addSuffix: true,
                      });
                      
                      return (
                        <tr key={report.id} className="border-b hover:bg-muted/30">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium">{report.issueCategory}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {report.issueDescription}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm">{report.reporterName}</p>
                            <p className="text-xs text-muted-foreground">{report.reporterPhoneNumber}</p>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {report.reporterBarangay}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {timeAgo}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge status={report.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-3 text-sm">
                              <div className="flex items-center">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                <span>{report.upvoteCount}</span>
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                <span>{report.commentCount}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Tabs defaultValue={report.status} onValueChange={(value) => handleStatusChange(report.id, value as ReportStatus)}>
                                <TabsList className="bg-muted/50 h-8">
                                  <TabsTrigger value="Reported" className="h-7 px-2 text-xs">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">Reported</span>
                                  </TabsTrigger>
                                  <TabsTrigger value="Verified" className="h-7 px-2 text-xs">
                                    <Eye className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">Verified</span>
                                  </TabsTrigger>
                                  <TabsTrigger value="Action Taken" className="h-7 px-2 text-xs">
                                    <CalendarClock className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">Action</span>
                                  </TabsTrigger>
                                  <TabsTrigger value="Resolved" className="h-7 px-2 text-xs">
                                    <Check className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">Resolved</span>
                                  </TabsTrigger>
                                  <TabsTrigger value="Invalid/Spam" className="h-7 px-2 text-xs">
                                    <Ban className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">Spam</span>
                                  </TabsTrigger>
                                </TabsList>
                              </Tabs>
                              
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8"
                                asChild
                              >
                                <Link to={`/report/${report.id}`} target="_blank">View</Link>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the report
              and all associated comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReport} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
