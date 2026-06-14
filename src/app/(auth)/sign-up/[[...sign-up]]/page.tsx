"use client";

import { SignUp } from "@clerk/nextjs";

const clerkAppearance = {
  baseTheme: "dark",
  variables: {
    colorPrimary: "#0084ff",
    colorPrimaryButtonText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "#8899a6",
    colorBackground: "#121724",
    colorInputBackground: "#0f1624",
    colorInputBorder: "rgba(255,255,255,0.08)",
    colorInputText: "#ffffff",
    colorInputPlaceholder: "#8899a6",
    colorLabelText: "#ffffff",
    colorFormBackground: "#121724",
    colorFormButtonBackground: "#0084ff",
    colorFormButtonText: "#ffffff",
    colorFormButtonHoverBackground: "#006ed5",
    colorFormButtonSecondaryBackground: "#192030",
    colorFormButtonSecondaryText: "#ffffff",
    colorFormButtonSecondaryBorder: "rgba(255,255,255,0.1)",
    colorDividerBackground: "rgba(255,255,255,0.08)",
    colorTextOnPrimaryButton: "#ffffff",
    borderRadius: "10px",
    spacingUnit: "8px",
  },
};

export default function SignUpPage() {
  return (
    <SignUp
      appearance={clerkAppearance}
      forceRedirectUrl="/onboarding/1"
      signInUrl="/sign-in"
    />
  );
}
