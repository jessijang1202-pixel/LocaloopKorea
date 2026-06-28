import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = [
  "/tasks", "/courses", "/community", "/chat", "/profile",
  "/places", "/guides", "/food", "/meetups", "/settings", "/saved",
];

const ONBOARDING_GATED = ["/tasks", "/courses", "/community"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  // Demo mode — skip auth
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
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isIntroPage = pathname === "/intro" || pathname === "/";
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isOnboardingGated = ONBOARDING_GATED.some((p) => pathname.startsWith(p));

  // Redirect unauthenticated users away from protected routes
  if (!user && isProtected) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/login";
    dest.searchParams.set("next", pathname);
    return NextResponse.redirect(dest);
  }

  // Logged-in users skip intro/auth pages → go to map
  if (user && (isAuthPage || isIntroPage)) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/map";
    return NextResponse.redirect(dest);
  }

  // Onboarding gate: redirect to onboarding if profile not complete
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
