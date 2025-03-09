"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { requestPasswordReset } from "~/server/actions/auth";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Check if there's an error from the callback route
    const error = searchParams.get('error');
    if (error) {
      setMessage(decodeURIComponent(error));
      toast.error(decodeURIComponent(error), {
        duration: 4000,
        position: "bottom-right",
        style: {
          border: "2px solid #333",
          color: "#fff",
          backgroundColor: "#333",
        },
      });
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage("");
    
    try {
      const res = await requestPasswordReset(email);
      
      if (res) {
        setMessage(res);
        toast.error(res, {
          duration: 4000,
          position: "bottom-right",
          style: {
            border: "2px solid #333",
            color: "#fff",
            backgroundColor: "#333",
          },
        });
      } else {
        setSuccess(true);
        toast.success("Password reset email sent! Please check your inbox.", {
          duration: 4000,
          position: "bottom-right",
          style: {
            border: "2px solid #333",
            color: "#fff",
            backgroundColor: "#333",
          },
        });
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.", {
        duration: 4000,
        position: "bottom-right",
        style: {
          border: "2px solid #333",
          color: "#fff",
          backgroundColor: "#333",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="flex flex-col bg-background mx-auto min-w-[400px] min-h-[350px] max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center space-y-4">
            <p className="text-green-600">
              Password reset email sent! Please check your inbox and spam folders.
            </p>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => router.push("/auth/login")}
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {message && <Label className="text-red-500">{message}</Label>}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSubmit}
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Email"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Remember your password?{" "}
              <Link href="/auth/login" className="underline">
                Login
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
