export const DASHBOARD_ROLES = {
  ADMIN: "admin",
  CLINICO: "clinico",
  RECEPCIONISTA: "recepcionista",
  USUARIO_REPORTE_SEGUIMIENTO: "usuario_reporte_seguimiento",
};

const ROLE_ALLOWED_PATHS = {
  [DASHBOARD_ROLES.RECEPCIONISTA]: [
    "/dashboard",
    "/dashboard/no-access",
    "/dashboard/calendarioGeneral",
    "/dashboard/calendario",
    "/dashboard/agendaCitas",
    "/dashboard/bloqueosAgenda",
    "/dashboard/AgendaDetalle/",
    "/dashboard/GestionPaciente",
    "/dashboard/paciente/",
  ],
  [DASHBOARD_ROLES.USUARIO_REPORTE_SEGUIMIENTO]: [
    "/dashboard/no-access",
    "/dashboard/usuarioReporteSeguimiento",
  ],
};

export function getRoleFromSessionClaims(sessionClaims) {
  const role = sessionClaims?.metadata?.role;

  // Mantiene compatibilidad con usuarios Clerk antiguos que siguen usando "clinico".
  if (role === DASHBOARD_ROLES.CLINICO) {
    return DASHBOARD_ROLES.ADMIN;
  }

  return role;
}

export function isAdminRole(role) {
  return role === DASHBOARD_ROLES.ADMIN;
}

export function getDefaultDashboardPath(role) {
  if (role === DASHBOARD_ROLES.USUARIO_REPORTE_SEGUIMIENTO) {
    return "/dashboard/usuarioReporteSeguimiento";
  }

  return "/dashboard";
}

export function canAccessDashboardPath(role, pathname) {
  const allowedPaths = ROLE_ALLOWED_PATHS[role];

  if (!allowedPaths) {
    return true;
  }

  return allowedPaths.some((allowedPath) => {
    if (allowedPath.endsWith("/")) {
      return pathname.startsWith(allowedPath);
    }

    return pathname === allowedPath;
  });
}
