
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ReportCard from "@/components/ReportCard";
import { Report, fetchReports } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, Loader } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import { Link } from "react-router-dom";

type SortOption = "newest" | "mostUpvoted" | "mostComments";

const Index = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [activeView, setActiveView] = useState("list");

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await fetchReports();
        setReports(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load reports:", err);
        setError("Failed to load reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // Sort reports based on selected option
  const sortedReports = [...reports].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.submissionTimestamp).getTime() - new Date(a.submissionTimestamp).getTime();
    } else if (sortBy === "mostUpvoted") {
      return b.upvoteCount - a.upvoteCount;
    } else {
      return b.commentCount - a.commentCount;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto p-4 py-6">
          {/* Hero Section */}
          <section className="mb-8 bg-gradient-to-br from-primary/90 to-info/90 text-white p-8 rounded-lg shadow-md">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src="/lovable-uploads/37281d79-2c30-4ca8-be5d-9335a591c41c.png" 
                  alt="San Pedro EcoWatch Logo" 
                  className="h-24"
                />
              </div>
              <p className="text-lg mb-6">Help keep our city clean, safe, and environmentally sustainable by reporting issues in your barangay.</p>
              <Link to="/submit">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Report an Issue
                </Button>
              </Link>
            </div>
          </section>
          
          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Community Reports</h2>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <ListFilter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="mostUpvoted">Most Upvoted</SelectItem>
                    <SelectItem value="mostComments">Most Comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Tabs value={activeView} onValueChange={setActiveView} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                  <TabsTrigger value="list">List</TabsTrigger>
                  <TabsTrigger value="map">Map</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-md">
              {error}
            </div>
          ) : (
            <div className="animate-fade-in">
              <Tabs value={activeView}>
                <TabsContent value="list" className="mt-0">
                  {reports.length === 0 ? (
                    <div className="text-center py-20">
                      <p className="text-lg text-muted-foreground mb-4">No reports have been submitted yet.</p>
                      <Link to="/submit">
                        <Button>Be the first to report an issue</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedReports.map((report) => (
                        <ReportCard key={report.id} report={report} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="map" className="mt-0">
                  <div className="bg-card rounded-lg border overflow-hidden h-[500px] relative">
                    <LocationPicker
                      onLocationSelected={() => {}}
                      readOnly={true}
                      className="h-full"
                    />
                    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                      <h3 className="font-medium mb-2">Map Legend</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                          <span>Reported</span>
                        </li>
                        <li className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                          <span>Verified</span>
                        </li>
                        <li className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
                          <span>Action Taken</span>
                        </li>
                        <li className="flex items-center">
                          <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                          <span>Resolved</span>
                        </li>
                      </ul>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg text-xs">
                      This is a demonstration of the map view. In a production environment, this would display pins for all reported issues.
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
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

export default Index;
