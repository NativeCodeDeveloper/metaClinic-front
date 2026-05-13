"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  ChevronRight,
  ClipboardPenLine,
  LoaderCircle,
  Mail,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import toast from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import SignOutBtn from "../dashboard/SignOutBtn";

const API = process.env.NEXT_PUBLIC_API_URL;

const initialForm = {
  peso: "",
  cintura: "",
  presion_arterial: "",
  glicemia_ayuno: "",
  horas_ejercicio: "",
  adherencia_tratamiento: "Buena",
  apetito_semana: "Normal",
  nauseas: "Ninguna",
  vomitos: "Ninguna",
  diarrea: "Ninguna",
  constipacion: "Ninguna",
  dolor_abdominal: "Ninguna",
  hambre_nocturna: "Ninguna",
  observaciones_paciente: "",
};

const tabs = [
  { id: "mensajes", label: "Mensajes", icon: Mail },
  { id: "progreso", label: "Progreso", icon: Activity },
  { id: "checkin", label: "Check-in", icon: ClipboardPenLine },
];

const adherenciaOptions = ["Excelente", "Buena", "Regular", "Mala"];
const apetitoOptions = ["Muy reducido", "Reducido", "Normal", "Aumentado"];
const symptomOptions = ["Ninguna", "Leve", "Moderada", "Intensa"];

function formatDate(dateString) {
  if (!dateString) {
    return "Fecha por confirmar";
  }

  const normalizedDate =
    typeof dateString === "string" && dateString.includes("T")
      ? dateString
      : `${String(dateString).split(" ")[0]}T00:00:00`;

  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return "Fecha por confirmar";
  }

  return date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatDateTime(fecha, hora) {
  const day = formatDate(fecha);
  const time = hora ? hora.slice(0, 5) : "--:--";
  return `${day}, ${time} hrs`;
}

