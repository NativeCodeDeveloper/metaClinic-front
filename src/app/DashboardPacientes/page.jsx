import { ClerkProvider } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import PatientPortalClient from "./PatientPortalClient";
import {
  getRoleFromSessionClaims,
  isAdminRole,
  normalizeDashboardRole,
} from "@/lib/dashboard-access";

export const metadata = {
  title: "Portal del Paciente",
  description: "Portal restringido para seguimiento clínico de pacientes",
};

export default async function DashboardPacientesPage({ searchParams }) {
  const { userId, sessionClaims } = await auth();
  const client = await clerkClient();
  const currentUser = userId ? await client.users.getUser(userId) : null;
  const primaryEmail = currentUser?.emailAddresses?.find(
    (email) => email.id === currentUser?.primaryEmailAddressId
  )?.emailAddress || "";
  let role = getRoleFromSessionClaims(sessionClaims);

  if (!role && currentUser) {
    role = normalizeDashboardRole(currentUser?.publicMetadata?.role);
  }

  const fullName =
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ").trim() ||
    currentUser?.username ||
    "Paciente";
  const patientEmailParam = searchParams?.patientEmail || "";
  const patientNameParam = searchParams?.patientName || "";
  const canPreviewAsAdmin = isAdminRole(role) && Boolean(patientEmailParam);
  const effectivePatientEmail = canPreviewAsAdmin ? patientEmailParam : primaryEmail;
  const effectivePatientName = canPreviewAsAdmin ? patientNameParam || "Paciente" : fullName;

  return (
    <ClerkProvider>
      <PatientPortalClient
        patientEmail={effectivePatientEmail}
        patientName={effectivePatientName}
        isAdminPreview={canPreviewAsAdmin}
      />
    </ClerkProvider>
  );
}
