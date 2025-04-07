
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Check, AlertTriangle, Phone } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerified: () => void;
  disabled?: boolean;
}

const PhoneVerification = ({ phoneNumber, onVerified, disabled = false }: PhoneVerificationProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  // In a real app, this would be an API call to send the verification code
  const handleSendCode = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Simulate API call with timeout
    setTimeout(() => {
      // For demo purposes, we'll just simulate a successful code send
      toast({
        title: "Verification Code Sent",
        description: `A code has been sent to ${phoneNumber}. For demo purposes, use 1234.`,
      });
      setIsLoading(false);
      setIsSent(true);
    }, 1000);
  };

  // In a real app, this would verify the code with an API
  const handleVerifyCode = () => {
    setIsLoading(true);
    setError("");
    
    // Simulate API verification with timeout
    setTimeout(() => {
      // For demo purposes, the code is 1234
      if (verificationCode === "1234") {
        setIsVerified(true);
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified.",
          variant: "default",
        });
        onVerified();
      } else {
        setError("Invalid verification code. For demo purposes, use 1234.");
      }
      setIsLoading(false);
    }, 1000);
  };

  if (isVerified) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <Check className="h-4 w-4" />
        <span>Verified</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {!isSent ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={handleSendCode}
          disabled={isLoading || disabled || !phoneNumber}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-3 w-3 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Phone className="mr-1 h-3 w-3" />
              Send OTP
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div>
              <InputOTP 
                maxLength={4}
                value={verificationCode}
                onChange={setVerificationCode}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, i) => (
                      <InputOTPSlot key={i} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            <Button
              type="button"
              size="sm"
              disabled={verificationCode.length !== 4 || isLoading}
              onClick={handleVerifyCode}
            >
              {isLoading ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
          
          {error && (
            <p className="text-destructive text-xs flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {error}
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            Enter code 1234 to verify (for demo)
          </p>
        </div>
      )}
    </div>
  );
};

export default PhoneVerification;
