export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "recepcionista" | "usuario_reporte_seguimiento";
    };
  }
}
