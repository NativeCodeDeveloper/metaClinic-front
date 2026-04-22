import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  canAccessDashboardPath,
  DASHBOARD_ROLES,
  getDefaultDashboardPath,
  getRoleFromSessionClaims,
} from "@/lib/dashboard-access";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isDashboardRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const role = getRoleFromSessionClaims(sessionClaims);
  const pathname = req.nextUrl.pathname;

  if (
    role === DASHBOARD_ROLES.USUARIO_REPORTE_SEGUIMIENTO &&
    pathname === "/dashboard"
  ) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardPath(role), req.url)
    );
  }

  if (!canAccessDashboardPath(role, pathname)) {
    const redirectPath =
      role === DASHBOARD_ROLES.USUARIO_REPORTE_SEGUIMIENTO
        ? getDefaultDashboardPath(role)
        : "/dashboard/no-access";

    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
