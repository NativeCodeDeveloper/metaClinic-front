export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "clinico" | "recepcionista" | "usuario_reporte_seguimiento";
    };
  }
}
