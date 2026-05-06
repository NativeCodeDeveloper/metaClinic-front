import { Activity, ShieldCheck, UserRound } from "lucide-react";
import SignOutBtn from "../dashboard/SignOutBtn";

export const metadata = {
  title: "Seguimiento de Pacientes",
  description: "Vista restringida para pacientes con seguimiento clínico",
};

export default function DashboardPacientesPage() {
  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_36%),linear-gradient(180deg,_#f8fafc_0%,_#e8f1f8_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="border-b border-slate-200/80 bg-[linear-gradient(135deg,_#0f172a_0%,_#133b5c_100%)] px-6 py-8 sm:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Acceso clínico protegido
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Seguimiento de pacientes
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
              Esta vista ha sido habilitada exclusivamente para usuarios con acceso
              restringido al seguimiento de tratamiento. No incluye navegación al
              dashboard administrativo general.
            </p>
          </div>

          <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_320px]">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-[0_18px_40px_rgba(14,165,233,0.24)]">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Módulo de seguimiento
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Punto de entrada único para pacientes con acceso controlado.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-dashed border-cyan-200 bg-white p-5">
                  <p className="text-sm font-semibold text-cyan-800">
                    Vista base habilitada
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Aquí debe vivir el contenido funcional del seguimiento de
                    tratamiento. El middleware bloquea el acceso del usuario
                    restringido a cualquier ruta de <code>/dashboard</code>.
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Reglas de acceso
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                  <li>Solo esta ruta está disponible para el rol `usuario_reporte_seguimiento`.</li>
                  <li>El intento de entrar a `/dashboard` o cualquier subruta administrativa se redirige aquí.</li>
                  <li>La sesión puede cerrarse desde este mismo panel sin regresar al dashboard general.</li>
                </ul>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Usuario autenticado
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <UserRound className="h-5 w-5 text-cyan-200" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Seguimiento de tratamiento
                    </p>
                    <p className="mt-1 text-sm text-white/65">
                      Perfil con acceso administrativo deshabilitado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-3">
                <SignOutBtn />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
