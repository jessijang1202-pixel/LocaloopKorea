import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Set to true to bypass all auth redirects for testing. Re-enable for production.
const BYPASS_AUTH = true;

const PROTECTED = [
  "/tasks", "/courses", "/community", "/chat", "/profile",
  "/places", "/guides", "/food", "/meetups", "/settings", "/saved",
];

const ONBOARDING_GATED = ["/tasks", "/courses", "/community"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  // ── Admin route protection (always active, ignores BYPASS_AUTH) ──
  if (isAdminRoute && !isAdminLogin) {
    // No Supabase configured → allow through in dev (show UI without data)
    if (!url.startsWith("https://") || key.length < 20) {
      return supabaseResponse;
    }

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const dest = request.nextUrl.clone();
      dest.pathname = "/admin/login";
      return NextResponse.redirect(dest);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      const dest = request.nextUrl.clone();
      dest.pathname = "/admin/login";
      dest.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(dest);
    }

    return supabaseResponse;
  }

  // ── Regular app auth bypass for development ──────────────────────
  if (BYPASS_AUTH) return supabaseResponse;

  if (!url.startsWith("https://") || key.length < 20) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isIntroPage = pathname === "/intro" || pathname === "/";
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isOnboardingGated = ONBOARDING_GATED.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/login";
    dest.searchParams.set("next", pathname);
    return NextResponse.redirect(dest);
  }

  if (user && (isAuthPage || isIntroPage)) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/map";
    return NextResponse.redirect(dest);
  }

  if (user && isOnboardingGated) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_done")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.onboarding_done) {
      const dest = request.nextUrl.clone();
      dest.pathname = "/onboarding";
      dest.searchParams.set("next", pathname);
      return NextResponse.redirect(dest);
    }
  }

  return supabaseResponse;
}
