import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Role-based access control
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (path.startsWith("/vendeur/dashboard") && token?.role !== "VENDEUR") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (path.startsWith("/livreur/dashboard") && token?.role !== "LIVREUR") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/vendeur/dashboard/:path*",
    "/livreur/dashboard/:path*",
    "/compte/:path*",
  ],
};
