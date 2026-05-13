import { ClerkProvider } from "@clerk/nextjs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import PatientPortalClient from "./PatientPortalClient";

export const metadata = {
  title: "Portal del Paciente",
  description: "Portal restringido para seguimiento clínico de pacientes",
};

export default async function DashboardPacientesPage() {
  const { userId } = await auth();
  const client = await clerkClient();
  const currentUser = userId ? await client.users.getUser(userId) : null;
  const primaryEmail = currentUser?.emailAddresses?.find(
    (email) => email.id === currentUser?.primaryEmailAddressId
  )?.emailAddress || "";
  const fullName =
    [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ").trim() ||
    currentUser?.username ||
    "Paciente";

  return (
    <ClerkProvider>
      <PatientPortalClient patientEmail={primaryEmail} patientName={fullName} />
    </ClerkProvider>
  );
}
