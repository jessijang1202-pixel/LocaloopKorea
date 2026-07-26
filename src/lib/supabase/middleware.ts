import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Regular-app auth (login/protected routes) is live. Admin auth stays
// bypassed until an account is actually promoted to role="admin" in the
// `profiles` table — right now no such row exists, and there is no
// SUPABASE_SERVICE_ROLE_KEY configured to self-provision one, so flipping
// this on would lock everyone out of /admin with no recovery path. Promote
// your account's `profiles.role` to "admin" (Supabase dashboard SQL editor:
// update profiles set role = 'admin' where id = '<your auth.users id>';),
// then flip this to false.
const BYPASS_ADMIN_AUTH = true;
const BYPASS_APP_AUTH = false;

// Map, tasks, and other browsing surfaces stay open to anonymous visitors —
// login is required only for the personal/write features (profile, community
// posting, saved places). Gating /tasks would force a login step in front of
// the airport-landing -> tasks flow the whole app is built around.
const PROTECTED = ["/profile", "/community", "/saved"];

const ONBOARDING_GATED = ["/community"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Redirect admin subdomain to /admin
  const host = request.headers.get("host") ?? "";
  if (host === "admin.localoop.kr" && !request.nextUrl.pathname.startsWith("/admin")) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/admin";
    return NextResponse.redirect(dest);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  // ── Admin route protection ──
  if (isAdminRoute && !isAdminLogin) {
    if (BYPASS_ADMIN_AUTH || !url.startsWith("https://") || key.length < 20) {
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

  // ── Regular app auth ──────────────────────────────────────────────
  if (BYPASS_APP_AUTH) return supabaseResponse;

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
    dest.pathname = "/tasks";
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
