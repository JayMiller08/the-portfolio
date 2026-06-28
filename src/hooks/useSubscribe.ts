import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseSubscribeProps {
  source: string;
  onSuccessMessage?: string;
  onSuccess?: () => void;
}

export const useSubscribe = ({ 
  source, 
  onSuccessMessage = "You're in!", 
  onSuccess 
}: UseSubscribeProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return false;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    setIsLoading(true);

    try {
      const { error: supabaseError } = await supabase
        .from("subscribers")
        .insert([
          {
            email: email.trim().toLowerCase(),
            source,
          },
        ]);

      // 23505 is the unique violation code (email already exists), which is fine
      if (supabaseError && supabaseError.code !== "23505") {
        throw supabaseError;
      }

      setIsUnlocked(true);
      toast({
        title: "Success!",
        description: onSuccessMessage,
      });
      
      if (onSuccess) {
        onSuccess();
      }
      return true;
    } catch (err: any) {
      console.error("Error saving email:", err);
      setError(err.message || err.details || "Something went wrong. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    error,
    setError,
    isUnlocked,
    setIsUnlocked,
    handleSubmit
  };
};