function formatMessageDate(dateString) {
  if (!dateString) {
    return "Sin fecha";
  }

  return new Date(dateString).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildChartPoints(items, width, height, padding) {
  if (!items.length) {
    return "";
  }

  const numericValues = items
    .map((item) => Number(item.peso_kg))
    .filter((value) => !Number.isNaN(value));

  if (!numericValues.length) {
    return "";
  }

  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  return items
    .map((item, index) => {
      const value = Number(item.peso_kg);
      const x = padding + (items.length === 1 ? chartWidth / 2 : (index / (items.length - 1)) * chartWidth);
      const ratio = max === min ? 0.5 : (value - min) / (max - min);
      const y = height - padding - ratio * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");
}

function StatCard({ icon: Icon, label, value, hint, tone = "default" }) {
  const toneClass =
    tone === "warning"
      ? "from-amber-500/15 to-orange-500/15 text-amber-700"
      : tone === "success"
        ? "from-emerald-500/15 to-cyan-500/15 text-emerald-700"
        : "from-sky-500/15 to-blue-500/15 text-sky-700";

  return (
    <div className="rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </div>
          <div className="mt-3 text-lg font-semibold text-slate-900">{value}</div>
          {hint ? <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p> : null}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function EmptyPanel({ title, description }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/85 p-8 text-center shadow-[0_16px_50px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function Field({ label, children, helper }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      {children}
      {helper ? <span className="mt-2 block text-xs leading-5 text-slate-400">{helper}</span> : null}
    </label>
  );
}

export default function PatientPortalClient({ patientEmail, patientName }) {
  const [activeTab, setActiveTab] = useState("mensajes");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [portalData, setPortalData] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  async function cargarResumenPortal() {
    if (!API || !patientEmail) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/portalPacientes/resumenPacientePortal`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          correo: patientEmail,
        }),
      });

      const respuestaBackend = await response.json();

      if (!response.ok) {
        throw new Error(respuestaBackend?.error || "No se pudo cargar el portal del paciente.");
      }

      setPortalData(respuestaBackend);

      if (respuestaBackend?.checkinActual) {
        setFormData((prev) => ({
          ...prev,
          peso: respuestaBackend.checkinActual.peso || "",
          cintura: respuestaBackend.checkinActual.cintura || "",
          presion_arterial: respuestaBackend.checkinActual.presion_arterial || "",
          glicemia_ayuno: respuestaBackend.checkinActual.glicemia_ayuno || "",
          horas_ejercicio: respuestaBackend.checkinActual.horas_ejercicio || "",
          adherencia_tratamiento: respuestaBackend.checkinActual.adherencia_tratamiento || "Buena",
          apetito_semana: respuestaBackend.checkinActual.apetito_semana || "Normal",
          nauseas: respuestaBackend.checkinActual.nauseas || "Ninguna",
          vomitos: respuestaBackend.checkinActual.vomitos || "Ninguna",
          diarrea: respuestaBackend.checkinActual.diarrea || "Ninguna",
          constipacion: respuestaBackend.checkinActual.constipacion || "Ninguna",
          dolor_abdominal: respuestaBackend.checkinActual.dolor_abdominal || "Ninguna",
          hambre_nocturna: respuestaBackend.checkinActual.hambre_nocturna || "Ninguna",
          observaciones_paciente: respuestaBackend.checkinActual.observaciones_paciente || "",
        }));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "No fue posible cargar tu portal.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarResumenPortal();
  }, [patientEmail]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formData.peso || !formData.cintura || !formData.adherencia_tratamiento || !formData.apetito_semana) {
      return toast.error("Completa al menos peso, cintura, adherencia y apetito.");
    }

    try {
      setSaving(true);

      const response = await fetch(`${API}/portalPacientes/guardarCheckinSemanal`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          correo: patientEmail,
          ...formData,
        }),
      });

      const respuestaBackend = await response.json();

      if (!response.ok || respuestaBackend?.message !== true) {
        return toast.error("No fue posible guardar tu check-in semanal.");
      }

      if (respuestaBackend?.mailSent === false) {
        toast.success("Tu check-in semanal fue guardado correctamente.");
        toast.error("Se guardó tu registro, pero no fue posible enviar el correo automático.");
      } else {
        toast.success("Tu check-in semanal fue enviado correctamente.");
      }
      setActiveTab("mensajes");
      await cargarResumenPortal();
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error inesperado al enviar tu check-in.");
    } finally {
      setSaving(false);
    }
  }

  const controles = portalData?.controles || [];
  const mensajes = portalData?.mensajes || [];
  const progresoPeso = portalData?.progresoPeso || [];
  const checkinActual = portalData?.checkinActual || null;
  const proximoControl = controles[0] || null;

  const cambioPeso = useMemo(() => {
    if (progresoPeso.length < 2) {
      return null;
    }

    const inicio = Number(progresoPeso[0]?.peso_kg);
    const fin = Number(progresoPeso[progresoPeso.length - 1]?.peso_kg);

    if (Number.isNaN(inicio) || Number.isNaN(fin)) {
      return null;
    }

    return (fin - inicio).toFixed(1);
  }, [progresoPeso]);

  const chartPoints = useMemo(
    () => buildChartPoints(progresoPeso, 720, 280, 30),
    [progresoPeso]
  );

  if (loading) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#edf4fb_100%)] px-4 py-10">
        <ToasterClient />
        <div className="mx-auto flex max-w-4xl items-center justify-center rounded-[32px] border border-white/70 bg-white/90 p-10 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3 text-slate-600">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Cargando portal del paciente...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#edf4fb_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <ToasterClient />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Portal de seguimiento
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Hola, {portalData?.paciente?.nombre || patientName || "Paciente"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Bienvenida/o a tu portal de seguimiento de tratamiento. Aquí podrás revisar tus próximos controles, completar tu check-in semanal y ver los mensajes enviados por tu equipo médico.
              </p>
            </div>

            <div className="w-full max-w-sm rounded-[28px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_20px_70px_rgba(15,23,42,0.16)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Sesión protegida
              </div>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Este acceso fue habilitado por invitación y está limitado al portal del paciente.
              </p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="text-xs text-white/50">Correo asociado</div>
                <div className="mt-1 text-sm font-medium text-white">{patientEmail}</div>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
                <SignOutBtn />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            icon={CalendarDays}
            label="Próximo control"
            value={proximoControl ? formatDateTime(proximoControl.fechaInicio, proximoControl.horaInicio) : "Sin controles agendados"}
            hint={proximoControl?.nombreProfesional ? `Profesional: ${proximoControl.nombreProfesional}` : "Tu próxima cita aparecerá aquí apenas esté programada."}
          />
          <StatCard
            icon={ClipboardPenLine}
            label="Check-in semanal"
            value={checkinActual?.estado_checkin === "completado" ? "Registro completado" : "Pendiente esta semana"}
            hint={checkinActual?.semana_label || "Tu médico revisará este formulario cada semana."}
            tone={checkinActual?.estado_checkin === "completado" ? "success" : "warning"}
          />
          <StatCard
            icon={Scale}
            label="Evolución de peso"
            value={cambioPeso ? `${cambioPeso} kg desde el inicio` : "Aún sin evolución suficiente"}
            hint="Usamos tus evaluaciones clínicas previas para mostrar la tendencia."
            tone={cambioPeso && Number(cambioPeso) <= 0 ? "success" : "default"}
          />
        </div>

        {checkinActual?.estado_checkin !== "completado" ? (
          <button
            type="button"
            onClick={() => setActiveTab("checkin")}
            className="flex w-full items-center justify-between rounded-[28px] border border-amber-100 bg-white/90 px-5 py-4 text-left shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition-all hover:border-amber-200 hover:bg-white"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <ClipboardPenLine className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-amber-700">
                  Tienes un check-in pendiente esta semana
                </div>
                <div className="mt-1 text-sm text-amber-600/80">
                  Toca aquí para completar tu registro semanal.
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-amber-500" />
          </button>
        ) : null}

        <div className="rounded-[30px] border border-white/70 bg-white/85 p-3 shadow-[0_26px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-7">
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-white text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "mensajes" ? (
          <div className="rounded-[30px] border border-white/70 bg-white/92 p-6 shadow-[0_26px_80px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Mensajes de tu médico</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Aquí verás mensajes directos y respuestas automáticas generadas según tu check-in semanal.
                </p>
              </div>
            </div>

            {mensajes.length === 0 ? (
              <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <Mail className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-4 text-base font-semibold text-slate-700">Aún no tienes mensajes aprobados por tu médico.</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Cuando el equipo clínico o el sistema genere una respuesta, aparecerá aquí y también podrá llegar a tu correo.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {mensajes.map((mensaje) => (
                  <article
                    key={mensaje.id_mensaje}
                    className="rounded-[26px] border border-slate-200 bg-slate-50/90 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                            mensaje.tipo_mensaje === "directo"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {mensaje.tipo_mensaje === "directo" ? "Mensaje directo" : "Automático"}
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-slate-900">{mensaje.titulo}</h3>
                      </div>
                      <div className="text-sm text-slate-400">{formatMessageDate(mensaje.fecha_publicacion)}</div>
                    </div>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{mensaje.mensaje}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "progreso" ? (
          <div className="rounded-[30px] border border-white/70 bg-white/92 p-6 shadow-[0_26px_80px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Evolución del peso</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Tomamos tu historial clínico ya registrado para mostrarte la tendencia de evolución.
                </p>
              </div>
              <div className="text-sm font-semibold text-emerald-600">
                {cambioPeso ? `${cambioPeso} kg desde el inicio` : "Sin comparativa suficiente"}
              </div>
            </div>

            {progresoPeso.length === 0 ? (
              <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <Scale className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-4 text-base font-semibold text-slate-700">Aún no hay datos de evolución disponibles.</p>
                <p className="mt-2 text-sm text-slate-500">
                  Cuando existan evaluaciones con peso registrado, aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <svg viewBox="0 0 720 280" className="h-auto w-full">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" x2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#0f5fa8" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3].map((line) => {
                    const y = 30 + line * 73;
                    return (
                      <line
                        key={line}
                        x1="30"
                        y1={y}
                        x2="690"
                        y2={y}
                        stroke="#dbeafe"
                        strokeDasharray="6 6"
                      />
                    );
                  })}
                  {chartPoints ? (
                    <>
                      <polyline
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={chartPoints}
                      />
                      {progresoPeso.map((item, index) => {
                        const coordinates = chartPoints.split(" ")[index]?.split(",") || [];
                        const x = Number(coordinates[0]);
                        const y = Number(coordinates[1]);
                        return (
                          <g key={item.id_evaluacion || index}>
                            <circle cx={x} cy={y} r="6" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                            <text x={x} y="262" textAnchor="middle" className="fill-slate-500 text-[12px]">
                              {`S${index + 1}`}
                            </text>
                            <text x={x} y={y - 12} textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold">
                              {item.peso_kg} kg
                            </text>
                          </g>
                        );
                      })}
                    </>
                  ) : null}
                </svg>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  {progresoPeso.slice(-3).map((item, index) => (
                    <div key={item.id_evaluacion || index} className="rounded-2xl border border-white bg-white p-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        Registro {progresoPeso.length - (2 - index)}
                      </div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">{item.peso_kg} kg</div>
                      <div className="mt-1 text-sm text-slate-500">{formatDate(item.fecha_evaluacion)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {activeTab === "checkin" ? (
          <form
            onSubmit={handleSubmit}
            className="rounded-[30px] border border-white/70 bg-white/92 p-6 shadow-[0_26px_80px_rgba(15,23,42,0.06)] sm:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <ClipboardPenLine className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Registro semanal {checkinActual?.semana_label ? `— ${checkinActual.semana_label}` : ""}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Completa tu evolución de esta semana. Tu médico revisará los datos y te enviará un mensaje.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Medidas</div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Peso (kg) *" helper="Pesarte en ayuno, con la misma ropa y la misma balanza.">
                    <input
                      type="text"
                      name="peso"
                      value={formData.peso}
                      onChange={handleChange}
                      placeholder="Ej: 83.5"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                    />
                  </Field>
                  <Field label="Cintura (cm) *" helper="Medir a la altura del ombligo.">
                    <input
                      type="text"
                      name="cintura"
                      value={formData.cintura}
                      onChange={handleChange}
                      placeholder="Ej: 95"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                    />
                  </Field>
                  <Field label="Presión arterial" helper="Solo si tienes tensiómetro en casa.">
                    <input
                      type="text"
                      name="presion_arterial"
                      value={formData.presion_arterial}
                      onChange={handleChange}
                      placeholder="Ej: 120/80"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                    />
                  </Field>
                  <Field label="Glicemia en ayuno" helper="Solo si tienes glucómetro.">
                    <input
                      type="text"
                      name="glicemia_ayuno"
                      value={formData.glicemia_ayuno}
                      onChange={handleChange}
                      placeholder="Ej: 95"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                    />
                  </Field>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Hábitos y adherencia</div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <Field label="Adherencia al tratamiento">
                    <select
                      name="adherencia_tratamiento"
                      value={formData.adherencia_tratamiento}
                      onChange={handleChange}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white"
                    >
                      {adherenciaOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Apetito esta semana">
                    <select
                      name="apetito_semana"
                      value={formData.apetito_semana}
                      onChange={handleChange}
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white"
                    >
                      {apetitoOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Horas de ejercicio semanal">
                    <input
                      type="text"
                      name="horas_ejercicio"
                      value={formData.horas_ejercicio}
                      onChange={handleChange}
                      placeholder="Ej: 3"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                    />
                  </Field>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Síntomas</div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {[
                    ["nauseas", "Náuseas", "No tuve náuseas en ningún momento de la semana."],
                    ["vomitos", "Vómitos", "No vomité durante la semana."],
                    ["diarrea", "Diarrea", "Sin diarrea durante la semana."],
                    ["constipacion", "Constipación", "Sin constipación, deposiciones normales."],
                    ["dolor_abdominal", "Dolor abdominal", "Sin molestias abdominales relevantes."],
                    ["hambre_nocturna", "Hambre nocturna", "Sin episodios de hambre nocturna."],
                  ].map(([name, label, helper]) => (
                    <Field key={name} label={label} helper={helper}>
                      <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white"
                      >
                        {symptomOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ))}
                </div>
              </div>

              <div>
                <Field label="Observaciones adicionales">
                  <textarea
                    name="observaciones_paciente"
                    value={formData.observaciones_paciente}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Si quieres, aquí puedes dejar una nota para tu médico."
                    className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl text-sm leading-6 text-slate-500">
                Este formulario usa datos simples en texto para mantener el flujo liviano. Si no completas tu registro, el sistema puede enviarte recordatorios por correo.
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-6 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition-all hover:from-sky-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Enviando..." : "Enviar check-in semanal"}
              </button>
            </div>
          </form>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Próximos controles</h3>
                <p className="mt-1 text-sm text-slate-500">Tus próximas atenciones agendadas.</p>
              </div>
            </div>

            {controles.length === 0 ? (
              <p className="mt-6 text-sm leading-6 text-slate-500">
                No encontramos controles futuros asociados a este correo.
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                {controles.map((control) => (
                  <div key={control.id_reserva} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900">
                      {formatDateTime(control.fechaInicio, control.horaInicio)}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {control.nombreProfesional ? `Profesional: ${control.nombreProfesional}` : "Profesional por confirmar"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[28px] border border-white/70 bg-slate-950 p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.12)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Estado del portal
                </div>
                <h3 className="mt-2 text-lg font-semibold">Tu acceso está activo</h3>
              </div>
            </div>
            <div className="mt-5 space-y-3 text-sm leading-6 text-white/70">
              <p>Tu cuenta fue invitada mediante correo electrónico y solo puede ingresar a este portal.</p>
              <p>Los mensajes que recibas aquí pueden ser directos del médico o automáticos según tus resultados del check-in.</p>
              <p>Si necesitas ayuda, el equipo clínico puede enviarte nuevas indicaciones por este mismo canal.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
