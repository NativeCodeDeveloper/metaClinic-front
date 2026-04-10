'use client'
import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales";
import {InfoButton} from "@/Componentes/InfoButton";

export default function ReecetasPacientes() {
    const {id_paciente} = useParams();
    const router = useRouter();
    const API = process.env.NEXT_PUBLIC_API_URL;

    const [detallePaciente, setDetallePaciente] = useState([]);
    const [cargando, setCargando] = useState(true);

    async function buscarPacientePorId(idPaciente) {
        try {
            if (!idPaciente) {
                return toast.error("No se puede cargar el paciente seleccionado.");
            }

            setCargando(true);

            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_paciente: idPaciente})
            });

            if (!res.ok) {
                return toast.error("No se pudo cargar la información del paciente.");
            }

            const dataPaciente = await res.json();
            setDetallePaciente(Array.isArray(dataPaciente) ? dataPaciente : [dataPaciente]);
        } catch (error) {
            console.log(error);
            return toast.error("Ha ocurrido un problema al obtener los datos del paciente.");
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        if (!id_paciente) return;
        buscarPacientePorId(id_paciente);
    }, [id_paciente]);

    function calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento) return "-";
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        return edad;
    }

    function previsionDeterminacion(id_prevision) {
        if (id_prevision === 1) return "NO APLICA";
        if (id_prevision === 2) return "ISAPRE";
        return "SIN DEFINIR";
    }

    function volverAFichas() {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }

    const paciente = detallePaciente[0];



    async function insertarFichasPaciente(
        nombre_paciente,
        apellido_paciente,
        rut_paciente,
        id_paciente,
        id_profesional,
        profesional_responsable,
        descripcion_receta
        ) {
        try {


        }catch (error) {
            return toast.error(`Ha ocurrido un error en el servidor porfavor contacte a soporte`);
        }
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.10),_transparent_28%),radial-gradient(circle_at_right,_rgba(6,182,212,0.10),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_55%,_#f8fafc_100%)]">
            <ToasterClient/>

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 md:py-10">
                <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-violet-600">Emisión de receta</p>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                Receta médica para {paciente ? `${paciente.nombre} ${paciente.apellido}` : "paciente"}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                Vista previa del paciente antes de generar o completar la receta clínica.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Paciente</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {paciente ? `${paciente.nombre} ${paciente.apellido}` : "Cargando..."}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Rut</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{paciente?.rut || "-"}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">ID Paciente</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{id_paciente}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <InfoButton informacion={"En esta vista se muestran los datos base del paciente para preparar la receta médica. Puede usar esta información como contexto previo antes de completar la emisión del documento."}/>
                            <span className="text-sm text-slate-500">Resumen clínico previo a la receta</span>
                        </div>
                        <button
                            onClick={volverAFichas}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Volver a fichas
                        </button>
                    </div>
                </div>

                {cargando ? (
                    <div className="rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                        Cargando datos del paciente...
                    </div>
                ) : !paciente ? (
                    <div className="rounded-[28px] border border-dashed border-rose-200 bg-white p-10 text-center text-sm text-rose-500 shadow-sm">
                        No fue posible encontrar información del paciente.
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                            <div className="flex flex-col gap-4 bg-[linear-gradient(135deg,#0f172a_0%,#312e81_58%,#0891b2_100%)] px-5 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-sm font-bold tracking-wide text-white backdrop-blur-sm">
                                        {paciente.nombre?.charAt(0)}{paciente.apellido?.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight text-white">
                                            {paciente.nombre} {paciente.apellido}
                                        </h2>
                                        <p className="text-sm text-slate-200">Preparación de receta individual</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                                        Previsión: {previsionDeterminacion(paciente.prevision_id)}
                                    </span>
                                    <span className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                                        Edad: {calcularEdad(paciente.nacimiento)} años
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 p-5 md:grid-cols-2 md:p-6 xl:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Nombre completo</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.nombre} {paciente.apellido}</p>
                                </div>
                                <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Rut</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.rut || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Nacimiento</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{formatearFecha(paciente.nacimiento)}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Sexo</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.sexo || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Teléfono</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.telefono || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Correo</p>
                                    <p className="mt-1 break-all text-sm font-semibold text-slate-900">{paciente.correo || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2 xl:col-span-2">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Dirección</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.direccion || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">País</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.pais || "-"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(49,46,129,0.95)_100%)] px-5 py-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-200">Acciones</p>
                                        <h2 className="text-xl font-bold text-white">Siguiente paso de emisión</h2>
                                    </div>
                                    <span className="inline-flex w-fit items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
                                        Vista previa activa
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3 md:p-6">
                                <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Paciente validado</p>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                        Los datos demográficos ya están disponibles para asociarlos a la receta.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Módulo listo</p>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                        Esta vista quedó preparada para integrar medicamentos, indicaciones y exportación.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Estado actual</p>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                        Pendiente de incorporar el formulario específico de receta médica.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 border-t border-slate-100 px-5 py-4 md:px-6">
                                <button
                                    onClick={volverAFichas}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100"
                                >
                                    Volver al historial
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(79,70,229,0.28)] transition-all duration-150 hover:from-violet-700 hover:to-indigo-700"
                                >
                                    Continuar con receta
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
