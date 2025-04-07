
import { useState } from "react";
import { Barangay, BARANGAYS } from "@/lib/data";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";

interface UserInfoFormProps {
  onSubmit: (userInfo: {name: string; phoneNumber: string; barangay: Barangay}) => void;
  submitting?: boolean;
  buttonText?: string;
  className?: string;
  disableForm?: boolean;
}

const UserInfoForm = ({ onSubmit, submitting = false, buttonText = "Submit", className = "", disableForm = false }: UserInfoFormProps) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [barangay, setBarangay] = useState<Barangay | "">("");
  
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [barangayError, setBarangayError] = useState("");
  
  // OTP verification states
  const [showOtp, setShowOtp] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setNameError("");
    setPhoneError("");
    setBarangayError("");
    
    // Validate
    let isValid = true;
    
    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    }
    
    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (!/^\d{11}$/.test(phoneNumber.replace(/\D/g, ''))) {
      setPhoneError("Please enter a valid phone number (11 digits)");
      isValid = false;
    }
    
    if (!barangay) {
      setBarangayError("Please select your barangay");
      isValid = false;
    }
    
    // Check if phone number is verified
    if (!otpVerified) {
      setPhoneError("Please verify your phone number first");
      isValid = false;
    }
    
    if (isValid && barangay) {
      onSubmit({
        name,
        phoneNumber,
        barangay
      });
    }
  };
  
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Limit to 11 digits
    const limited = cleaned.substring(0, 11);
    setPhoneNumber(limited);
    
    // Reset OTP verification if phone number changes
    if (otpVerified) {
      setOtpVerified(false);
      setShowOtp(false);
      setOtp("");
    }
  };
  
  const handleSendOTP = () => {
    // Validate phone number first
    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required");
      return;
    } else if (!/^\d{11}$/.test(phoneNumber.replace(/\D/g, ''))) {
      setPhoneError("Please enter a valid phone number (11 digits)");
      return;
    }
    
    setPhoneError("");
    setOtpError("");
    setOtpSending(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setOtpSending(false);
      setShowOtp(true);
      
      // In a real app, this would be sent via SMS
      // For demo, we're using a fixed OTP value
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone number.",
      });
    }, 1000);
  };
  
  const handleVerifyOTP = () => {
    setOtpError("");
    
    if (!otp) {
      setOtpError("Please enter the verification code");
      return;
    }
    
    setOtpVerifying(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setOtpVerifying(false);
      
      // For demo purposes, accept code "1234"
      if (otp === "1234") {
        setOtpVerified(true);
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified.",
          variant: "default",
        });
      } else {
        setOtpError("Invalid verification code. Please try again.");
        setOtp("");
      }
    }, 1000);
  };
  
  const handleOTPChange = (value: string) => {
    setOtp(value);
    setOtpError("");
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            disabled={disableForm || submitting}
            className={nameError ? "border-red-500" : ""}
          />
          {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="flex gap-2">
            <Input 
              id="phone" 
              value={phoneNumber}
              onChange={(e) => formatPhoneNumber(e.target.value)}
              placeholder="09XXXXXXXXX"
              disabled={disableForm || submitting || otpVerified}
              className={`flex-1 ${phoneError ? "border-red-500" : ""}`}
            />
            {!otpVerified && (
              <Button 
                type="button" 
                onClick={handleSendOTP} 
                disabled={otpSending || disableForm || !phoneNumber || phoneNumber.length < 11}
                size="sm"
                className="whitespace-nowrap"
              >
                {otpSending ? "Sending..." : "Send OTP"}
              </Button>
            )}
          </div>
          {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
          
          {/* OTP verification section */}
          {showOtp && !otpVerified && (
            <div className="mt-3 bg-slate-50 p-3 rounded-md">
              <Label htmlFor="otp" className="text-sm">Enter Verification Code</Label>
              <div className="flex items-end gap-2 mt-2">
                <div>
                  <InputOTP maxLength={4} value={otp} onChange={handleOTPChange}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                  {otpError && <p className="text-xs text-red-500 mt-1">{otpError}</p>}
                </div>
                <Button 
                  type="button" 
                  onClick={handleVerifyOTP} 
                  disabled={otpVerifying || otp.length < 4}
                  size="sm"
                  className="mb-0.5"
                >
                  {otpVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                For demo purposes, use code: <strong>1234</strong>
              </p>
            </div>
          )}
          
          {/* Phone verified indicator */}
          {otpVerified && (
            <div className="mt-2 flex items-center gap-1 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-check">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-xs">Phone number verified</span>
            </div>
          )}
        </div>
        
        <div>
          <Label htmlFor="barangay">Barangay *</Label>
          <Select
            value={barangay}
            onValueChange={(value) => setBarangay(value as Barangay)}
            disabled={disableForm || submitting}
          >
            <SelectTrigger 
              id="barangay" 
              className={barangayError ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select your barangay" />
            </SelectTrigger>
            <SelectContent>
              {BARANGAYS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {barangayError && <p className="text-sm text-red-500 mt-1">{barangayError}</p>}
        </div>
        
        {!disableForm && (
          <div className="pt-2">
            <button 
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full py-2 rounded-md transition-colors disabled:opacity-50"
              disabled={submitting || !otpVerified}
            >
              {submitting ? "Please wait..." : buttonText}
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default UserInfoForm;
