"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserPlus, LockKeyhole, Mail, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export default function CrearUsuariosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [lastCreatedUser, setLastCreatedUser] = useState(null);
  const source = searchParams.get("source");
  const idPaciente = searchParams.get("id_paciente");

  useEffect(() => {
    const firstName = searchParams.get("firstName") || "";
    const lastName = searchParams.get("lastName") || "";
    const email = searchParams.get("email") || "";

    if (!firstName && !lastName && !email) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      firstName,
      lastName,
      email,
    }));
  }, [searchParams]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      return toast.error("Completa todos los campos obligatorios.");
    }

    if (formData.password.trim().length < 8) {
      return toast.error("La contrasena debe tener al menos 8 caracteres.");
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/admin/clerk-users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const respuestaBackend = await response.json();

      if (!response.ok) {
        return toast.error(
          respuestaBackend?.message ||
            "No fue posible crear el usuario en Clerk."
        );
      }

      setLastCreatedUser(respuestaBackend);
      setFormData(initialForm);
      if (respuestaBackend?.credentialsEmailSent) {
        toast.success("Usuario creado y correo de acceso enviado correctamente.");
      } else {
        toast.success("Usuario creado correctamente en Clerk.");
        toast.error(
          respuestaBackend?.credentialsEmailError ||
            "El usuario fue creado, pero no se pudo enviar el correo de acceso."
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocurrio un error inesperado al crear el usuario.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.12),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <ToasterClient />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_26px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Gestion de accesos
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Crear usuarios restringidos para seguimiento
              </h1>
            </div>
          </div>

          {source === "fichaPaciente" && idPaciente ? (
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Este flujo fue abierto desde la carpeta clínica del paciente.
              </p>
              <button
                type="button"
                onClick={() => router.push(`/dashboard/FichasPacientes/${idPaciente}`)}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100"
              >
                Volver a carpeta del paciente
              </button>
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_26px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-[0_18px_45px_rgba(6,182,212,0.28)]">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Datos del nuevo usuario
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  El administrador define las credenciales iniciales.
                </p>
              </div>
            </div>

            {searchParams.get("source") === "fichaPaciente" ? (
              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Se precargaron nombre y correo desde la ficha del paciente. Solo falta definir la contraseña inicial para crear su acceso de seguimiento.
              </div>
            ) : null}

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <UserRound className="h-4 w-4 text-cyan-600" />
                  Nombre
                </span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nombre del usuario"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-cyan-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <UserRound className="h-4 w-4 text-cyan-600" />
                  Apellido
                </span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Apellido del usuario"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-cyan-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Mail className="h-4 w-4 text-cyan-600" />
                  Correo electronico
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="usuario@clinica.com"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-cyan-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                  <LockKeyhole className="h-4 w-4 text-cyan-600" />
                  Contrasena inicial
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimo 8 caracteres"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all focus:border-cyan-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)]"
                />
              </label>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                El nuevo usuario iniciara sesion con correo y contrasena y solo podra entrar a la vista de pacientes.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-600 to-indigo-700 px-6 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition-all hover:from-cyan-500 hover:to-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Creando usuario..." : "Crear usuario"}
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Ultimo usuario creado
              </div>

              {lastCreatedUser ? (
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Usuario registrado correctamente en Clerk.
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="font-medium text-slate-900">
                      {lastCreatedUser.firstName} {lastCreatedUser.lastName}
                    </div>
                    <div className="mt-1">{lastCreatedUser.email}</div>
                    <div className="mt-2 inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                      {lastCreatedUser.role}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  Aun no se ha creado un usuario desde esta pantalla.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
