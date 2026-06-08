"use client";

import { Mail, Send, UserRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function MensajePacienteForm({ paciente, onClose }) {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [ultimoEnvio, setUltimoEnvio] = useState(null);

  const nombrePaciente = `${paciente?.nombre || ""} ${paciente?.apellido || ""}`.trim();
  const correo = paciente?.correo?.trim() || "";

  async function enviarIndicacion(event) {
    event.preventDefault();

    if (!correo) {
      return toast.error("El paciente no tiene correo registrado.");
    }

    if (!titulo.trim() || !mensaje.trim()) {
      return toast.error("Completa el título y el mensaje antes de enviar.");
    }

    try {
      setEnviando(true);

      const res = await fetch(`${API}/portalPacientes/insertarMensajePaciente`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
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
    <section className="mb-6 overflow-hidden rounded-[24px] border border-sky-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
      <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-indigo-50 px-5 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Enviar mensaje al paciente</h3>
            <p className="mt-1 text-sm text-slate-500">
              La indicación quedará visible en su portal y también se intentará enviar por correo.
            </p>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="w-fit rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cerrar
            </button>
          ) : null}
        </div>
      </div>

      <form onSubmit={enviarIndicacion} className="space-y-5 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <UserRound className="h-4 w-4 text-sky-600" />
              Paciente
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{nombrePaciente || "-"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Mail className="h-4 w-4 text-sky-600" />
              Correo destino
            </div>
            <p className="mt-2 break-all text-sm font-semibold text-slate-900">{correo || "Sin correo registrado"}</p>
          </div>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Título del mensaje</span>
          <input
            type="text"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            placeholder="Ej: Indicaciones posteriores al control"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Mensaje para el paciente</span>
          <textarea
            value={mensaje}
            onChange={(event) => setMensaje(event.target.value)}
            rows={6}
            placeholder="Escribe aquí la indicación clínica que el paciente verá en su portal."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </label>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            El mensaje se publicará directamente en la sección Mensajes de DashboardPacientes.
          </p>
          <button
            type="submit"
            disabled={enviando || !correo}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {enviando ? "Enviando..." : "Enviar indicación"}
          </button>
        </div>

        {ultimoEnvio ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <p className="font-semibold">Mensaje registrado: {ultimoEnvio.titulo}</p>
            <p className="mt-1">
              {ultimoEnvio.mailSent
                ? "El correo automático también fue aceptado."
                : `El mensaje quedó guardado, pero el correo falló: ${ultimoEnvio.mailError || "sin detalle"}.`}
            </p>
          </div>
        ) : null}
      </form>
    </section>
  );
}
