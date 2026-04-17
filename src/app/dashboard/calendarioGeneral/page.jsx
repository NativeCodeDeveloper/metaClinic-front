"use client"

import {useState, useMemo, useEffect} from "react";
import {Calendar, dateFnsLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import ShadcnInput from "@/Componentes/shadcnInput2";
import ShadcnFechaHora from "@/Componentes/ShadcnFechaHora";
import ShadcnButton2 from "@/Componentes/shadcnButton2";
import ToasterClient from "@/Componentes/ToasterClient";
import {toast} from "react-hot-toast";


import es from "date-fns/locale/es";
import {SelectDinamic} from "@/Componentes/SelectDinamic";
import {InfoButton} from "@/Componentes/InfoButton";

const locales = {
    es: es,
};

const dfStartOfWeek = (date) => startOfWeek(date, {locale: es});

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: dfStartOfWeek,
    getDay,
    locales,
});

export default function Calendario() {

    const API = process.env.NEXT_PUBLIC_API_URL;

    // Estilos CSS personalizados para mejorar la visualización de eventos
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos para eventos en vista mes */
            .rbc-month-view .rbc-event {
                min-height: 0 !important;
                height: auto !important;
                padding: 2px 3px !important;
                line-height: 1.1 !important;
                white-space: normal !important;
                overflow: visible !important;
                word-break: break-word !important;
                font-size: 40% !important;
            }
            
            /* Estilos para eventos en vista semana y día */
            .rbc-time-view .rbc-event {
                min-height: 0 !important;
                padding: 1px 2px !important;
                line-height: 1.1 !important;
                white-space: normal !important;
                overflow: hidden !important;
                word-break: break-word !important;
                font-size: 40% !important;
            }
            
            /* Aumentar altura de las celdas del mes para que quepan los nombres */
            .rbc-month-view .rbc-day-slot {
                min-height: 80px !important;
            }
            
            /* Contenedor de eventos en mes */
            .rbc-row-segment {
                z-index: 1 !important;
            }
            
            /* Texto del evento */
            .rbc-event-label,
            .rbc-event-content {
                white-space: normal !important;
                overflow: visible !important;
                word-break: break-word !important;
                font-size: 40% !important;
            }

            .rbc-event-label {
                display: none !important;
            }

            .rbc-background-event {
                background-color: rgba(107, 114, 128, 0.28) !important;
                border: 1px solid rgba(107, 114, 128, 0.38) !important;
                border-left: 4px solid rgba(71, 85, 105, 0.95) !important;
                border-radius: 0 !important;
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16) !important;
            }

            .rbc-event {
                border-radius: 0 !important;
            }

            .rbc-toolbar,
            .rbc-header,
            .rbc-time-gutter,
            .rbc-agenda-view,
            .rbc-agenda-time-cell,
            .rbc-agenda-date-cell {
                font-size: 10px !important;
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState("month");


    const [nombrePaciente, setNombrePaciente] = useState("");
    const [apellidoPaciente, setApellidoPaciente] = useState("");
    const [rut, setRut] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [fechaInicio, setfechaInicio,] = useState("");
    const [fechaFinalizacion, setfechaFinalizacion,] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFinalizacion, setHoraFinalizacion] = useState("");
    const [estadoReserva, setEstadoReserva,] = useState("");
    const [id_reserva, setid_reserva] = useState(0);

    const [dataAgenda, setDataAgenda] = useState([]);
    const [dataBloqueos, setDataBloqueos] = useState([]);
    const [listaProfesionales, setListaProfesionales] = useState([]);
    const [id_profesional, setId_profesional] = useState("");
    const [backgroundCalendarEvents, setBackgroundCalendarEvents] = useState([]);

    async function seleccionarTodosProfesionalesCalendario() {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
                method: 'GET',
                headers: {Accept: 'application/json'},
                mode: 'cors'
            })
            if (!res.ok) {
                return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
            } else {
                const respustaBackend = await res.json();
                if (respustaBackend && respustaBackend.length > 0) {
                    setListaProfesionales(respustaBackend);
                    if (!id_profesional) {
                        setId_profesional(respustaBackend[0].id_profesional);
                    }
                } else {
                    return toast.error('No hay profesionales o servicios ingresados en el sistema');
                }
            }
        } catch (error) {
            return toast.error('Error al cargar los profesionales, por favor intente nuevamente.');
        }
    }

    useEffect(() => {
        seleccionarTodosProfesionalesCalendario();
    }, []);


    function formatearFechaLocal(d) {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        return `${y}-${m}-${day}`
    }

    const manejarFechaHoraInicio = (dateTime) => {
        setfechaInicio(formatearFechaLocal(dateTime))
        setHoraInicio(dateTime.toTimeString().slice(0, 8))
    }

    const manejarFechaHoraFinalizacion = (dateTime) => {
        setfechaFinalizacion(formatearFechaLocal(dateTime))
        setHoraFinalizacion(dateTime.toTimeString().slice(0, 8))
    }


    function convertirAFechaCalendario(fechaISO, hora) {
        const soloFecha = fechaISO.slice(0, 10);
        return new Date(`${soloFecha}T${hora}`);
    }

    function formatHoraCorta(date) {
        return format(date, "HH:mm", {locale: es});
    }

    function obtenerTituloReserva(cita) {
        const nombre = (cita?.nombrePaciente ?? "").trim();
        const apellido = (cita?.apellidoPaciente ?? "").trim();
        const inicialApellido = apellido ? `${apellido.charAt(0).toUpperCase()}.` : "";
        return [nombre, inicialApellido].filter(Boolean).join(" ");
    }

    function obtenerTooltipEvento(event) {
        if (event?.tipo === "bloqueo") {
            return event.title || "Bloqueo";
        }

        if (event?.tipo === "reserva") {
            const nombre = (event.resource?.nombrePaciente ?? "").trim();
            const apellido = (event.resource?.apellidoPaciente ?? "").trim();
            const horario = event.start && event.end
                ? `${formatHoraCorta(event.start)} - ${formatHoraCorta(event.end)}`
                : "";
            return [nombre, apellido, horario].filter(Boolean).join(" | ");
        }

        return event?.title || "";
    }

    function estaFechaBloqueada(date) {
        if (!dataBloqueos || dataBloqueos.length === 0) return false;

        const fechaEvaluada = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        for (const bloqueo of dataBloqueos) {
            const fechaIniStr = (bloqueo.fechaInicio ?? "").slice(0, 10);
            const fechaFinStr = (bloqueo.fechaFinalizacion ?? "").slice(0, 10);
            const primerDia = new Date(`${fechaIniStr}T00:00:00`);
            const ultimoDia = new Date(`${fechaFinStr}T00:00:00`);

            if (isNaN(primerDia.getTime()) || isNaN(ultimoDia.getTime())) continue;

            const inicioNormalizado = new Date(primerDia.getFullYear(), primerDia.getMonth(), primerDia.getDate());
            const finNormalizado = new Date(ultimoDia.getFullYear(), ultimoDia.getMonth(), ultimoDia.getDate());

            if (fechaEvaluada >= inicioNormalizado && fechaEvaluada <= finNormalizado) {
                return true;
            }
        }

        return false;
    }

    // Helper: comprueba si un rango [start, end) se solapa con alguna reserva en dataAgenda
    function isOverlapping(start, end) {
        if (!dataAgenda || dataAgenda.length === 0) return false;

        // Normalizamos a Date para comparar
        for (const cita of dataAgenda) {
            const evStart = convertirAFechaCalendario((cita.fechaInicio ?? "").slice(0, 10), (cita.horaInicio ?? "00:00:00"));
            const evEnd = convertirAFechaCalendario((cita.fechaFinalizacion ?? "").slice(0, 10), (cita.horaFinalizacion ?? "00:00:00"));

            // Si cualquier parte se solapa
            if (start < evEnd && end > evStart) {
                return true;
            }
        }

        return false;
    }


    async function cargarDataAgenda() {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarReservados`, {
                method: "GET",
                headers: {Accept: "application/json"}
            })

            if (!res.ok) {
                return toast.error('No fue posible cargar las agendas, Contacte a soporte de Medify')
            }

            const data = await res.json();
            setDataAgenda(data);

        } catch (err) {
            return toast.error(err.message)
        }
    }

    async function cargarDataPorProfesional(idProf) {
        try {
            const res = await fetch(`${API}/reservaPacientes/seleccionarPorProfesional`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_profesional: idProf})
            });
            if (!res.ok) return toast.error('No fue posible cargar las agendas del profesional');
            const data = await res.json();
            setDataAgenda(Array.isArray(data) ? data : []);
        } catch (err) {
            return toast.error(err.message);
        }
    }

    async function cargarBloqueosPorProfesional(id_profesional) {
        try {
            const res = await fetch(`${API}/bloqueoAgenda/seleccionarBloqueosPorProfesional`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_profesional})
            });
            if (!res.ok) return;
            const data = await res.json();
            setDataBloqueos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
        }
    }

    async function refrescarCalendario() {
        if (id_profesional) {
            await cargarDataPorProfesional(id_profesional);
            await cargarBloqueosPorProfesional(id_profesional);
        }
    }

    useEffect(() => { cargarDataAgenda(); }, []);

    useEffect(() => {
        if (id_profesional) {
            cargarDataPorProfesional(id_profesional);
            cargarBloqueosPorProfesional(id_profesional);
        } else {
            cargarDataAgenda();
        }
    }, [id_profesional]);


    async function insertarNuevaReserva(
        nombrePaciente,
        apellidoPaciente,
        rut,
        telefono,
        email,
        fechaInicio,
        horaInicio,
        fechaFinalizacion,
        horaFinalizacion
    ) {
        try {

            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !horaFinalizacion) {
                return toast.error('Debe llenar todos los campos');
            }

            const ahora = new Date();
            const inicio = new Date(`${fechaInicio}T${horaInicio}`);
            const final = new Date(`${fechaFinalizacion}T${horaFinalizacion}`);

            if (inicio < ahora) {
                return toast.error("No es posible agendar en fechas NO vigentes")
            }

            if (final < inicio) {
                return toast.error("No es posible en fechas irreales")
            }

            // Validación local: si el rango se solapa con alguna reserva ya cargada, evitar llamar al servidor
            if (isOverlapping(inicio, final)) {
                return toast.error('La hora seleccionada ya está ocupada (verifique otras horas)');
            }


            if (fechaInicio === fechaFinalizacion) {

                const res = await fetch(`${API}/reservaPacientes/insertarReserva`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    mode: "cors",
                    body: JSON.stringify({
                        nombrePaciente,
                        apellidoPaciente,
                        rut,
                        telefono,
                        email,
                        fechaInicio,
                        horaInicio,
                        fechaFinalizacion,
                        horaFinalizacion,
                        estadoReserva: "reservada"
                    })
                })


                const respuestaBackend = await res.json();

                if (respuestaBackend.message === true) {
                    setNombrePaciente("");
                    setApellidoPaciente("");
                    setTelefono("");
                    setRut("");
                    setEmail("");
                    await refrescarCalendario();
                    return toast.success("Se ha ingresado correctamente el agendamiento")

                } else if (respuestaBackend.message === "conflicto" || respuestaBackend.message.includes("conflicto")) {
                    return toast.error("No puede agendar una hora que ya esta ocupada")

                } else if (respuestaBackend.message === false) {
                    return toast.error('Asegure que no esta ocupada la Hora');

                }


            } else {
                return toast.error("Solo se permite agendar si es en el mismo dia")
            }


        } catch (error) {
            console.log(error);
            return toast.error('Sin respuesta del servidor contacte a soporte.');

        }
    }


    const messages = useMemo(
        () => ({
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            noEventsInRange: "No hay eventos",
        }),
        []
    );

    function expandirBloqueosPorDiaCompleto(bloqueos) {
        const resultado = [];

        for (const bloqueo of bloqueos || []) {
            const fechaIniStr = (bloqueo.fechaInicio ?? "").slice(0, 10);
            const fechaFinStr = (bloqueo.fechaFinalizacion ?? "").slice(0, 10);
            const primerDia = new Date(`${fechaIniStr}T00:00:00`);
            const ultimoDia = new Date(`${fechaFinStr}T00:00:00`);

            if (isNaN(primerDia.getTime()) || isNaN(ultimoDia.getTime())) continue;

            let cursor = new Date(primerDia);
            while (cursor <= ultimoDia) {
                const y = cursor.getFullYear();
                const m = String(cursor.getMonth() + 1).padStart(2, "0");
                const d = String(cursor.getDate()).padStart(2, "0");
                const fechaDia = `${y}-${m}-${d}`;

                resultado.push({
                    id_bloqueo: `${bloqueo.id_bloqueo}-${fechaDia}`,
                    title: bloqueo.motivo || "Sin motivo",
                    start: new Date(`${fechaDia}T00:00:00`),
                    end: new Date(`${fechaDia}T23:59:00`),
                    allDay: false,
                    tipo: "bloqueo",
                    resource: bloqueo,
                });

                cursor = new Date(y, cursor.getMonth(), cursor.getDate() + 1, 0, 0, 0);
            }
        }

        return resultado;
    }


    useEffect(() => {
        const eventosReservas = (dataAgenda || []).map((cita) => ({
            id_reserva: cita.id_reserva,
            title: obtenerTituloReserva(cita),
            start: convertirAFechaCalendario(cita.fechaInicio, cita.horaInicio),
            end: convertirAFechaCalendario(cita.fechaFinalizacion, cita.horaFinalizacion),
            tipo: "reserva",
            resource: cita,
        }));
        const eventosBloqueos = expandirBloqueosPorDiaCompleto(dataBloqueos || []).map((bloqueo) => ({
            ...bloqueo,
            allDay: currentView === "month",
        }));

        if (currentView === "month") {
            setEvents([...eventosReservas, ...eventosBloqueos]);
            setBackgroundCalendarEvents([]);
            return;
        }

        setEvents(eventosReservas);
        setBackgroundCalendarEvents(eventosBloqueos);
    }, [dataAgenda, dataBloqueos, currentView]);

    const eventStyleGetter = (event) => {
        const estadoReservaNormalizado = event.resource?.estadoReserva?.toLowerCase?.() ?? "";
        const paletteReserva = estadoReservaNormalizado === "confirmada"
            ? {backgroundColor: "rgba(34, 197, 94, 0.22)", color: "#14532d", accentColor: "#166534", borderColor: "rgba(34, 197, 94, 0.30)"}
            : estadoReservaNormalizado === "anulada"
                ? {backgroundColor: "rgba(244, 63, 94, 0.18)", color: "#881337", accentColor: "#881337", borderColor: "rgba(225, 29, 72, 0.28)"}
                : {backgroundColor: "rgba(124, 58, 237, 0.20)", color: "#5b21b6", accentColor: "#5b21b6", borderColor: "rgba(124, 58, 237, 0.28)"};

        if (event.tipo === "bloqueo") {
            return monthEventStyleGetter(event);
        }

        return {
            style: {
                display: 'flex',
                alignItems: 'stretch',
                height: '100%',
                minHeight: '0',
                maxHeight: 'none',
                whiteSpace: 'normal',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: '1',
                padding: '0',
                fontSize: '0.5rem',
                boxSizing: 'border-box',
                borderRadius: '0px',
                backgroundColor: paletteReserva.backgroundColor,
                color: paletteReserva.color,
                fontWeight: '600',
                wordBreak: 'break-word',
                border: `1px solid ${paletteReserva.borderColor}`,
                borderLeft: `4px solid ${paletteReserva.accentColor}`,
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.14)',
            },
        };
    };

    const monthEventStyleGetter = (event) => {
        if (event.tipo !== "bloqueo") return null;

        return {
            style: {
                display: 'flex',
                alignItems: 'center',
                minHeight: '22px',
                padding: '3px 4px',
                fontSize: '0.5rem',
                lineHeight: '1',
                boxSizing: 'border-box',
                borderRadius: '0px',
                backgroundColor: 'rgba(107, 114, 128, 0.28)',
                color: '#334155',
                fontWeight: '600',
                border: '1px solid rgba(107, 114, 128, 0.38)',
                borderLeft: '4px solid rgba(71, 85, 105, 0.95)',
                boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.16)',
            },
        };
    };

    const backgroundEventStyleGetter = (event) => {
        if (event.tipo !== "bloqueo") return {style: {}};

        return {
            style: {
                backgroundColor: "rgba(107, 114, 128, 0.28)",
                border: "1px solid rgba(107, 114, 128, 0.38)",
                borderLeft: "4px solid rgba(71, 85, 105, 0.95)",
                borderRadius: "0px",
                boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.16)",
            },
        };
    };

    const dayPropGetter = (date) => {
        if (currentView !== "month") return {};
        if (!estaFechaBloqueada(date)) return {};

        return {};
    };

    const EventComponent = ({event}) => (
        <div
            title={obtenerTooltipEvento(event)}
            className="truncate text-[6px] leading-none w-full h-full flex items-center gap-1 px-[2px]"
            style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
        >
            {event.tipo === "bloqueo" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )}
            {event.title}
        </div>
    );

    const TitleOnlyEvent = ({event}) => (
        <div
            title={obtenerTooltipEvento(event)}
            className="truncate text-[6px] leading-none font-medium w-full flex items-center gap-1"
            style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
        >
            {event.tipo === "bloqueo" && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )}
            {event.title}
        </div>
    );


    async function actualizarInformacionReserva(nombrePaciente, apellidoPaciente, rut, telefono, email, fechaInicio, horaInicio, fechaFinalizacion, horaFinalizacion, estadoReserva, id_reserva) {
        try {

            if (!nombrePaciente || !apellidoPaciente || !rut || !telefono || !email || !fechaInicio || !horaInicio || !fechaFinalizacion || !horaFinalizacion || !estadoReserva || !id_reserva) {
                return toast.error("Debe llenar todos los campos para poder actualizar la reserva")
            }

            const res = await fetch(`${API}/reservaPacientes/actualizarReservacion`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({
                    nombrePaciente,
                    apellidoPaciente,
                    rut,
                    telefono,
                    email,
                    fechaInicio,
                    horaInicio,
                    fechaFinalizacion,
                    horaFinalizacion,
                    estadoReserva,
                    id_reserva
                })
            });

            if (!res.ok) {
                return toast.error("El servidor no responde")
            } else {

                const respuestaBackend = await res.json();
                if (respuestaBackend.message === true) {
                    setNombrePaciente("");
                    setApellidoPaciente("");
                    setTelefono("");
                    setRut("");
                    setEmail("");
                    await refrescarCalendario()
                    return toast.success("Se ha actualizado la reserva correctamente")
                }
            }


        } catch (error) {
            console.log(error);
            return toast.error(error.message);
        }
    }


    async function seleccionarReservaEspecifica(id_reserva) {
        try {

            if (!id_reserva) {
                return toast.error("Debe seleccionar una Reserva");
            }

            const res = await fetch(`${API}/reservaPacientes/seleccionarEspecifica`, {
                method: "POST",
                headers: {Accept: "application/json", "Content-Type": "application/json"},
                mode: "cors",
                body: JSON.stringify({id_reserva})
            });

            if (!res.ok) {
                return toast.error("El servidor no responde")
            }

            const data = await res.json();


            let reserva;

            if (Array.isArray(data)) {
                reserva = data[0];
            } else {
                reserva = data;
            }

            if (!reserva) {
                return toast.error("Sin Data")
            }

            // Seteamos los inputs desde la reserva (objeto)
            setNombrePaciente(reserva.nombrePaciente ?? "");
            setApellidoPaciente(reserva.apellidoPaciente ?? "");
            setRut(reserva.rut ?? "");
            setEmail(reserva.email ?? "");
            setTelefono(reserva.telefono ?? "");

            // Si tu endpoint trae estos campos, los cargamos también
            setfechaInicio((reserva.fechaInicio ?? "").slice(0, 10));
            setHoraInicio(reserva.horaInicio ?? "");
            setfechaFinalizacion((reserva.fechaFinalizacion ?? "").slice(0, 10));
            setHoraFinalizacion(reserva.horaFinalizacion ?? "");
            setEstadoReserva(reserva.estadoReserva ?? "");

        } catch (error) {
            console.log(error);
            return toast.error("El servidor no responde")
        }
    }

    useEffect(() => {
        if (id_reserva) {
            seleccionarReservaEspecifica(id_reserva);
        }
    }, [id_reserva]);


    function limpiarData() {
        setNombrePaciente("");
        setApellidoPaciente("");
        setTelefono("");
        setRut("");
        setEmail("");
    }


    return (
        // Contenedor con altura fija para que el calendario se muestre correctamente
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-8 md:px-10">
            <ToasterClient/>

            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-slate-900">Calendario General</h1>
                        <p className="text-sm text-slate-600">Revisa tus reservas y actividades.</p>
                    </div>
                    <InfoButton informacion={"Este apartado le permite tener una vista rápida y general de todos los horarios agendados y los bloqueos de agenda registrados en el sistema.\n\nPara ingresar nuevos agendamientos o citas, debe dirigirse al módulo de Ingreso de Agendamientos.\n\nPara registrar bloqueos de agenda, debe utilizar el módulo de Bloqueo de Agenda.\n\nEste calendario es únicamente de consulta y visualización."}/>
                </div>


                <div className="mt-10">
                    <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-slate-200 ring-1 ring-black/5 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-white">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900">Calendario de Reservas</h3>
                                    <p className="text-xs text-slate-500">Navega por mes/semana/día y selecciona una reserva para ver su detalle.</p>
                                    {id_profesional && (
                                        <span className="text-xs text-sky-600 font-medium">
                                            Agenda de: {listaProfesionales.find(p => p.id_profesional === id_profesional)?.nombreProfesional ?? ""}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="w-64">
                                        <SelectDinamic
                                            value={id_profesional}
                                            onChange={(e) => setId_profesional(Number(e.target.value))}
                                            options={listaProfesionales.map(profesional => ({
                                                value: profesional.id_profesional,
                                                label: profesional.nombreProfesional
                                            }))}
                                            placeholder="Selecciona un profesional"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="inline-block h-3 w-3 rounded bg-violet-600"></span>
                                        <span className="text-xs text-slate-500">Reservada</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="inline-block h-3 w-3 rounded bg-green-600"></span>
                                        <span className="text-xs text-slate-500">Confirmada</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="inline-block h-3 w-3 rounded bg-rose-800"></span>
                                        <span className="text-xs text-slate-500">Anulada</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="inline-block h-3 w-3 rounded border border-slate-500/60 bg-slate-500/50"></span>
                                        <span className="text-xs text-slate-500">Bloqueado</span>
                                    </div>
                                    <div className="text-xs text-slate-500">Vista: <span className="font-medium text-slate-700">{currentView}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 h-[700px]">
                            <Calendar
                                // Pasamos el localizador configurado para manejar fechas y formatos
                                localizer={localizer}
                                // Eventos que se mostrarán en el calendario
                                events={events}
                                backgroundEvents={backgroundCalendarEvents}
                                // Evita que el título se corte en vistas comprimidas (p. ej. semana)
                                eventPropGetter={eventStyleGetter}
                                backgroundEventPropGetter={backgroundEventStyleGetter}
                                // Usamos componentes específicos: para day y agenda mostramos sólo el título
                                components={{
                                    event: EventComponent,
                                    day: {event: TitleOnlyEvent},
                                    agenda: {event: TitleOnlyEvent}
                                }}
                                // Propiedades que indican qué campos del evento usar para inicio y fin
                                startAccessor="start"
                                endAccessor="end"
                                // Mensajes personalizados para la UI del calendario
                                messages={messages}
                                culture="es"
                                date={currentDate}
                                onNavigate={(nextDate) => setCurrentDate(nextDate)}
                                view={currentView}
                                onView={(nextView) => setCurrentView(nextView)}
                                defaultView="month"
                                style={{height: "100%"}}
                                dayPropGetter={dayPropGetter}

                                // Permite seleccionar rangos de tiempo en el calendario
                                selectable
                                // Evitar seleccionar rangos que choquen con reservas existentes
                                onSelecting={(slot) => {
                                    // slot puede ser {start, end} o directamente un objeto
                                    const start = slot.start ?? slot;
                                    const end = slot.end ?? slot;
                                    if (isOverlapping(start, end)) {
                                        toast.error('Horario no disponible (solapa con una reserva existente)');
                                        return false; // cancela la selección
                                    }
                                    return true;
                                }}

                                onSelectEvent={(event) => {
                                    if (event.tipo === "bloqueo") {
                                        return toast("Bloqueo: " + (event.title || "Sin motivo"), {icon: "🔒"});
                                    }
                                    if (!event?.id_reserva) {
                                        toast.error("No se encontró el ID de la reserva");
                                        return;
                                    }
                                    setid_reserva(event.id_reserva)
                                    seleccionarReservaEspecifica(event.id_reserva)
                                    toast.success(`Reserva: Numero # ${event.id_reserva}`);
                                }}

                                /* Función que se ejecuta al seleccionar un rango de tiempo.
                                   Solicita al usuario el título del evento y lo añade a la lista de eventos */
                                onSelectSlot={(slotInfo) => {
                                    const start = slotInfo.start ?? slotInfo;
                                    const end = slotInfo.end ?? slotInfo;
                                    if (isOverlapping(start, end)) {
                                        toast.error('No puede seleccionar un horario que ya está ocupado');
                                        return;
                                    }
                                    const title = prompt("Título del evento");
                                    if (!title) return;

                                    setEvents((prev) => [
                                        ...prev,
                                        {
                                            title,
                                            start: slotInfo.start,
                                            end: slotInfo.end,
                                        },
                                    ]);
                                }}
                            />
                            {/* Leyenda / ayuda */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 mt-6">
                                <div className="flex items-center gap-1.5">
                                    <span className="inline-block w-3 h-3 rounded-sm bg-sky-600" aria-hidden="true"/>
                                    <span>Reserva</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="inline-block h-3 w-3 rounded-sm border border-slate-500/60 bg-slate-500/50" aria-hidden="true"/>
                                    <span>Bloqueado</span>
                                </div>
                                <span className="text-xs italic text-slate-500">Pasa el cursor sobre un evento para ver el detalle</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}
