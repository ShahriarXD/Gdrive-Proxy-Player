"use client";

import { LogInIcon } from "lucide-react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function GoogleSignInButton() {
  return (
    <Button onClick={() => signIn("google")} size="lg">
      <LogInIcon className="size-4" />
      Continue with Google
    </Button>
  );
}
