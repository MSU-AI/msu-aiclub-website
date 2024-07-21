"use client";

import { useState } from 'react';
import { Button } from "~/components/ui/button";
import { assignAdminRole } from "~/server/actions/role";
import { useToast } from "~/components/ui/use-toast";
import { createClient } from '~/utils/supabase/client';

export function AssignAdminButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAssignAdmin = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      try {
        const success = await assignAdminRole(user.id);
        if (success) {
          toast({
            title: "Success",
            description: "Admin role assigned successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to assign admin role.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in assignAdminRole:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "User not found. Please log in.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <Button onClick={handleAssignAdmin} disabled={isLoading}>
      {isLoading ? "Assigning..." : "Make Me Admin"}
    </Button>
  );
}
