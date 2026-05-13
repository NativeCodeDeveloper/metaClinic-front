"use client";

import { useState } from "react";
import { Mail, Search, Send, UserRound, Stethoscope } from "lucide-react";
import toast from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";

export default function MensajesPacientePage() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [nombreBusqueda, setNombreBusqueda] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [pacientesEncontrados, setPacientesEncontrados] = useState([]);
  const [correo, setCorreo] = useState("");
  const [nombrePaciente, setNombrePaciente] = useState("");
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [ultimoEnvio, setUltimoEnvio] = useState(null);

  async function buscarPacientesPorNombre() {
    try {
      if (!nombreBusqueda.trim()) {
        return toast.error("Escribe un nombre para buscar al paciente.");
      }

      setBuscando(true);

      const res = await fetch(`${API}/pacientes/contieneNombre`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: nombreBusqueda.trim() }),
        mode: "cors",
      });

      if (!res.ok) {
        setPacientesEncontrados([]);
        return toast.error("No fue posible buscar pacientes por nombre.");
      }

      const respuestaBackend = await res.json();

      if (Array.isArray(respuestaBackend) && respuestaBackend.length > 0) {
        setPacientesEncontrados(respuestaBackend);
        toast.success("Pacientes encontrados correctamente.");
      } else {
        setPacientesEncontrados([]);
        toast.error("No se encontraron pacientes con ese nombre.");
      }
    } catch (error) {
      console.log(error);
      toast.error("No fue posible buscar pacientes por nombre.");
    } finally {
      setBuscando(false);
    }
  }

  function seleccionarPaciente(paciente) {
    setCorreo(paciente.correo || "");
    setNombrePaciente(`${paciente.nombre || ""} ${paciente.apellido || ""}`.trim());
    toast.success("Paciente seleccionado correctamente.");
  }

  async function enviarIndicacion() {
    try {
      if (!correo.trim()) {
        return toast.error("Debes seleccionar o escribir el correo del paciente.");
      }

      if (!titulo.trim() || !mensaje.trim()) {
        return toast.error("Completa el título y el mensaje antes de enviar.");
      }

      setEnviando(true);

      const res = await fetch(`${API}/portalPacientes/insertarMensajePaciente`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo.trim(),
          tipo_mensaje: "directo",
          titulo: titulo.trim(),
          mensaje: mensaje.trim(),
        }),
        mode: "cors",
      });

      const respuestaBackend = await res.json();

      if (!res.ok || respuestaBackend?.message !== true) {
        return toast.error("No fue posible enviar la indicación al paciente.");
      }

      setUltimoEnvio({
        correo: correo.trim(),
        nombrePaciente,
        titulo: titulo.trim(),
        mailSent: respuestaBackend?.mailSent !== false,
        mailError: respuestaBackend?.mailError || null,
      });

      setTitulo("");
      setMensaje("");

      if (respuestaBackend?.mailSent === false) {
        toast.success("La indicación quedó guardada en el portal del paciente.");
        toast.error("No fue posible enviar el correo automático al paciente.");
      } else {
        toast.success("Indicación enviada correctamente al paciente.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error inesperado al enviar la indicación.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#edf4fb_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <ToasterClient />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_26px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
                <Stethoscope className="h-3.5 w-3.5" />
                Comunicación clínica
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Mensajes para pacientes
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Desde esta pantalla el usuario médico o administrativo puede buscar un paciente, redactar indicaciones y publicarlas en su portal. Si la configuración de correo está activa, también se intentará enviar el mismo contenido por email.
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Tipo de mensaje
              </div>
              <div className="mt-2 text-sm font-medium text-slate-800">
                Directo del médico
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/92 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Buscar paciente</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Busca por nombre para tomar el correo registrado en la ficha del paciente.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={nombreBusqueda}
                  onChange={(e) => setNombreBusqueda(e.target.value)}
                  placeholder="Ej: Daniel"
                  className="h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                />
                <button
                  type="button"
                  onClick={buscarPacientesPorNombre}
                  disabled={buscando}
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {buscando ? "Buscando..." : "Buscar paciente"}
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {pacientesEncontrados.length > 0 ? (
                  pacientesEncontrados.map((paciente) => (
                    <button
                      key={paciente.id_paciente}
                      type="button"
                      onClick={() => seleccionarPaciente(paciente)}
                      className="flex w-full items-start justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition-all hover:border-sky-200 hover:bg-white"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {paciente.nombre} {paciente.apellido}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {paciente.correo || "Sin correo registrado"}
                        </div>
                        <div className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-400">
                          ID paciente: {paciente.id_paciente}
                        </div>
                      </div>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                        Seleccionar
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500">
                    Aquí aparecerán los pacientes encontrados. Si ya conoces el correo exacto, también puedes escribirlo manualmente en el formulario de envío.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_22px_70px_rgba(15,23,42,0.12)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Recomendación de uso
              </div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                <li>El paciente debe tener el mismo correo en Clerk y en `pacienteDatos.correo`.</li>
                <li>El mensaje se publica dentro del portal del paciente en la pestaña “Mensajes”.</li>
                <li>Si el correo automático falla, la indicación igual queda guardada en el portal.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/92 p-6 shadow-[0_22px_70px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Redactar indicación</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Completa el correo objetivo y el contenido que se mostrará al paciente.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <UserRound className="h-4 w-4 text-sky-600" />
                  Nombre del paciente seleccionado
                </span>
                <input
                  type="text"
                  value={nombrePaciente}
                  onChange={(e) => setNombrePaciente(e.target.value)}
                  placeholder="Se completa al seleccionar un paciente"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Mail className="h-4 w-4 text-sky-600" />
                  Correo del paciente
                </span>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="paciente@correo.com"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Título del mensaje
                </span>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Indicaciones posteriores al control"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">
                  Mensaje para el paciente
                </span>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows={8}
                  placeholder="Escribe aquí la indicación clínica que el paciente verá en su portal."
                  className="w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
                El backend guarda el mensaje en `portal_paciente_mensajes` y luego intenta enviarlo por correo usando la misma lógica del portal.
              </p>
              <button
                type="button"
                onClick={enviarIndicacion}
                disabled={enviando}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-6 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition-all hover:from-sky-500 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {enviando ? "Enviando..." : "Enviar indicación"}
              </button>
            </div>

            {ultimoEnvio ? (
              <div className="mt-6 rounded-[24px] border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                <div className="font-semibold">Última indicación registrada</div>
                <div className="mt-2">
                  {ultimoEnvio.nombrePaciente ? `${ultimoEnvio.nombrePaciente} · ` : ""}
                  {ultimoEnvio.correo}
                </div>
                <div className="mt-1">{ultimoEnvio.titulo}</div>
                {ultimoEnvio.mailSent ? (
                  <div className="mt-2 text-emerald-700">El correo automático también fue aceptado.</div>
                ) : (
                  <div className="mt-2 text-amber-700">
                    El mensaje quedó guardado, pero el correo automático falló: {ultimoEnvio.mailError || "sin detalle"}.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
