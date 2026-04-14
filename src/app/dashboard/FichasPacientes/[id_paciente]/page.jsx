"use client"
import {useParams} from "next/navigation";
import {useState, useEffect} from "react";
import {toast} from "react-hot-toast";
import ToasterClient from "@/Componentes/ToasterClient";
import formatearFecha from "@/FuncionesTranversales/funcionesTranversales.js"
import {ShadcnButton} from "@/Componentes/shadcnButton";
import {useRouter} from "next/navigation";
import {ShadcnInput} from "@/Componentes/shadcnInput";
import {ShadcnSelect} from "@/Componentes/shadcnSelect";
import ShadcnDatePicker from "@/Componentes/shadcnDatePicker";
import * as React from "react";
import {CheckboxIcon} from "@radix-ui/react-icons";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {InfoButton} from "@/Componentes/InfoButton";


export default function Paciente() {

    const {id_paciente} = useParams();
    const [detallePaciente, setDetallePaciente] = useState([])
    const API = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [mostrarTelemedicina, setMostrarTelemedicina] = useState(false);
    const [linkTelemedicina, setLinkTelemedicina] = useState("");

    function nuevaFichaClinica() {
        router.push(`/dashboard/NuevaFicha/${id_paciente}`);
    }


    function verOdontogramas() {
        router.push(`/dashboard/odontogramasPaciente/${id_paciente}`);
    }


    function verEvaluaciones() {
        router.push(`/dashboard/evaluacionClinica/${id_paciente}`);
    }

    function editarFichaClinica(id_ficha) {
        router.push(`/dashboard/EdicionFicha/${id_ficha}`);
    }

    function agendarPaciente() {
        const paciente = detallePaciente[0];
        if (!paciente) return;
        const params = new URLSearchParams({
            nombre: paciente.nombre || "",
            apellido: paciente.apellido || "",
            rut: paciente.rut || "",
            telefono: paciente.telefono || "",
            email: paciente.correo || "",
        });
        router.push(`/dashboard/calendario?${params.toString()}`);
    }

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [rut, setRut] = useState("");
    const [nacimiento, setNacimiento] = useState("");
    const [sexo, setSexo] = useState("");
    const [prevision, setPrevision] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [pais, setPais] = useState("");

    const [checked, setChecked] = useState(true);

    const [tipoAtencion, setTipoAtencion] = useState("");
    const [motivoConsulta, setMotivoConsulta] = useState("");
    const [signosVitales, setSignosVitales] = useState("");
    const [observaciones, setObservaciones] = useState("");
    const [anotacionConsulta, setAnotacionConsulta] = useState("");
    const [anamnesis, setAnamnesis] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [indicaciones, setIndicaciones] = useState("");
    const [archivosAdjuntos, setArchivosAdjuntos] = useState("");
    const [fechaConsulta, setFechaConsulta] = useState("");
    const [estadoFicha, setEstadoFicha] = useState("");
    const [consentimientoFirmado, setConsentimientoFirmado] = useState("");

    const [listaFichas, setListaFichas] = useState([]);

    async function eliminarFicha(id_ficha) {
        try {
            if (!id_ficha) {
                return toast.error("Debe seleccionar al menos una ficha clinica");
            }

            const res = await fetch(`${API}/ficha/eliminarFichaClinica`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_ficha}),
                mode: "cors",
                cache: "no-cache"
            })

            if (!res.ok) {
                return toast.error("No se puedo eliminar la ficha , contacte a soporte informatico");
            } else {
                const resultadoBackend = await res.json();
                if (resultadoBackend.message === true) {
                    await listarFichasClinicasPaciente(id_paciente)
                    return toast.success("Se ha eliminado la ficha con exito!")
                } else {
                    return toast.error("No se ha podido eliminar la ficha por favor intente mas tarde")
                }
            }
        } catch (error) {
            return toast.error("Ha ocurrido un error contacte a soporte tecnico");
        }
    }

    async function listarFichasClinicasPaciente(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error("No se ha seleccionado ningun Id, si el problema persiste contcate a soporte de Medify")
            } else {
                const res = await fetch(`${API}/ficha/seleccionarFichasPaciente`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id_paciente}),
                    mode: "cors"
                })

                if (!res.ok) {
                    return toast.error("Ha ocurrido un error Contacte a soporte de Medify")
                }

                const dataFichasClinicas = await res.json();
                setListaFichas(dataFichasClinicas);
            }
        } catch (e) {
            console.log(e)
            return toast.error("Ha ocurrido un error en el servidor: " + e)
        }
    }

    function volverAFichas() {
        router.push("/dashboard/FichaClinica");
    }

    async function actualizarDatosPacientes(nombre, apellido, rut, nacimiento, sexo, prevision, telefono, correo, direccion, pais, id_paciente) {

        let prevision_id = null;

        if (prevision.includes("FONASA")) {
            prevision_id = 1
        } else if (prevision.includes("ISAPRE")) {
            prevision_id = 2
        } else {
            prevision_id = 0
        }

        try {
            if (!nombre || !apellido || !rut || !nacimiento || !sexo || !prevision_id || !telefono || !correo || !direccion || !pais || !id_paciente) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion")
            }

            const res = await fetch(`${API}/pacientes/pacientesActualizar`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                mode: "cors",
                body: JSON.stringify({
                    nombre,
                    apellido,
                    rut,
                    nacimiento,
                    sexo,
                    prevision_id,
                    telefono,
                    correo,
                    direccion,
                    pais,
                    id_paciente
                })
            })

            if (!res.ok) {
                return toast.error("Debe llenar todos los campos para proceder con la actualziacion")
            } else {
                const resultadoQuery = await res.json();
                if (resultadoQuery.message === true) {
                    setNombre("");
                    setApellido("");
                    setNacimiento("");
                    setTelefono("");
                    setCorreo("");
                    setDireccion("");
                    setRut("");
                    setSexo("");
                    setPais("");
                    await buscarPacientePorId(id_paciente);
                    return toast.success("Datos del paciente actualizados con Exito!");
                } else {
                    return toast.error("No se han podido Actualizar los datos del paciente. Intente mas tarde.")
                }
            }
        } catch (err) {
            console.log(err);
            return toast.error("Ha ocurrido un problema en el servidor")
        }
    }

    async function buscarPacientePorId(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error("No se puede cargar los datos del paciente seleccionado. Debe haber seleccionado el paciente para poder ver el detalle de los datos.");
            }
            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({id_paciente})
            })

            if (!res.ok) {
                return toast.error("No se puede cargar los datos del paciente seleccionado.");
            }

            const dataPaciente = await res.json();
            setDetallePaciente(Array.isArray(dataPaciente) ? dataPaciente : [dataPaciente]);

        } catch (error) {
            console.log(error);
            return toast.error("No se puede cargar los datos del paciente seleccionado. Por favor contacte a soporte de Medify");
        }
    }

    useEffect(() => {
        if (!id_paciente) return;
        buscarPacientePorId(id_paciente)
    }, [id_paciente]);

    function calcularEdad(fechaNacimiento) {
        if (!fechaNacimiento) return '-';
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
        if (id_prevision === 2) return "NO APLICA";
        return "SIN DEFINIR";
    }


    function irAReceta(id_paciente) {
        router.push(`/dashboard/recetaPacientes/${id_paciente}`);
    }

    async function enviarLinkTelemedicina() {
        const paciente = detallePaciente[0];

        if (!paciente) {
            return toast.error("No hay datos del paciente para enviar el enlace.");
        }

        if (!linkTelemedicina.trim()) {
            return toast.error("Debe ingresar un link de videollamada.");
        }

        if (!paciente.correo) {
            return toast.error("El paciente no tiene correo registrado.");
        }

        const linkNormalizado = linkTelemedicina.trim();

        if (!/^https?:\/\//i.test(linkNormalizado)) {
            return toast.error("El link debe comenzar con http:// o https://");
        }

        const asunto = "Acceso a telemedicina";
        const mensaje = [
            `Hola ${paciente.nombre || "paciente"} ${paciente.apellido || ""},`,
            "",
            "Te compartimos el enlace para tu atención por telemedicina:",
            linkNormalizado,
            "",
            "Por favor ingresa a la sala unos minutos antes de la hora acordada.",
            "",
            "Si tienes algún inconveniente para acceder, responde este correo."
        ].join("\n");

        try {
            const res = await fetch(`${API}/correo/seguimiento`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    asunto,
                    email: paciente.correo,
                    mensaje
                }),
                mode: "cors"
            });

            if (!res.ok) {
                return toast.error("No fue posible enviar el correo de telemedicina.");
            }

            const respuestaBackend = await res.json();

            if (respuestaBackend.message === true) {
                return toast.success("Link de telemedicina enviado al paciente.");
            }

            return toast.error("El servidor no pudo enviar el enlace al paciente.");
        } catch (error) {
            console.log(error);
            return toast.error("Ocurrió un problema al enviar el enlace de telemedicina.");
        }
    }

    const pacienteActual = detallePaciente[0];
    const totalFichas = listaFichas.length;

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.10),_transparent_28%),radial-gradient(circle_at_right,_rgba(6,182,212,0.10),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_55%,_#f8fafc_100%)]">
            <ToasterClient/>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">

                {/* Header */}
                <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-violet-600">Historial del paciente</p>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                                Carpeta clínica de {pacienteActual ? `${pacienteActual.nombre} ${pacienteActual.apellido}` : "paciente"}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600">
                                Visualiza fichas, evaluaciones y accesos clínicos desde una misma vista con la misma línea visual del dashboard.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-violet-200 bg-violet-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Paciente</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {pacienteActual ? `${pacienteActual.nombre} ${pacienteActual.apellido}` : "Cargando..."}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Rut</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{pacienteActual?.rut || "-"}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Fichas</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">{totalFichas}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <InfoButton informacion={'En este apartado se mostrarán las fichas clínicas del paciente, ordenadas desde la más reciente a la más antigua, incluyendo tanto las fichas como sus anotaciones asociadas.\n\nPara editar una ficha clínica, debe seleccionarse el botón Editar, lo que lo llevará al formulario correspondiente donde podrá modificar la información de la ficha seleccionada.\n\nEn caso de eliminar una ficha clínica, deberá presionar el botón Eliminar. Esta acción removerá la ficha seleccionada del sistema.\n\nSi desea crear una nueva ficha clínica, debe seleccionar el botón Nueva Ficha, el cual lo dirigirá al formulario de ingreso para registrar una nueva ficha clínica.'}/>
                            <span className="text-sm text-slate-500">Panel clínico del paciente seleccionado</span>
                        </div>
                        <button
                            onClick={() => volverAFichas()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Volver
                        </button>
                    </div>
                </div>

                {/* Tarjeta paciente */}
                {detallePaciente.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400 shadow-sm">
                        Cargando datos del paciente...
                    </div>
                ) : (
                    detallePaciente.map(paciente => (
                        <div key={paciente.id_paciente} className="mb-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                            <div className="bg-[linear-gradient(135deg,#0f172a_0%,#312e81_58%,#0891b2_100%)] px-5 md:px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
                                        <span className="text-sm font-bold tracking-wide text-white">
                                            {paciente.nombre?.charAt(0)}{paciente.apellido?.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white tracking-tight">
                                            {paciente.nombre} {paciente.apellido}
                                        </h2>
                                        <p className="text-sm text-slate-200">RUT: {paciente.rut}</p>
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
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Nacimiento</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{formatearFecha(paciente.nacimiento)}</p>
                                </div>
                                <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-500">Sexo</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{paciente.sexo || "-"}</p>
                                </div>
                                <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Teléfono</p>
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
                            </div>
                        </div>
                    ))
                )}

                {/* Barra de acciones */}
                <div className="mb-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                    <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(49,46,129,0.95)_100%)] px-5 py-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-200">Registro clínico</p>
                                    <h2 className="text-xl font-bold text-white">Fichas registradas</h2>
                                </div>
                            </div>
                            <span className="inline-flex w-fit items-center justify-center rounded-full border border-violet-300/20 bg-white/10 px-3 py-1.5 text-sm font-bold text-white">
                                {totalFichas} fichas
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 px-5 py-4">
                        <button
                            onClick={agendarPaciente}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(79,70,229,0.28)] transition-all duration-150 hover:from-violet-700 hover:to-indigo-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Agendar ahora
                        </button>


                        <button
                            onClick={()=> irAReceta(id_paciente)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(14,165,233,0.24)] transition-all duration-150 hover:from-cyan-600 hover:to-sky-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                            </svg>
                            Generar Receta Medica
                        </button>
                        <button
                            onClick={() => setMostrarTelemedicina((estadoActual) => !estadoActual)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,23,42,0.20)] transition-all duration-150 hover:from-slate-900 hover:to-slate-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-6 4h4a2 2 0 002-2V8a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                            Telemedicina
                        </button>





                        <button
                            onClick={() => listarFichasClinicasPaciente(id_paciente)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                            Cargar Fichas
                        </button>

                        <button
                            onClick={() =>  verEvaluaciones()}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-150 hover:border-slate-300 hover:bg-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                            </svg>
                            Evaluacion
                        </button>
                        <button
                            onClick={() => nuevaFichaClinica(id_paciente)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(59,130,246,0.24)] transition-all duration-150 hover:from-indigo-700 hover:to-cyan-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                            </svg>
                            Nueva Ficha
                        </button>
                    </div>
                </div>

                {mostrarTelemedicina ? (
                    <div className="mb-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
                        <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">Enlace de telemedicina</h3>
                            <p className="mt-1 text-sm text-slate-500">Pega aquí un link de Google Meet, Zoom o cualquier plataforma de consulta remota y envíalo por correo al paciente.</p>
                        </div>
                        <div className="space-y-4 p-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Paciente</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {pacienteActual ? `${pacienteActual.nombre} ${pacienteActual.apellido}` : "-"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Correo destino</p>
                                    <p className="mt-1 break-all text-sm font-semibold text-slate-900">{pacienteActual?.correo || "-"}</p>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">Link de videollamada</label>
                                <input
                                    type="url"
                                    value={linkTelemedicina}
                                    onChange={(e) => setLinkTelemedicina(e.target.value)}
                                    placeholder="Ej: https://meet.google.com/abc-defg-hij"
                                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={enviarLinkTelemedicina}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:from-sky-700 hover:to-cyan-600"
                                >
                                    Enviar al paciente
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLinkTelemedicina("");
                                        setMostrarTelemedicina(false);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-150 hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Listado de fichas */}
                <div className="space-y-4">
                    {listaFichas.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p className="text-sm font-medium text-slate-400">No hay fichas cargadas</p>
                            <p className="text-xs text-slate-300 mt-1">Presione "Cargar Fichas" para visualizar el historial</p>
                        </div>
                    ) : (
                        listaFichas.map((ficha) => (
                            <div key={ficha.id_ficha} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(15,23,42,0.10)]">

                                {/* Cabecera ficha */}
                                <div className="flex flex-col gap-3 border-b border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(241,245,249,0.8)_100%)] px-5 py-4 md:px-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                                </svg>
                                            </div>
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
                                                <span className="text-base font-bold text-slate-900">Ficha Clínica № {ficha.id_ficha}</span>
                                                <span className="hidden text-slate-300 sm:inline">|</span>
                                                <span className="inline-flex items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-1.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                    </svg>
                                                    <span className="text-sm font-semibold text-cyan-800">{formatearFecha(ficha.fechaConsulta)}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-[52px] flex items-center gap-2 sm:ml-0">
                                        <button
                                            onClick={() => editarFichaClinica(ficha.id_ficha)}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 transition-colors duration-150 hover:bg-violet-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                            </svg>
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarFicha(ficha.id_ficha)}
                                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors duration-150 hover:bg-rose-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                            </svg>
                                            Eliminar
                                        </button>
                                        </div>
                                    </div>
                                    {/* Chips: Motivo + Profesional */}
                                    <div className="ml-[52px] flex flex-wrap items-center gap-2 sm:ml-0">
                                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                                            <span className="text-violet-400">Motivo:</span> {ficha.tipoAtencion || '-'}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                                            <span className="text-cyan-500">Profesional:</span> {ficha.observaciones || '-'}
                                        </span>
                                    </div>
                                </div>

                                {/* Cuerpo ficha */}
                                <div className="px-5 md:px-6 py-4">

                                    {/* Diagnóstico e Indicaciones */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                        <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Diagnóstico</span>
                                            <span className="text-sm font-medium text-slate-800">{ficha.diagnostico || '-'}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 rounded-2xl border border-cyan-200 bg-cyan-50/70 px-4 py-3">
                                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-600">Indicaciones</span>
                                            <span className="text-sm font-medium text-slate-800">{ficha.indicaciones || '-'}</span>
                                        </div>
                                    </div>

                                    {/* Anotación clínica */}
                                    <div className="border-t border-slate-100 pt-4">
                                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Anotación clínica</p>
                                        <p className="whitespace-pre-line rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
                                            {ficha.anotacionConsulta || 'Sin anotaciones registradas.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}
