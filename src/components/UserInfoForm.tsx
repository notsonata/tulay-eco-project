
import { useState } from "react";
import { Barangay, BARANGAYS } from "@/lib/data";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
          <Input 
            id="phone" 
            value={phoneNumber}
            onChange={(e) => formatPhoneNumber(e.target.value)}
            placeholder="09XXXXXXXXX"
            disabled={disableForm || submitting}
            className={phoneError ? "border-red-500" : ""}
          />
          {phoneError && <p className="text-sm text-red-500 mt-1">{phoneError}</p>}
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
              disabled={submitting}
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
