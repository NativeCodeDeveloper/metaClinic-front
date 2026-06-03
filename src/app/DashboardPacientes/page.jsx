import { ClerkProvider } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import PatientPortalClient from "./PatientPortalClient";
import {
  DASHBOARD_ROLES,
  getRoleFromSessionClaims,
  normalizeDashboardRole,
} from "@/lib/dashboard-access";
import { isClerkTemporarilyDisabled } from "@/lib/clerk-disabled";

export const metadata = {
  title: "Portal del Paciente",
  description: "Portal restringido para seguimiento clínico de pacientes",
};

export default async function DashboardPacientesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const clerkDisabled = isClerkTemporarilyDisabled();
  let userId = null;
  let sessionClaims = null;
  let currentUser = null;

  if (!clerkDisabled) {
    const authData = await auth();
    userId = authData.userId;
    sessionClaims = authData.sessionClaims;
    const client = await clerkClient();
    currentUser = userId ? await client.users.getUser(userId) : null;
  }

  const primaryEmail = currentUser?.emailAddresses?.find(
    (email) => email.id === currentUser?.primaryEmailAddressId
  )?.emailAddress || "";
  let role = clerkDisabled ? DASHBOARD_ROLES.ADMIN : getRoleFromSessionClaims(sessionClaims);

  if (!role && currentUser) {
    role = normalizeDashboardRole(currentUser?.publicMetadata?.role);
  }

  const fullName =
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ").trim() ||
    currentUser?.username ||
    "Paciente";
  const patientEmailParam = resolvedSearchParams?.patientEmail || "";
  const patientNameParam = resolvedSearchParams?.patientName || "";
  const sourceParam = resolvedSearchParams?.source || "";
  const canPreviewPatientPortal =
    userId &&
    role !== DASHBOARD_ROLES.USUARIO_REPORTE_SEGUIMIENTO &&
    sourceParam === "fichaPaciente" &&
    Boolean(patientEmailParam);
  const effectivePatientEmail = canPreviewPatientPortal ? patientEmailParam : primaryEmail;
  const effectivePatientName = canPreviewPatientPortal ? patientNameParam || "Paciente" : fullName;

  const content = (
    <PatientPortalClient
      patientEmail={effectivePatientEmail}
      patientName={effectivePatientName}
      isAdminPreview={canPreviewPatientPortal}
    />
  );

  if (clerkDisabled) {
    return content;
  }

  return <ClerkProvider>{content}</ClerkProvider>;
}
