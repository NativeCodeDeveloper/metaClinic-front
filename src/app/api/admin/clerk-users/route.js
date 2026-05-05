import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  DASHBOARD_ROLES,
  getRoleFromSessionClaims,
  isAdminRole,
} from "@/lib/dashboard-access";

function getErrorMessage(error) {
  return (
    error?.errors?.[0]?.longMessage ||
    error?.errors?.[0]?.message ||
    error?.message ||
    "No fue posible crear el usuario en Clerk."
  );
}

export async function POST(request) {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Debes iniciar sesion para continuar." },
        { status: 401 }
      );
    }

    const role = getRoleFromSessionClaims(sessionClaims);

    if (!isAdminRole(role)) {
      return NextResponse.json(
        { message: "Solo un administrador puede crear usuarios." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();
    const password = body?.password?.trim();
    const firstName = body?.firstName?.trim();
    const lastName = body?.lastName?.trim();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Completa nombre, apellido, correo y contrasena." },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      publicMetadata: {
        role: DASHBOARD_ROLES.USUARIO_REPORTE_SEGUIMIENTO,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: DASHBOARD_ROLES.USUARIO_REPORTE_SEGUIMIENTO,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
