import { NextRequest, NextResponse } from "next/server";

const LOGIN_PATH = "/login";

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/settings", "/notifications", "/perfil"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtected = PROTECTED_PREFIXES.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === LOGIN_PATH && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
