"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getAdminAuthErrorMessage,
  getNormalizedAdminEmail,
  hasAdminEmailAllowlist,
  isAdminEmailAllowed,
} from "@/lib/admin-auth";

export async function sendMagicLink(formData: FormData) {
  const rawEmail = formData.get("email") as string;
  const email = rawEmail ? getNormalizedAdminEmail(rawEmail) : "";

  if (!email) {
    redirect("/admin/login?error=Email+requerido");
  }

  if (!hasAdminEmailAllowlist()) {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        getAdminAuthErrorMessage("missing_allowlist")
      )}`
    );
  }

  if (!isAdminEmailAllowed(email)) {
    redirect(
      `/admin/login?error=${encodeURIComponent(
        getAdminAuthErrorMessage("forbidden")
      )}`
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      }/auth/callback`,
    },
  });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/admin/login?message=Revisa+tu+email+te+hemos+enviado+el+enlace");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
