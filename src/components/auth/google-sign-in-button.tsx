"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type GoogleSignInButtonProps = {
  disabled?: boolean;
};

function GoogleLogo() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      viewBox="0 0 24 24"
    >
      <path
        d="M21.8 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.48a4.7 4.7 0 0 1-2.04 3.08v2.56h3.3c1.93-1.78 3.06-4.4 3.06-7.67Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.08-.92 6.77-2.5l-3.3-2.56c-.92.61-2.1.98-3.47.98-2.66 0-4.91-1.8-5.72-4.21H2.88v2.64A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.28 13.71A5.98 5.98 0 0 1 5.96 12c0-.59.1-1.17.32-1.71V7.65H2.88A10 10 0 0 0 2 12c0 1.61.38 3.13.88 4.35l3.4-2.64Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.08c1.5 0 2.84.52 3.9 1.53l2.92-2.92C17.07 3.07 14.75 2 12 2 8.08 2 4.72 4.25 2.88 7.65l3.4 2.64C7.09 7.88 9.34 6.08 12 6.08Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleSignInButton({ disabled = false }: GoogleSignInButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startGoogleSignIn = async () => {
    if (disabled) {
      return;
    }

    setIsSubmitting(true);
    await signIn("google", { callbackUrl: "/" });
    setIsSubmitting(false);
  };

  return (
    <Button
      className="min-w-[220px] justify-center"
      disabled={isSubmitting}
      onClick={startGoogleSignIn}
      size="lg"
      variant="secondary"
    >
      <GoogleLogo />
      {isSubmitting ? "Redirecting..." : "Continue with Google"}
    </Button>
  );
}
