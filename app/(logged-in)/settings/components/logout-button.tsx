"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/utils/toast";
import { createClient } from "@/utils/supabase/supabase-ui-client";
import { routes } from "@/app/constants";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        type: "error",
        message: "Error signing out",
      });
      return;
    } else {
      toast({
        type: "success",
        message: "Signed out successfully",
      });
      router.push(routes.publicRoutes.home);
    }
  };
  return (
    <Button onClick={handleLogout} variant="secondary">
      Logout
    </Button>
  );
}
