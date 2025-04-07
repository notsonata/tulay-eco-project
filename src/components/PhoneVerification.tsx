
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Check, AlertTriangle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  onCancel: () => void;
}

const PhoneVerification = ({ phoneNumber, onVerified, onCancel }: PhoneVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  // In a real app, this would be an API call to send the verification code
  const handleSendCode = () => {
    setIsLoading(true);
    setError("");
    
    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes, we'll just simulate a successful code send
      toast({
        title: "Verification Code Sent",
        description: `A code has been sent to ${phoneNumber}. For demo purposes, the code is 123456.`,
      });
      setIsLoading(false);
    }, 1500);
  };

  // In a real app, this would verify the code with an API
  const handleVerifyCode = () => {
    setIsLoading(true);
    setError("");
    
    // Simulate API verification with timeout
    setTimeout(() => {
      // For demo purposes, any 6-digit code is valid
      if (verificationCode.length === 6) {
        setIsVerified(true);
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified.",
          variant: "default",
        });
        // Wait a moment to show the verified state before proceeding
        setTimeout(() => {
          onVerified();
        }, 1000);
      } else {
        setError("Invalid verification code. For demo purposes, enter any 6-digit code.");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <p>
          Phone verification helps ensure the authenticity of reports. 
          For demonstration purposes, any 6-digit code will be accepted.
        </p>
      </div>
      
      <div className="text-sm">
        We'll send a verification code to <span className="font-semibold">{phoneNumber}</span>
      </div>
      
      {!isVerified ? (
        <div className="space-y-6">
          <div>
            <Label htmlFor="code">Enter verification code</Label>
            <div className="mt-2">
              <InputOTP 
                maxLength={6}
                value={verificationCode}
                onChange={setVerificationCode}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            {error && (
              <p className="text-destructive text-sm mt-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={isLoading}
            >
              Back
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Code"
              )}
            </Button>
            
            <Button
              type="button"
              className="flex-1"
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-4 bg-green-50 text-green-800 rounded-md">
          <Check className="h-5 w-5 mr-2" />
          <span>Phone number verified successfully!</span>
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;
