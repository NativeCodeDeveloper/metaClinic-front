import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  DASHBOARD_ROLES,
  getRoleFromSessionClaims,
  isAdminRole,
  normalizeDashboardRole,
  RESTRICTED_PATIENTS_PATH,
} from "@/lib/dashboard-access";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

function getErrorMessage(error) {
  return (
    error?.errors?.[0]?.longMessage ||
    error?.errors?.[0]?.message ||
    error?.message ||
    "No fue posible crear el usuario en Clerk."
  );
}

async function sendCredentialsEmail({
  email,
  firstName,
  lastName,
  password,
  accessUrl,
}) {
  if (!BACKEND_API_URL) {
    return {
      sent: false,
      error: "No existe configuracion de backend para enviar el correo de acceso.",
    };
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/correo/acceso-seguimiento`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        password,
        accessUrl,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.message) {
      return {
        sent: false,
        error: "No fue posible enviar el correo de acceso.",
      };
    }

    return {
      sent: true,
      messageId: data?.messageId || null,
    };
  } catch (error) {
    return {
      sent: false,
      error: error?.message || "No fue posible enviar el correo de acceso.",
    };
  }
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

    const client = await clerkClient();
    let role = getRoleFromSessionClaims(sessionClaims);

    if (!role) {
      const currentUser = await client.users.getUser(userId);
      role = normalizeDashboardRole(currentUser?.publicMetadata?.role);
    }

    if (!isAdminRole(role)) {
      console.warn("[clerk-users] forbidden request", {
        userId,
        role,
        sessionClaims,
      });
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
    const accessUrl = `${new URL(request.url).origin}${RESTRICTED_PATIENTS_PATH}`;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: "Completa nombre, apellido, correo y contrasena." },
        { status: 400 }
      );
    }

    const user = await client.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
      publicMetadata: {
        role: DASHBOARD_ROLES.USUARIO_REPORTE_SEGUIMIENTO,
      },
    });
    const credentialsEmail = await sendCredentialsEmail({
      email,
      firstName,
      lastName,
      password,
      accessUrl,
    });

    return NextResponse.json(
      {
        id: user.id,
        email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: DASHBOARD_ROLES.USUARIO_REPORTE_SEGUIMIENTO,
        credentialsEmailSent: credentialsEmail.sent,
        credentialsEmailError: credentialsEmail.error || null,
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
