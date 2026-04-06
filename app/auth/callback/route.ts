import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import {
  getAdminAuthErrorMessage,
  hasAdminEmailAllowlist,
  isAdminEmailAllowed,
} from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (hasAdminEmailAllowlist() && isAdminEmailAllowed(user?.email)) {
        return NextResponse.redirect(`${origin}/admin`);
      }

      await supabase.auth.signOut();

      const reason = hasAdminEmailAllowlist()
        ? "forbidden"
        : "missing_allowlist";

      return NextResponse.redirect(
        `${origin}/admin/login?error=${encodeURIComponent(
          getAdminAuthErrorMessage(reason)
        )}`
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/admin/login?error=El+enlace+no+es+valido+o+ha+expirado`
  );
}
