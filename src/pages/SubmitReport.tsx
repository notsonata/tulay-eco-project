
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserInfoForm from "@/components/UserInfoForm";
import LocationPicker from "@/components/LocationPicker";
import ImageUpload from "@/components/ImageUpload";
import PhoneVerification from "@/components/PhoneVerification";
import { Barangay, ISSUE_CATEGORIES, IssueCategory, createReport } from "@/lib/data";
import { ArrowLeft, Camera, MapPin, AlertTriangle, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const SubmitReport = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [userInfo, setUserInfo] = useState<{
    name: string;
    phoneNumber: string;
    barangay: Barangay;
  } | null>(null);
  
  // Phone verification
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  
  const [issueCategory, setIssueCategory] = useState<IssueCategory | "">("");
  const [issueDescription, setIssueDescription] = useState("");
  
  // Location data
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locationSelected, setLocationSelected] = useState(false);
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  
  // Images
  const [images, setImages] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");
  
  const handleUserInfoSubmit = (info: {name: string; phoneNumber: string; barangay: Barangay}) => {
    setUserInfo(info);
    // Show phone verification step
    setShowVerification(true);
  };
  
  const handlePhoneVerified = () => {
    setPhoneVerified(true);
    setShowVerification(false);
    // Continue to next step
    setCurrentStep(2);
  };
  
  const handleIssueDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!issueCategory) {
      toast({
        title: "Error",
        description: "Please select an issue category",
        variant: "destructive",
      });
      return;
    }
    
    if (!issueDescription.trim()) {
      toast({
        title: "Error",
        description: "Please provide a description of the issue",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep(3);
  };
  
  const handleLocationSubmit = () => {
    if (!locationSelected) {
      toast({
        title: "Error",
        description: "Please select a location on the map",
        variant: "destructive",
      });
      return;
    }
    
    if (!street.trim()) {
      toast({
        title: "Error",
        description: "Please enter the street name",
        variant: "destructive",
      });
      return;
    }
    
    if (!landmark.trim()) {
      toast({
        title: "Error",
        description: "Please provide a nearby landmark",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep(4);
  };
  
  const handleImagesSubmit = async () => {
    setImageError("");
    
    // Check if any images were uploaded (now required)
    if (images.length === 0) {
      setImageError("Please upload at least one photo as evidence");
      return;
    }
    
    // Check file sizes
    for (const file of images) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setImageError("One or more images exceed the 5MB size limit");
        return;
      }
    }
    
    // Submit the complete report
    if (!userInfo) return;
    
    try {
      setLoading(true);
      
      // In a real app, we would upload images to storage and get URLs back
      // For this demo, we'll create fake image URLs based on the file names
      const mockImageUrls = images.map(file => ({
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file)
      }));
      
      await createReport({
        reporterName: userInfo.name,
        reporterPhoneNumber: userInfo.phoneNumber,
        reporterBarangay: userInfo.barangay,
        issueDescription,
        issueCategory: issueCategory as IssueCategory,
        latitude,
        longitude,
        images: mockImageUrls,
        street,
        landmark,
      });
      
      // Show success and redirect
      toast({
        title: "Report Submitted Successfully",
        description: "Thank you for helping keep San Pedro clean and green!",
        variant: "default",
      });
      
      // Redirect to home/reports page
      navigate("/");
      
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationSelected(true);
  };
  
  const handleImagesSelected = (selectedImages: File[]) => {
    setImages(prevImages => [...prevImages, ...selectedImages]);
  };

  const handleSearchLocation = () => {
    if (!userInfo || !street.trim()) return;
    
    // In a real app, this would use a geocoding service with the street and barangay
    // For demo purposes, we'll just use OpenStreetMap's nominatim service for display purposes
    
    // For Philippines addresses typically include the barangay, city, and province
    const address = `${street}, ${userInfo.barangay} San Pedro, Laguna, Philippines`;
    
    // Display toast to indicate search is happening
    toast({
      title: "Searching Location",
      description: `Looking for ${address}`,
    });
    
    // In a real implementation, you would call a geocoding API here
    // and update the map position based on the results
    
    // For this demo, we'll simulate a successful search after a delay
    setTimeout(() => {
      // These are just sample coordinates near San Pedro, Laguna
      // In a real app, these would come from the geocoding API
      const newLat = 14.35 + (Math.random() * 0.02);
      const newLng = 121.05 + (Math.random() * 0.02);
      
      // Update map position
      setLatitude(newLat);
      setLongitude(newLng);
      setLocationSelected(true);
      
      toast({
        title: "Location Found",
        description: "Map has been updated to show the approximate location.",
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <Link to="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Reports
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">Report an Environmental Issue</h1>
          <p className="text-muted-foreground mt-1">Help make San Pedro cleaner and greener by reporting environmental issues in your area.</p>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className="text-xs hidden sm:inline">Your Info</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${currentStep > 1 ? 'bg-primary' : 'bg-muted'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <span className="text-xs hidden sm:inline">Issue Details</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${currentStep > 2 ? 'bg-primary' : 'bg-muted'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <span className="text-xs hidden sm:inline">Location</span>
            </div>
            
            <div className={`flex-1 h-1 mx-2 ${currentStep > 3 ? 'bg-primary' : 'bg-muted'}`}></div>
            
            <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center mb-1 ${currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                4
              </div>
              <span className="text-xs hidden sm:inline">Evidence</span>
            </div>
          </div>
        </div>
        
        {/* Form Steps */}
        <div className="max-w-3xl mx-auto">
          <Card className="border shadow-sm">
            <CardContent className="pt-6">
              {/* Step 1: Reporter Info */}
              {currentStep === 1 && !showVerification && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Your Information</h2>
                    <p className="text-sm text-muted-foreground">We need your basic information to verify your report</p>
                  </div>
                  
                  <UserInfoForm 
                    onSubmit={handleUserInfoSubmit}
                    buttonText="Continue to Verification"
                  />
                </div>
              )}

              {/* Phone Verification Step */}
              {currentStep === 1 && showVerification && userInfo && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Phone Verification</h2>
                    <p className="text-sm text-muted-foreground">Please verify your phone number to continue</p>
                  </div>
                  
                  <PhoneVerification 
                    phoneNumber={userInfo.phoneNumber}
                    onVerified={handlePhoneVerified}
                    onCancel={() => setShowVerification(false)}
                  />
                </div>
              )}
              
              {/* Step 2: Issue Details */}
              {currentStep === 2 && (
                <form onSubmit={handleIssueDetailsSubmit} className="space-y-4 animate-fade-in">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Issue Details</h2>
                    <p className="text-sm text-muted-foreground">Tell us about the environmental issue you want to report</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category">Issue Category *</Label>
                      <Select value={issueCategory} onValueChange={(value) => setIssueCategory(value as IssueCategory)}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select issue category" />
                        </SelectTrigger>
                        <SelectContent>
                          {ISSUE_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Issue Description *</Label>
                      <Textarea 
                        id="description"
                        placeholder="Please describe the issue in detail..."
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        className="min-h-32"
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                      >
                        Back
                      </Button>
                      <Button type="submit">
                        Continue to Location
                      </Button>
                    </div>
                  </div>
                </form>
              )}
              
              {/* Step 3: Location */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Issue Location</h2>
                    <p className="text-sm text-muted-foreground">Please provide the location details of the issue</p>
                  </div>
                  
                  <div className="space-y-6">
                    {userInfo && (
                      <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                        <div>
                          <Label htmlFor="street">Street Name *</Label>
                          <Input
                            id="street"
                            placeholder="Enter street name (e.g., A. Mabini Street)"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="landmark">Nearby Landmark *</Label>
                          <Input
                            id="landmark"
                            placeholder="Enter a nearby landmark (e.g., San Pedro Elementary School)"
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="barangay">Barangay</Label>
                          <Input
                            id="barangay"
                            value={userInfo.barangay}
                            disabled
                            className="bg-muted"
                          />
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="secondary"
                          className="w-full"
                          onClick={handleSearchLocation}
                          disabled={!street}
                        >
                          Search Location
                        </Button>
                      </div>
                    )}
                    
                    <div className="bg-card rounded-lg overflow-hidden">
                      <LocationPicker 
                        onLocationSelected={handleLocationSelect}
                        initialLat={latitude || undefined}
                        initialLng={longitude || undefined}
                      />
                      
                      {locationSelected && (
                        <div className="p-3 bg-green-50 text-green-800 text-sm flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>
                            Location selected at {street}, near {landmark}
                            <div className="text-xs text-green-700/80">
                              Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                            </div>
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Tabs defaultValue="standard">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="standard">Standard Map</TabsTrigger>
                        <TabsTrigger value="satellite">Satellite View</TabsTrigger>
                      </TabsList>
                      <TabsContent value="standard" className="text-xs text-muted-foreground">
                        Standard map view shows streets and landmarks
                      </TabsContent>
                      <TabsContent value="satellite" className="text-xs text-muted-foreground">
                        Satellite view shows actual terrain and buildings
                      </TabsContent>
                    </Tabs>
                    
                    <div className="pt-4 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleLocationSubmit}
                      >
                        Continue to Evidence
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 4: Images/Evidence */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Upload Evidence</h2>
                    <p className="text-sm text-muted-foreground">Upload photos of the issue to help verify your report</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-md text-sm text-blue-800">
                      <Camera className="h-5 w-5 flex-shrink-0" />
                      <p>Photos help authorities verify and address the issue more efficiently. Please upload at least one image.</p>
                    </div>
                    
                    <ImageUpload 
                      onImagesSelected={handleImagesSelected} 
                      maxImages={3}
                      previewUrls={images.map(img => URL.createObjectURL(img))}
                    />
                    
                    {imageError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        <span>{imageError}</span>
                      </div>
                    )}
                    
                    <div className="pt-4 flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(3)}
                        disabled={loading}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button"
                        onClick={handleImagesSubmit}
                        disabled={loading || images.length === 0}
                      >
                        {loading ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Report"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Help text */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            Your contact information will only be used to verify your report and will not be publicly displayed.
          </p>
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

export default SubmitReport;
