import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  if (token && (pathname.startsWith("/signin") || pathname.startsWith("/signup"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/", "/verify/:path*", "/dashboard/:path*"],
};
