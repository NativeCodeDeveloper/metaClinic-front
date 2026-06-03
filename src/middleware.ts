import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  canAccessDashboardPath,
  DASHBOARD_ROLES,
  getDefaultDashboardPath,
  getRoleFromSessionClaims,
  normalizeDashboardRole,
} from "@/lib/dashboard-access";
import { isClerkTemporarilyDisabled } from "@/lib/clerk-disabled";

const isProtectedAppRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/DashboardPacientes",
]);

const dashboardMiddleware = isClerkTemporarilyDisabled()
  ? function temporarilyDisabledClerkMiddleware() {
      return NextResponse.next();
    }
  : clerkMiddleware(async (auth, req) => {
  if (!isProtectedAppRoute(req)) {
    return NextResponse.next();
  }

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  let role = getRoleFromSessionClaims(sessionClaims);

  if (!role) {
    const client = await clerkClient();
    const currentUser = await client.users.getUser(userId);
    role = normalizeDashboardRole(currentUser?.publicMetadata?.role);
  }

  const pathname = req.nextUrl.pathname;

  if (
    role === DASHBOARD_ROLES.USUARIO_REPORTE_SEGUIMIENTO &&
    pathname.startsWith("/dashboard")
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

export default dashboardMiddleware;

export const config = {
  matcher: ["/dashboard/:path*", "/DashboardPacientes", "/api/admin/clerk-users"],
};
