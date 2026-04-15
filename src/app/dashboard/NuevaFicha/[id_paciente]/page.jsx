"use client"

import {useParams} from "next/navigation";
import {useState, useEffect} from "react";
import {toast} from "react-hot-toast";
import {Textarea} from "@/components/ui/textarea";
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";
import ToasterClient from "@/Componentes/ToasterClient";
import Link from "next/link";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {useRouter} from "next/navigation";

export default function NuevaFicha() {

    const {id_paciente} = useParams();
    const [dataPaciente, setDataPaciente] = useState([]);
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    function retroceder(id_paciente) {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }

    const [tipoAtencion, setTipoAtencion] = useState("");
    const [motivoConsulta, setMotivoConsulta] = useState("");
    const [signosVitales, setSignosVitales] = useState("");
    const [observacionesPrecio, setObservacionesPrecio] = useState("");
    const [anotacionConsulta, setAnotacionConsulta] = useState("");
    const [anamnesis, setAnamnesis] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [indicaciones, setIndicaciones] = useState("");
    const [archivosAdjuntos, setArchivosAdjuntos] = useState("");
    const [fechaConsulta, setFechaConsulta] = useState("");
    const [consentimientoFirmado, setConsentimientoFirmado] = useState("");

    async function insertarFicha(
        id_paciente,
        tipoAtencion,
        motivoConsulta,
        signosVitales,
        observaciones,
        anotacionConsulta,
        anamnesis,
        diagnostico,
        indicaciones,
        archivosAdjuntos,
        fechaConsulta,
        consentimientoFirmado
    ) {
        try {
            if (!id_paciente) {
                return toast.error('Debe seleccionar un paciente para ingresar una nueva ficha.')
            } else {
                const res = await fetch(`${API}/ficha/insertarFichaClinica`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_paciente,
                        tipoAtencion,
                        motivoConsulta,
                        signosVitales,
                        observaciones,
                        anotacionConsulta,
                        anamnesis,
                        diagnostico,
                        indicaciones,
                        archivosAdjuntos,
                        fechaConsulta,
                        consentimientoFirmado
                    }),
                    mode: "cors"
                })

                if (!res.ok) {
                    return toast.error("Faltan datos para ingresar la nueva ficha.");
                }

                const respuestaQuery = await res.json();
                if (respuestaQuery.message === true) {
                    setConsentimientoFirmado("");
                    setArchivosAdjuntos("");
                    setIndicaciones("");
                    setDiagnostico("");
                    setAnamnesis("");
                    setAnotacionConsulta("");
                    setObservacionesPrecio("");
                    setSignosVitales("");
                    setMotivoConsulta("");
                    setTipoAtencion("");
                    return toast.success("Nueva ficha ingresada con Exito!");
                } else {
                    return toast.error("Faltan datos para ingresar la nueva ficha.");
                }
            }
        } catch (error) {
            console.log(error);
            return toast.error("Ha ocurrido un error en el servidor, Contacte a soporte tecnico de Medify");
        }
    }

    async function buscarPacientePorId(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error(
                    "No se puede cargar los datos del paciente seleccionado. Debe haber seleccionado el paciente para poder ver el detalle de los datos."
                );
            }

            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id_paciente}),
            });

            if (!res.ok) {
                return toast.error("No se puede cargar los datos del paciente seleccionado.");
            }

            const data = await res.json();
            setDataPaciente(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.log(error);
            return toast.error(
                "No se puede cargar los datos del paciente seleccionado. Por favor contacte a soporte de Medify"
            );
        }
    }

    useEffect(() => {
        if (!id_paciente) return;
        buscarPacientePorId(id_paciente);
    }, [id_paciente]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
            <ToasterClient/>

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 md:py-10">
                <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/90 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-sky-600">Ficha clínica</p>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                                Nueva Ficha Clínica
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                Registra la atención del paciente con una presentación más clara, ordenada y consistente con el dashboard.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-sky-200 bg-sky-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">Paciente</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {dataPaciente[0] ? `${dataPaciente[0].nombre} ${dataPaciente[0].apellido}` : "Cargando..."}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Consulta</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{fechaConsulta || "Sin fecha"}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Estado</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">Borrador</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                        <Link href={"/dashboard/FichaClinica"}>
                            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                </svg>
                                Volver
                            </button>
                        </Link>

                        {dataPaciente.map((ficha, index) => (
                            <ShadcnButton
                                key={index}
                                funcion={() => retroceder(ficha.id_paciente)}
                                nombre={"Fichas"}
                            />
                        ))}
                    </div>
                </div>

                {dataPaciente.map((paciente) => (
                    <div
                        key={paciente.id_paciente}
                        className="mb-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
                    >
                        <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(8,145,178,0.94)_100%)] px-5 py-4">
                            <div className="flex flex-col gap-1">
                                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-200">Paciente</p>
                                <h2 className="text-lg font-bold text-white">Datos del paciente</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-sky-200 bg-sky-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">ID paciente</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">#{paciente.id_paciente}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Nombre</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.nombre}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Apellido</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.apellido}</p>
                            </div>
                            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">RUT</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.rut}</p>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                    <div className="space-y-6 xl:col-span-3">
                        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                                        Información de la consulta
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Fecha, motivo y profesional responsable de la atención.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5 p-5 md:p-6">
                                <div className="max-w-sm">
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Fecha de Consulta
                                    </label>
                                    <p className="mb-2 text-xs text-slate-400">Selecciona la fecha correspondiente al registro clínico</p>
                                    <ShadcnDatePicker
                                        className="border-slate-300 focus:border-sky-500"
                                        label=""
                                        value={fechaConsulta}
                                        onChange={(fecha) => setFechaConsulta(fecha)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Motivo Consulta
                                        </label>
                                        <p className="mb-2 text-xs text-slate-400">Motivo principal de la visita</p>
                                        <ShadcnInput
                                            value={tipoAtencion}
                                            placeholder="Ej: Seguimiento, Tratamiento, Evaluación..."
                                            onChange={(e) => setTipoAtencion(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                            Profesional
                                        </label>
                                        <p className="mb-2 text-xs text-slate-400">Profesional a cargo de la atención</p>
                                        <ShadcnInput
                                            value={observacionesPrecio}
                                            placeholder="Ej: Dra. Andrea Moran"
                                            onChange={(e) => setObservacionesPrecio(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                                        Anotaciones clínicas
                                    </h2>
                                    <p className="text-xs text-slate-500">
                                        Registra hallazgos, procedimiento realizado, materiales indicados, evolución y plan de control.
                                    </p>
                                </div>
                            </div>

                            <div className="p-5 md:p-6">
                                <Textarea
                                    className="min-h-[220px] resize-none border-slate-300 text-sm leading-6 focus:border-sky-500 focus:ring-sky-500/20"
                                    value={anotacionConsulta}
                                    onChange={(e) => setAnotacionConsulta(e.target.value)}
                                    placeholder="Ej: Odontograma: 3.6 caries O; se realiza resina; anestesia local; se indican cuidados y control en 7 días."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 xl:col-span-2">
                        <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(49,46,129,0.95)_100%)] px-5 py-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-200">Registro clínico</p>
                                    <h2 className="text-lg font-bold text-white">Diagnóstico e indicaciones</h2>
                                </div>
                            </div>

                            <div className="space-y-5 p-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Diagnóstico
                                    </label>
                                    <p className="mb-2 text-xs text-slate-400">Diagnóstico clínico del paciente</p>
                                    <ShadcnInput
                                        value={diagnostico}
                                        placeholder="Ej: Caries dental activa en molar 3.6 (lesión oclusal)"
                                        onChange={(e) => setDiagnostico(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                                        Indicaciones
                                    </label>
                                    <p className="mb-2 text-xs text-slate-400">Indicaciones post-atención para el paciente</p>
                                    <Textarea
                                        className="min-h-[160px] resize-none border-slate-300 text-sm leading-6 focus:border-sky-500 focus:ring-sky-500/20"
                                        value={indicaciones}
                                        onChange={(e) => setIndicaciones(e.target.value)}
                                        placeholder="Ej: Mantener higiene oral estricta: cepillado suave 3 veces al día + uso de hilo dental nocturno."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-slate-200/80 pt-6 sm:flex-row">
                    <Link href={"/dashboard/FichaClinica"}>
                        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-50 sm:w-auto">
                            Cancelar
                        </button>
                    </Link>

                    <button
                        onClick={() => insertarFicha(
                            id_paciente,
                            tipoAtencion,
                            motivoConsulta,
                            signosVitales,
                            observacionesPrecio,
                            anotacionConsulta,
                            anamnesis,
                            diagnostico,
                            indicaciones,
                            archivosAdjuntos,
                            fechaConsulta,
                            consentimientoFirmado
                        )}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:from-sky-700 hover:to-cyan-600 sm:w-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Guardar Ficha Clínica
                    </button>
                </div>
            </div>
        </div>
    );
}
