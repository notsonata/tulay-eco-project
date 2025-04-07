
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Barangay, BARANGAYS } from "@/lib/data";
import PhoneVerification from "./PhoneVerification";

interface UserInfoFormProps {
  onSubmit: (data: { name: string; phoneNumber: string; barangay: Barangay }) => void;
  buttonText?: string;
}

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  barangay: z.enum(BARANGAYS, {
    required_error: "Please select a barangay",
  }),
});

const UserInfoForm = ({ onSubmit, buttonText = "Submit" }: UserInfoFormProps) => {
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      barangay: "" as Barangay,
    },
  });

  const { control, handleSubmit, formState, watch } = form;
  const phoneNumber = watch("phoneNumber");

  // Phone verification handler
  const handlePhoneVerified = () => {
    setIsPhoneVerified(true);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit((data) => {
          if (!isPhoneVerified) {
            form.setError("phoneNumber", {
              type: "manual",
              message: "Phone number must be verified",
            });
            return;
          }
          onSubmit(data);
        })}
        className="space-y-4"
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
              <div className="space-y-2">
                <FormControl>
                  <Input
                    placeholder="e.g., 09123456789"
                    {...field}
                    onChange={(e) => {
                      // Only allow numeric input
                      const value = e.target.value.replace(/[^0-9]/g, "");
                      field.onChange(value);
                      if (isPhoneVerified) {
                        setIsPhoneVerified(false);
                      }
                    }}
                    maxLength={11}
                  />
                </FormControl>
                <PhoneVerification 
                  phoneNumber={phoneNumber} 
                  onVerified={handlePhoneVerified}
                  disabled={!phoneNumber || phoneNumber.length < 10 || !formState.dirtyFields.phoneNumber}
                />
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="barangay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barangay *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your barangay" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BARANGAYS.map((barangay) => (
                    <SelectItem key={barangay} value={barangay}>
                      {barangay}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={formState.isSubmitting || !formState.isDirty}
        >
          {buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default UserInfoForm;
