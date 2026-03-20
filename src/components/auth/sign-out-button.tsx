"use client";

import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button onClick={() => signOut()} variant="ghost">
      <LogOutIcon className="size-4" />
      Sign out
    </Button>
  );
}
