import { BarChart3, ShieldCheck, FileSpreadsheet, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function UsuarioReporteSeguimientoPage() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.12),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/88 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Acceso restringido
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Reporte y seguimiento
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Este modulo esta reservado para usuarios con permisos especificos de
            seguimiento. Desde aqui puedes concentrar la revision de indicadores,
            estados y reportes operativos sin acceder al resto del dashboard.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <BarChart3 className="h-6 w-6 text-cyan-600" />
              <h2 className="mt-4 text-base font-semibold text-slate-900">
                Visualizacion centralizada
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Acceso concentrado al area de reportes sin exponer los modulos administrativos.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <FileSpreadsheet className="h-6 w-6 text-cyan-600" />
              <h2 className="mt-4 text-base font-semibold text-slate-900">
                Espacio listo para integracion
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                La pagina ya queda habilitada como destino exclusivo para el nuevo rol de Clerk.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <ShieldCheck className="h-6 w-6 text-cyan-600" />
              <h2 className="mt-4 text-base font-semibold text-slate-900">
                Permiso controlado por middleware
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Cualquier intento de abrir otra seccion del dashboard se redirige automaticamente.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-dashed border-cyan-200 bg-cyan-50/70 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-cyan-800">
                  Siguiente paso recomendado
                </p>
                <p className="mt-1 text-sm text-cyan-700/90">
                  Conecta aqui el contenido real del reporte de seguimiento si este modulo ya tiene una fuente de datos definida.
                </p>
              </div>

              <Link
                href="/dashboard/no-access"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Ver politica de acceso
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
