'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { InputTextDinamic } from "@/Componentes/InputTextDinamic";
import { InputNumberDinamic } from "@/Componentes/InputNumberDinamic";
import { TextAreaDinamic } from "@/Componentes/TextAreaDinamic";
import { ButtonDinamic } from "@/Componentes/ButtonDinamic";
import { SelectDinamic } from "@/Componentes/SelectDinamic";
import ToasterClient from "@/Componentes/ToasterClient";
import toast from 'react-hot-toast';

export default function EvaluacionClinicaPaciente() {
    const { id_paciente } = useParams();
    const router = useRouter();
    const API = process.env.NEXT_PUBLIC_API_URL;

    const [dataPaciente, setDataPaciente] = useState([]);
    const [listaCriteriosClinicos, setListaCriteriosClinicos] = useState([]);
    const [listaEvaluacionesPaciente, setListaEvaluacionesPaciente] = useState([]);
    const [listaFichasClinicas, setListaFichasClinicas] = useState([]);
    const [listaProfesionales, setListaProfesionales] = useState([]);

    const [id_ficha_clinica, setIdFichaClinica] = useState('');
    const [tipo_evaluacion, setTipoEvaluacion] = useState('Inicial');
    const [version_protocolo, setVersionProtocolo] = useState('v1.0');
    const [estado, setEstado] = useState('Activo');
    const [fecha_evaluacion, setFechaEvaluacion] = useState('');
    const [fecha_evaluacion_date, setFechaEvaluacionDate] = useState('');
    const [profesional_id, setProfesionalId] = useState('');
    const [peso_kg, setPesoKg] = useState('');
    const [talla_cm, setTallaCm] = useState('');
    const [cintura_cm, setCinturaCm] = useState('');
    const [imc, setImc] = useState('');
    const [pa_sistolica, setPaSistolica] = useState('');
    const [pa_diastolica, setPaDiastolica] = useState('');
    const [actividad_fisica, setActividadFisica] = useState('');
    const [motivo_consulta, setMotivoConsulta] = useState('');
    const [medicamentos_actuales, setMedicamentosActuales] = useState('');
    const [alergias, setAlergias] = useState('');
    const [tratamientos_previos_obesidad, setTratamientosPreviosObesidad] = useState('');
    const [historia_familiar, setHistoriaFamiliar] = useState('');
    const [observaciones_clinicas, setObservacionesClinicas] = useState('');
    const [resultado_elegibilidad, setResultadoElegibilidad] = useState('');
    const [justificacion_resultado, setJustificacionResultado] = useState('');
    const [score_total, setScoreTotal] = useState('0');
    const [fecha_creacion, setFechaCreacion] = useState('');
    const [id_evaluacion, setIdEvaluacion] = useState('');
    const [guardandoEvaluacion, setGuardandoEvaluacion] = useState(false);
    const [actualizandoEvaluacion, setActualizandoEvaluacion] = useState(false);
    const [eliminandoEvaluacion, setEliminandoEvaluacion] = useState(false);
    const [mostrarGuiaInformativa, setMostrarGuiaInformativa] = useState(false);

    function obtenerFechaActualMysql() {
        const fecha = new Date();
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');
        const segundos = String(fecha.getSeconds()).padStart(2, '0');

        return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    }

    function retroceder() {
        router.push(`/dashboard/FichasPacientes/${id_paciente}`);
    }

    function limpiarFormulario() {
        setIdFichaClinica(listaFichasClinicas[0]?.id_ficha ? String(listaFichasClinicas[0].id_ficha) : '');
        setTipoEvaluacion('Inicial');
        setVersionProtocolo('v1.0');
        setEstado('Activo');
        setFechaEvaluacionDate(obtenerFechaActualMysql().slice(0, 10));
        setFechaEvaluacion(convertirFechaDateADatetime(obtenerFechaActualMysql().slice(0, 10)));
        setProfesionalId('');
        setPesoKg('');
        setTallaCm('');
        setCinturaCm('');
        setImc('');
        setPaSistolica('');
        setPaDiastolica('');
        setActividadFisica('');
        setMotivoConsulta('');
        setMedicamentosActuales('');
        setAlergias('');
        setTratamientosPreviosObesidad('');
        setHistoriaFamiliar('');
        setObservacionesClinicas('');
        setResultadoElegibilidad('');
        setJustificacionResultado('');
        setScoreTotal('0');
        setFechaCreacion(obtenerFechaActualMysql());
        setIdEvaluacion('');
        setListaCriteriosClinicos((prev) =>
            prev.map((criterio) => ({
                ...criterio,
                activo: 0
            }))
        );
    }

    function convertirFechaDateADatetime(fechaDate) {
        if (!fechaDate) {
            return '';
        }

        return `${fechaDate} 00:00:00`;
    }

    function normalizarFechaMysql(fechaValor) {
        if (!fechaValor) {
            return '';
        }

        if (typeof fechaValor === 'string' && fechaValor.includes('T')) {
            const fecha = new Date(fechaValor);

            if (Number.isNaN(fecha.getTime())) {
                return fechaValor;
            }

            const anio = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            const horas = String(fecha.getHours()).padStart(2, '0');
            const minutos = String(fecha.getMinutes()).padStart(2, '0');
            const segundos = String(fecha.getSeconds()).padStart(2, '0');

            return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
        }

        return fechaValor;
    }

    function formatearFechaSoloDate(fechaValor) {
        if (!fechaValor) {
            return 'Sin fecha';
        }

        if (typeof fechaValor === 'string' && fechaValor.includes('T')) {
            return fechaValor.slice(0, 10);
        }

        return String(fechaValor).slice(0, 10);
    }

    async function buscarPacientePorId(id_paciente) {
        try {
            if (!id_paciente) {
                return toast.error('No se encontró el paciente para cargar la evaluación clínica.');
            }

            const res = await fetch(`${API}/pacientes/pacientesEspecifico`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_paciente }),
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al cargar los datos del paciente, por favor intente nuevamente.');
            } else {
                const respustaBackend = await res.json();

                if (Array.isArray(respustaBackend)) {
                    setDataPaciente(respustaBackend);
                } else {
                    setDataPaciente([respustaBackend]);
                }
            }
        } catch (error) {
            return toast.error('Error al cargar los datos del paciente, por favor intente nuevamente.');
        }
    }

    async function obtenerTodosActivosCriterios() {
        try {
            const res = await fetch(`${API}/criteriosClinicos/obtenerTodosActivos`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al cargar el catálogo de criterios clínicos.');
            } else {
                const respustaBackend = await res.json();

                if (Array.isArray(respustaBackend)) {
                    setListaCriteriosClinicos(
                        respustaBackend.map((criterio) => ({
                            ...criterio,
                            activo: 0
                        }))
                    );
                } else {
                    return toast.error('Error al cargar el catálogo de criterios clínicos.');
                }
            }
        } catch (error) {
            return toast.error('Error al cargar el catálogo de criterios clínicos.');
        }
    }

    async function listarFichasClinicasPaciente(id_paciente) {
        try {
            if (!id_paciente) {
                return;
            }

            const res = await fetch(`${API}/ficha/seleccionarFichasPaciente`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_paciente }),
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al cargar las fichas clínicas del paciente.');
            }

            const respustaBackend = await res.json();

            if (Array.isArray(respustaBackend)) {
                setListaFichasClinicas(respustaBackend);

                if (!id_ficha_clinica && respustaBackend[0]?.id_ficha) {
                    setIdFichaClinica(String(respustaBackend[0].id_ficha));
                }
            }
        } catch (error) {
            return toast.error('Error al cargar las fichas clínicas del paciente.');
        }
    }

    async function seleccionarTodosProfesionales() {
        try {
            const res = await fetch(`${API}/profesionales/seleccionarTodosProfesionales`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al cargar los profesionales.');
            }

            const respustaBackend = await res.json();

            if (Array.isArray(respustaBackend)) {
                setListaProfesionales(respustaBackend);
            } else {
                return toast.error('Error al cargar los profesionales.');
            }
        } catch (error) {
            return toast.error('Error al cargar los profesionales.');
        }
    }

    async function obtenerCriteriosPorEvaluacion(id_evaluacion_clinica) {
        try {
            if (!id_evaluacion_clinica) {
                return;
            }

            const res = await fetch(`${API}/evaluacionCriterios/obtenerCriteriosPorEvaluacion`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_evaluacion_clinica }),
                mode: 'cors'
            });

            const respustaBackend = await res.json();

            if (!res.ok) {
                return toast.error(
                    typeof respustaBackend?.message === 'string'
                        ? `Error al cargar criterios de la evaluación: ${respustaBackend.message}`
                        : 'Error al cargar criterios de la evaluación.'
                );
            }

            const criteriosGuardados = Array.isArray(respustaBackend) ? respustaBackend : [];

            setListaCriteriosClinicos((prev) =>
                prev.map((criterio) => {
                    const criterioGuardado = criteriosGuardados.find(
                        (item) => String(item.id_criterio) === String(criterio.id_criterio)
                    );

                    return {
                        ...criterio,
                        activo: criterioGuardado ? Number(criterioGuardado.activo) : 0,
                        id_evaluacion_criterios: criterioGuardado ? criterioGuardado.id_evaluacion_criterios : ''
                    };
                })
            );
        } catch (error) {
            return toast.error('Error al cargar criterios de la evaluación.');
        }
    }

    async function actualizarCriteriosEvaluacionSeleccionada() {
        try {
            const criteriosConRelacion = listaCriteriosClinicos.filter((criterio) => criterio.id_evaluacion_criterios);

            if (criteriosConRelacion.length === 0) {
                return false;
            }

            for (const criterio of criteriosConRelacion) {
                const res = await fetch(`${API}/evaluacionCriterios/actualizarSwitchEspecifico`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        activo: String(criterio.activo),
                        id_evaluacion_criterios: Number(criterio.id_evaluacion_criterios)
                    }),
                    mode: 'cors'
                });

                const respustaBackend = await res.json();

                if (!res.ok && respustaBackend?.message !== true) {
                    return false;
                }

                if (respustaBackend?.message !== true) {
                    return false;
                }
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    async function seleccionarTodasLasEvaluaciones() {
        try {
            if (!id_paciente) {
                return;
            }

            const res = await fetch(`${API}/evolucionClinica/seleccionar_todas_evoluciones`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al cargar las evaluaciones clínicas del paciente.');
            } else {
                const respustaBackend = await res.json();
                const resultadoModel = Array.isArray(respustaBackend?.resultadoModel) ? respustaBackend.resultadoModel : [];

                const evaluacionesPaciente = resultadoModel
                    .filter((evaluacion) => String(evaluacion.id_paciente) === String(id_paciente))
                    .sort((a, b) => Number(b.id_evaluacion) - Number(a.id_evaluacion));

                setListaEvaluacionesPaciente(evaluacionesPaciente);
            }
        } catch (error) {
            return toast.error('Error al cargar las evaluaciones clínicas del paciente.');
        }
    }

    function actualizarCriterioSeleccionado(id_criterio) {
        setListaCriteriosClinicos((prev) =>
            prev.map((criterio) =>
                String(criterio.id_criterio) === String(id_criterio)
                    ? { ...criterio, activo: criterio.activo === 1 ? 0 : 1 }
                    : criterio
            )
        );
    }

    function calcularResumenClinico(criteriosSeleccionados) {
        const criteriosActivos = criteriosSeleccionados.filter((criterio) => Number(criterio.activo) === 1);
        const criteriosExcluyentesActivos = criteriosActivos.filter((criterio) => Number(criterio.excluye_glp1) === 1);

        if (criteriosExcluyentesActivos.length > 0) {
            const nombresExcluyentes = criteriosExcluyentesActivos.map((criterio) => criterio.nombre).join(', ');

            return {
                score: 0,
                resultado: 'No elegible',
                justificacion: `Se detectaron criterios excluyentes GLP1 activos: ${nombresExcluyentes}.`
            };
        }

        const scoreCalculado = criteriosActivos.reduce((acumulador, criterio) => {
            if (criterio.valor_tipo === 'positivo') {
                return acumulador + 1;
            }

            if (criterio.valor_tipo === 'negativo') {
                return acumulador - 1;
            }

            return acumulador;
        }, 0);

        if (criteriosActivos.length === 0) {
            return {
                score: 0,
                resultado: 'Pendiente de evaluación',
                justificacion: 'Aún no hay criterios clínicos marcados para esta evaluación.'
            };
        }

        return {
            score: scoreCalculado,
            resultado: 'Elegible',
            justificacion: `No se detectaron criterios excluyentes GLP1 activos. Score calculado en base a ${criteriosActivos.length} criterios marcados.`
        };
    }

    async function guardarCriteriosEvaluacion(id_evaluacion_clinica, arrayCriterios) {
        try {
            const res = await fetch(`${API}/evaluacionCriterios/guardarCriteriosEvaluacion`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_evaluacion_clinica,
                    arrayCriterios
                }),
                mode: 'cors'
            });

            const respustaBackend = await res.json();

            if (respustaBackend.message === true) {
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    async function insertarEvaluacionClinica() {
        try {
            if (!id_paciente) {
                return toast.error('No se encontró el paciente para registrar la evaluación clínica.');
            }

            if (!fecha_evaluacion || !tipo_evaluacion || !estado) {
                return toast.error('Por favor complete los datos principales de la evaluación clínica.');
            }

            if (listaCriteriosClinicos.length === 0) {
                return toast.error('No hay criterios clínicos disponibles para construir la evaluación.');
            }

            setGuardandoEvaluacion(true);

            const resumenClinico = calcularResumenClinico(listaCriteriosClinicos);
            const fechaEvaluacionConvertida = convertirFechaDateADatetime(fecha_evaluacion_date);
            const fechaCreacionActual = fecha_creacion || obtenerFechaActualMysql();
            const payloadEvaluacion = {
                id_paciente: Number(id_paciente),
                id_ficha_clinica: id_ficha_clinica ? Number(id_ficha_clinica) : null,
                tipo_evaluacion,
                version_protocolo,
                estado,
                fecha_evaluacion: fechaEvaluacionConvertida,
                profesional_id: profesional_id ? Number(profesional_id) : null,
                peso_kg: peso_kg || null,
                talla_cm: talla_cm || null,
                cintura_cm: cintura_cm || null,
                imc: imc || null,
                pa_sistolica: pa_sistolica || null,
                pa_diastolica: pa_diastolica || null,
                actividad_fisica,
                motivo_consulta,
                medicamentos_actuales,
                alergias,
                tratamientos_previos_obesidad,
                historia_familiar,
                observaciones_clinicas,
                resultado_elegibilidad: resumenClinico.resultado,
                justificacion_resultado: resumenClinico.justificacion,
                score_total: resumenClinico.score,
                fecha_creacion: fechaCreacionActual
            };

            const res = await fetch(`${API}/evolucionClinica/insertarEvaluacion`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payloadEvaluacion),
                mode: 'cors'
            });

            if (!res.ok) {
                setGuardandoEvaluacion(false);
                return toast.error('Error al guardar la evaluación clínica, por favor intente nuevamente.');
            }

            const respustaBackend = await res.json();

            if (respustaBackend.message !== true) {
                setGuardandoEvaluacion(false);
                return toast.error('No se pudo guardar la evaluación clínica.');
            }

            const resEvaluaciones = await fetch(`${API}/evolucionClinica/seleccionar_todas_evoluciones`, {
                method: 'GET',
                headers: { Accept: 'application/json' },
                mode: 'cors'
            });

            if (!resEvaluaciones.ok) {
                setGuardandoEvaluacion(false);
                return toast.error('La evaluación clínica se guardó, pero no se pudo recuperar su identificador.');
            }

            const respuestaEvaluaciones = await resEvaluaciones.json();
            const listaEvaluaciones = Array.isArray(respuestaEvaluaciones?.resultadoModel)
                ? respuestaEvaluaciones.resultadoModel
                : [];

            const ultimaEvaluacionPaciente = listaEvaluaciones
                .filter((evaluacion) => String(evaluacion.id_paciente) === String(id_paciente))
                .sort((a, b) => Number(b.id_evaluacion) - Number(a.id_evaluacion))[0];

            if (!ultimaEvaluacionPaciente?.id_evaluacion) {
                setGuardandoEvaluacion(false);
                return toast.error('La evaluación clínica se guardó, pero no se pudo enlazar con la tabla de criterios.');
            }

            const arrayCriterios = listaCriteriosClinicos.map((criterio) => ({
                id_criterio: Number(criterio.id_criterio),
                activo: Number(criterio.activo)
            }));

            const criteriosGuardados = await guardarCriteriosEvaluacion(ultimaEvaluacionPaciente.id_evaluacion, arrayCriterios);

            setResultadoElegibilidad(resumenClinico.resultado);
            setJustificacionResultado(resumenClinico.justificacion);
            setScoreTotal(String(resumenClinico.score));
            setIdEvaluacion(String(ultimaEvaluacionPaciente.id_evaluacion));
            await seleccionarTodasLasEvaluaciones();
            limpiarFormulario();
            setGuardandoEvaluacion(false);

            if (criteriosGuardados) {
                return toast.success('Evaluación clínica y criterios guardados correctamente.');
            }

            return toast.error('La evaluación clínica se guardó, pero hubo un problema al guardar la tabla de criterios.');
        } catch (error) {
            setGuardandoEvaluacion(false);
            return toast.error('Error al guardar la evaluación clínica, por favor intente nuevamente.');
        }
    }

    async function actualizarEvaluacionClinica() {
        try {
            if (!id_evaluacion) {
                return toast.error('Debe cargar una evaluación del historial antes de actualizar.');
            }

            if (!id_paciente) {
                return toast.error('No se encontró el paciente para actualizar la evaluación clínica.');
            }

            if (!fecha_evaluacion_date || !tipo_evaluacion || !estado) {
                return toast.error('Por favor complete los datos principales de la evaluación clínica.');
            }

            setActualizandoEvaluacion(true);

            const resumenClinico = calcularResumenClinico(listaCriteriosClinicos);
            const payloadActualizacion = {
                id_paciente: Number(id_paciente),
                id_ficha_clinica: id_ficha_clinica ? Number(id_ficha_clinica) : null,
                tipo_evaluacion,
                version_protocolo,
                estado,
                fecha_evaluacion: convertirFechaDateADatetime(fecha_evaluacion_date),
                profesional_id: profesional_id ? Number(profesional_id) : null,
                peso_kg: peso_kg || null,
                talla_cm: talla_cm || null,
                cintura_cm: cintura_cm || null,
                imc: imc || null,
                pa_sistolica: pa_sistolica || null,
                pa_diastolica: pa_diastolica || null,
                actividad_fisica,
                motivo_consulta,
                medicamentos_actuales,
                alergias,
                tratamientos_previos_obesidad,
                historia_familiar,
                observaciones_clinicas,
                resultado_elegibilidad: resumenClinico.resultado,
                justificacion_resultado: resumenClinico.justificacion,
                score_total: resumenClinico.score,
                fecha_creacion: normalizarFechaMysql(fecha_creacion || obtenerFechaActualMysql()),
                id_evaluacion: Number(id_evaluacion)
            };

            const res = await fetch(`${API}/evolucionClinica/actualizar_evolucionEspecifica_controller`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payloadActualizacion),
                mode: 'cors'
            });

            const respustaBackend = await res.json();

            if (!res.ok) {
                setActualizandoEvaluacion(false);
                return toast.error(
                    typeof respustaBackend?.message === 'string'
                        ? `Error al actualizar la evaluación clínica: ${respustaBackend.message}`
                        : 'Error al actualizar la evaluación clínica, por favor intente nuevamente.'
                );
            }

            if (respustaBackend.message === true) {
                const criteriosActualizados = await actualizarCriteriosEvaluacionSeleccionada();
                setResultadoElegibilidad(resumenClinico.resultado);
                setJustificacionResultado(resumenClinico.justificacion);
                setScoreTotal(String(resumenClinico.score));
                await seleccionarTodasLasEvaluaciones();
                limpiarFormulario();
                setActualizandoEvaluacion(false);

                if (criteriosActualizados) {
                    return toast.success('Evaluación clínica actualizada correctamente.');
                }

                return toast.error('La evaluación clínica se actualizó, pero los criterios clínicos no se pudieron sincronizar.');
            }

            setActualizandoEvaluacion(false);
            return toast.error('No se pudo actualizar la evaluación clínica.');
        } catch (error) {
            setActualizandoEvaluacion(false);
            return toast.error('Error al actualizar la evaluación clínica, por favor intente nuevamente.');
        }
    }

    async function eliminarEvaluacionSeleccionada() {
        try {
            if (!id_evaluacion) {
                return toast.error('Debe cargar una evaluación del historial antes de eliminar.');
            }

            setEliminandoEvaluacion(true);

            const res = await fetch(`${API}/evolucionClinica/eliminar_evolucionEspecifica_controller`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_evaluacion: Number(id_evaluacion)
                }),
                mode: 'cors'
            });

            const respustaBackend = await res.json();

            if (!res.ok) {
                setEliminandoEvaluacion(false);
                return toast.error(
                    typeof respustaBackend?.message === 'string'
                        ? `Error al eliminar la evaluación clínica: ${respustaBackend.message}`
                        : 'Error al eliminar la evaluación clínica, por favor intente nuevamente.'
                );
            }

            if (respustaBackend.message === true) {
                await seleccionarTodasLasEvaluaciones();
                limpiarFormulario();
                setEliminandoEvaluacion(false);
                return toast.success('Evaluación clínica eliminada correctamente.');
            }

            setEliminandoEvaluacion(false);
            return toast.error('No se pudo eliminar la evaluación clínica.');
        } catch (error) {
            setEliminandoEvaluacion(false);
            return toast.error('Error al eliminar la evaluación clínica, por favor intente nuevamente.');
        }
    }

    function cargarEvaluacionGuardada(evaluacion) {
        setIdFichaClinica(String(evaluacion.id_ficha_clinica ?? ''));
        setTipoEvaluacion(evaluacion.tipo_evaluacion || 'Inicial');
        setVersionProtocolo(evaluacion.version_protocolo || 'v1.0');
        setEstado(evaluacion.estado || 'Activo');
        setFechaEvaluacion(evaluacion.fecha_evaluacion || '');
        setFechaEvaluacionDate(evaluacion.fecha_evaluacion ? String(evaluacion.fecha_evaluacion).slice(0, 10) : '');
        setProfesionalId(String(evaluacion.profesional_id ?? ''));
        setPesoKg(String(evaluacion.peso_kg ?? ''));
        setTallaCm(String(evaluacion.talla_cm ?? ''));
        setCinturaCm(String(evaluacion.cintura_cm ?? ''));
        setImc(String(evaluacion.imc ?? ''));
        setPaSistolica(String(evaluacion.pa_sistolica ?? ''));
        setPaDiastolica(String(evaluacion.pa_diastolica ?? ''));
        setActividadFisica(evaluacion.actividad_fisica || '');
        setMotivoConsulta(evaluacion.motivo_consulta || '');
        setMedicamentosActuales(evaluacion.medicamentos_actuales || '');
        setAlergias(evaluacion.alergias || '');
        setTratamientosPreviosObesidad(evaluacion.tratamientos_previos_obesidad || '');
        setHistoriaFamiliar(evaluacion.historia_familiar || '');
        setObservacionesClinicas(evaluacion.observaciones_clinicas || '');
        setResultadoElegibilidad(evaluacion.resultado_elegibilidad || '');
        setJustificacionResultado(evaluacion.justificacion_resultado || '');
        setScoreTotal(String(evaluacion.score_total ?? '0'));
        setFechaCreacion(evaluacion.fecha_creacion || '');
        setIdEvaluacion(String(evaluacion.id_evaluacion ?? ''));
        obtenerCriteriosPorEvaluacion(evaluacion.id_evaluacion);

        return toast.success('Datos clínicos de la evaluación cargados correctamente.');
    }

    useEffect(() => {
        if (!id_paciente) {
            return;
        }

        buscarPacientePorId(id_paciente);
        obtenerTodosActivosCriterios();
        seleccionarTodasLasEvaluaciones();
        listarFichasClinicasPaciente(id_paciente);
        seleccionarTodosProfesionales();
        setFechaEvaluacionDate(obtenerFechaActualMysql().slice(0, 10));
        setFechaEvaluacion(convertirFechaDateADatetime(obtenerFechaActualMysql().slice(0, 10)));
        setFechaCreacion(obtenerFechaActualMysql());
    }, [id_paciente]);

    useEffect(() => {
        setFechaEvaluacion(convertirFechaDateADatetime(fecha_evaluacion_date));
    }, [fecha_evaluacion_date]);

    useEffect(() => {
        if (!peso_kg || !talla_cm) {
            setImc('');
            return;
        }

        const tallaMetros = Number(talla_cm) / 100;

        if (!tallaMetros || Number.isNaN(tallaMetros)) {
            setImc('');
            return;
        }

        const imcCalculado = Number(peso_kg) / (tallaMetros * tallaMetros);

        if (!Number.isNaN(imcCalculado) && Number.isFinite(imcCalculado)) {
            setImc(imcCalculado.toFixed(2));
        }
    }, [peso_kg, talla_cm]);

    useEffect(() => {
        const resumenClinico = calcularResumenClinico(listaCriteriosClinicos);
        setResultadoElegibilidad(resumenClinico.resultado);
        setJustificacionResultado(resumenClinico.justificacion);
        setScoreTotal(String(resumenClinico.score));
    }, [listaCriteriosClinicos]);

    const pacienteActual = dataPaciente[0];
    const criteriosActivosSeleccionados = listaCriteriosClinicos.filter((criterio) => Number(criterio.activo) === 1);
    const criteriosPositivosSeleccionados = criteriosActivosSeleccionados.filter((criterio) => criterio.valor_tipo === 'positivo');
    const criteriosNegativosSeleccionados = criteriosActivosSeleccionados.filter((criterio) => criterio.valor_tipo === 'negativo');
    const criteriosExcluyentesSeleccionados = criteriosActivosSeleccionados.filter((criterio) => Number(criterio.excluye_glp1) === 1);
    const clasesElegibilidad = resultado_elegibilidad === 'No elegible'
        ? 'border-red-200 bg-red-50 text-red-900'
        : resultado_elegibilidad === 'Elegible'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
            : 'border-slate-200 bg-slate-50 text-slate-900';

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#eef6ff_0%,#f8fafc_42%,#ffffff_100%)]">
            <ToasterClient />

            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
                <div className="relative overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.35)] sm:p-8">
                    <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />
                    <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-cyan-100 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl space-y-4">
                            <div className="inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium tracking-wide text-blue-700">
                                Evaluación clínica GLP-1
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                    Evaluación clínica del paciente
                                </h1>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <ButtonDinamic
                                onClick={() => setMostrarGuiaInformativa((prev) => !prev)}
                                className="bg-blue-700 hover:bg-blue-600"
                            >
                                {mostrarGuiaInformativa ? 'Ocultar información' : 'Información rápida'}
                            </ButtonDinamic>

                            <ButtonDinamic onClick={retroceder} className="bg-slate-700 hover:bg-slate-600">
                                Volver a fichas
                            </ButtonDinamic>

                            <ButtonDinamic onClick={seleccionarTodasLasEvaluaciones} className="bg-emerald-700 hover:bg-emerald-600">
                                Recargar historial
                            </ButtonDinamic>
                        </div>
                    </div>
                </div>

                {mostrarGuiaInformativa && (
                    <div className="mt-6 rounded-[24px] border border-blue-100 bg-gradient-to-r from-blue-50 via-cyan-50 to-white p-5 shadow-[0_20px_50px_-40px_rgba(37,99,235,0.55)]">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-2">
                                <div className="inline-flex w-fit rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700">
                                    Guía rápida
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">Flujo recomendado de evaluación clínica</h2>
                                <p className="max-w-3xl text-sm leading-6 text-slate-600">
                                    Completa los datos clínicos, selecciona los criterios correspondientes del Listado de Criterios Clinicos y luego guarda o actualiza la evaluación del paciente.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Paso 1</p>
                                    <p className="mt-1 text-sm font-medium text-slate-700">Base clínica</p>
                                </div>
                                <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Paso 2</p>
                                    <p className="mt-1 text-sm font-medium text-slate-700">Marcar criterios</p>
                                </div>
                                <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Paso 3</p>
                                    <p className="mt-1 text-sm font-medium text-slate-700">Guardar evaluación</p>
                                </div>
                                <div className="rounded-2xl border border-white/80 bg-white/80 px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Actualizar</p>
                                    <p className="mt-1 text-sm font-medium text-slate-700">Carga desde historial, modifica datos o criterios y presiona Actualizar evaluación.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {pacienteActual && (
                    <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
                        <div className="mb-5 flex flex-col gap-2">
                            <h2 className="text-lg font-semibold text-slate-900">Paciente seleccionado</h2>
                            <p className="text-sm text-slate-500">La evaluación clínica se registrará para este paciente.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <DataCard label="Paciente" value={`${pacienteActual.nombre || ''} ${pacienteActual.apellido || ''}`.trim() || 'Sin dato'} />
                            <DataCard label="RUT" value={pacienteActual.rut || 'Sin dato'} />
                            <DataCard label="Último ID evaluación" value={id_evaluacion ? `#${id_evaluacion}` : 'Sin evaluación cargada'} />
                        </div>
                    </div>
                )}

                <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[1.25fr_0.75fr]">
                    <div className="flex flex-col gap-8">
                        <section className="rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] sm:p-8">
                            <div className="mb-6 space-y-2">
                                <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                                    Datos clínicos
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">Información principal de la evaluación</h2>
                                <p className="max-w-2xl text-sm leading-6 text-slate-500">
                                    Completa primero la base clínica y luego marca los criterios del Listado de Criterios Clinicos.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                <FieldBlock label="Tipo evaluación">
                                    <SelectDinamic
                                        value={tipo_evaluacion}
                                        onChange={(e) => setTipoEvaluacion(e.target.value)}
                                        placeholder="Seleccione tipo"
                                        options={[
                                            { value: 'Inicial', label: 'Inicial' },
                                            { value: 'Seguimiento', label: 'Seguimiento' },
                                            { value: 'Control', label: 'Control' }
                                        ]}
                                    />
                                </FieldBlock>

                                <FieldBlock label="Versión protocolo">
                                    <InputTextDinamic value={version_protocolo} onChange={(e) => setVersionProtocolo(e.target.value)} placeholder="Ej: v1.0" />
                                </FieldBlock>

                                <FieldBlock label="Estado">
                                    <SelectDinamic
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                        placeholder="Seleccione estado"
                                        options={[
                                            { value: 'Activo', label: 'Activo' },
                                            { value: 'Seguimiento', label: 'Seguimiento' },
                                            { value: 'Cerrado', label: 'Cerrado' }
                                        ]}
                                    />
                                </FieldBlock>

                                <FieldBlock label="Fecha evaluación">
                                    <input
                                        type="date"
                                        value={fecha_evaluacion_date}
                                        onChange={(e) => setFechaEvaluacionDate(e.target.value)}
                                        className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-all outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/20"
                                    />
                                </FieldBlock>

                                <FieldBlock label="Profesional">
                                    <SelectDinamic
                                        value={profesional_id}
                                        onChange={(e) => setProfesionalId(e.target.value)}
                                        placeholder="Seleccione un profesional"
                                        options={listaProfesionales.map((profesional) => ({
                                            value: String(profesional.id_profesional),
                                            label: profesional.nombreProfesional
                                        }))}
                                    />
                                </FieldBlock>

                                <FieldBlock label="Peso (kg)">
                                    <InputNumberDinamic value={peso_kg} onChange={(e) => setPesoKg(e.target.value)} placeholder="Ej: 70.5" />
                                </FieldBlock>

                                <FieldBlock label="Talla (cm)">
                                    <InputNumberDinamic value={talla_cm} onChange={(e) => setTallaCm(e.target.value)} placeholder="Ej: 175" />
                                </FieldBlock>

                                <FieldBlock label="Cintura (cm)">
                                    <InputNumberDinamic value={cintura_cm} onChange={(e) => setCinturaCm(e.target.value)} placeholder="Ej: 85" />
                                </FieldBlock>

                                <FieldBlock label="IMC">
                                    <div className="flex h-10 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-[11px] text-slate-400 shadow-sm">
                                        {imc || 'Se calculará automáticamente'}
                                    </div>
                                </FieldBlock>

                                <FieldBlock label="PA sistólica">
                                    <InputNumberDinamic value={pa_sistolica} onChange={(e) => setPaSistolica(e.target.value)} placeholder="Ej: 120" />
                                </FieldBlock>

                                <FieldBlock label="PA diastólica">
                                    <InputNumberDinamic value={pa_diastolica} onChange={(e) => setPaDiastolica(e.target.value)} placeholder="Ej: 80" />
                                </FieldBlock>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <TextAreaField label="Actividad física" value={actividad_fisica} onChange={(e) => setActividadFisica(e.target.value)} placeholder="Ej: Moderada" />
                                <TextAreaField label="Motivo consulta" value={motivo_consulta} onChange={(e) => setMotivoConsulta(e.target.value)} placeholder="Ej: Control de peso" />
                                <TextAreaField label="Medicamentos actuales" value={medicamentos_actuales} onChange={(e) => setMedicamentosActuales(e.target.value)} placeholder="Ej: Paracetamol" />
                                <TextAreaField label="Alergias" value={alergias} onChange={(e) => setAlergias(e.target.value)} placeholder="Ej: Penicilina" />
                                <TextAreaField label="Tratamientos previos obesidad" value={tratamientos_previos_obesidad} onChange={(e) => setTratamientosPreviosObesidad(e.target.value)} placeholder="Ej: Dieta balanceada" />
                                <TextAreaField label="Historia familiar" value={historia_familiar} onChange={(e) => setHistoriaFamiliar(e.target.value)} placeholder="Ej: Padre con hipertensión" />
                            </div>

                            <div className="mt-5">
                                <TextAreaField label="Observaciones clínicas" value={observaciones_clinicas} onChange={(e) => setObservacionesClinicas(e.target.value)} placeholder="Ej: Observaciones relevantes de la consulta" />
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] sm:p-8">
                            <div className="mb-6 space-y-2">
                                <div className="inline-flex w-fit rounded-full border border-blue-200 bg-blue-50 px-5 py-2.5 text-base font-semibold text-blue-700">
                                    Listado de Criterios Clinicos
                                </div>
                            </div>

                            <div className="space-y-3">
                                {listaCriteriosClinicos.length > 0 ? (
                                    listaCriteriosClinicos.map((criterio) => (
                                        <label
                                            key={criterio.id_criterio}
                                            className={`flex cursor-pointer flex-col gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-start sm:justify-between ${
                                                Number(criterio.activo) === 1
                                                    ? 'border-blue-200 bg-blue-50/70'
                                                    : 'border-slate-200 bg-slate-50/70'
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={Number(criterio.activo) === 1}
                                                    onChange={() => actualizarCriterioSeleccionado(criterio.id_criterio)}
                                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                                                />

                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-slate-900">{criterio.nombre}</p>
                                                    <p className="text-sm text-slate-500">{criterio.descripcion || 'Sin descripción registrada en el catálogo.'}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 sm:min-w-[180px]">
                                                <Tag label={criterio.valor_tipo} tone={criterio.valor_tipo === 'positivo' ? 'blue' : 'amber'} />
                                                <Tag label={Number(criterio.excluye_glp1) === 1 ? 'Excluye GLP1' : 'No excluye GLP1'} tone={Number(criterio.excluye_glp1) === 1 ? 'red' : 'emerald'} />
                                            </div>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400">No hay criterios clínicos activos disponibles.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="flex flex-col gap-8">
                        <section className="rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
                            <div className="mb-5 space-y-2">
                                <div className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                    Resumen automático
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">Elegibilidad y score</h2>
                            </div>

                            <div className="space-y-4">
                                <MetricCard label="Criterios marcados" value={String(criteriosActivosSeleccionados.length)} />
                                <MetricCard label="Positivos activos" value={String(criteriosPositivosSeleccionados.length)} tone="blue" />
                                <MetricCard label="Negativos activos" value={String(criteriosNegativosSeleccionados.length)} tone="amber" />
                                <MetricCard label="Excluyentes activos" value={String(criteriosExcluyentesSeleccionados.length)} tone="red" />

                                <div className={`rounded-2xl border p-4 ${clasesElegibilidad}`}>
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Resultado elegibilidad</p>
                                    <p className="mt-2 text-lg font-semibold">{resultado_elegibilidad || 'Pendiente'}</p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Score total</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-900">{score_total || '0'}</p>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Justificación</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">{justificacion_resultado || 'Sin justificación calculada.'}</p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-slate-200/80 bg-slate-900 p-6 text-white shadow-[0_20px_60px_-40px_rgba(15,23,42,0.65)]">
                            <div className="mb-5 space-y-2">
                                <h2 className="text-lg font-semibold">Acciones</h2>
                                <p className="text-sm leading-6 text-slate-300">
                                    Guarda primero la evaluación clínica y luego la tabla puente de criterios usando las rutas disponibles.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <ButtonDinamic
                                    onClick={insertarEvaluacionClinica}
                                    className="h-11 rounded-2xl bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                                >
                                    {guardandoEvaluacion ? 'Guardando evaluación...' : 'Guardar evaluación'}
                                </ButtonDinamic>

                                <ButtonDinamic
                                    onClick={actualizarEvaluacionClinica}
                                    className="h-11 rounded-2xl bg-blue-700 hover:bg-blue-600"
                                >
                                    {actualizandoEvaluacion ? 'Actualizando evaluación...' : 'Actualizar evaluación'}
                                </ButtonDinamic>

                                <ButtonDinamic onClick={limpiarFormulario} className="h-11 rounded-2xl bg-slate-700 hover:bg-slate-600">
                                    Limpiar formulario
                                </ButtonDinamic>

                                <ButtonDinamic
                                    onClick={eliminarEvaluacionSeleccionada}
                                    className="h-11 rounded-2xl bg-red-700 hover:bg-red-600"
                                >
                                    {eliminandoEvaluacion ? 'Eliminando evaluación...' : 'Eliminar seleccionado'}
                                </ButtonDinamic>

                                <ButtonDinamic onClick={seleccionarTodasLasEvaluaciones} className="h-11 rounded-2xl bg-slate-700 hover:bg-slate-600">
                                    Actualizar historial
                                </ButtonDinamic>
                            </div>
                        </section>

                        <section className="rounded-[28px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
                            <div className="mb-5 space-y-2">
                                <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                                    Historial
                                </div>
                                <h2 className="text-lg font-semibold text-slate-900">Evaluaciones del paciente</h2>
                                <p className="text-sm leading-6 text-slate-500">
                                    Puedes cargar una evaluación previa para reutilizar sus datos clínicos en el formulario.
                                </p>
                            </div>

                            <div className="space-y-3">
                                {listaEvaluacionesPaciente.length > 0 ? (
                                    listaEvaluacionesPaciente.map((evaluacion) => (
                                        <div
                                            key={evaluacion.id_evaluacion}
                                            className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                                        >
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-semibold text-slate-900">
                                                        Evaluación #{evaluacion.id_evaluacion}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {formatearFechaSoloDate(evaluacion.fecha_evaluacion)}
                                                    </p>
                                                    <p className="text-sm text-violet-700">
                                                        {evaluacion.tipo_evaluacion || 'Sin tipo de evaluación'}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <Tag label={`Score ${evaluacion.score_total ?? 0}`} tone="blue" />
                                                    <Tag
                                                        label={evaluacion.resultado_elegibilidad || 'Pendiente'}
                                                        tone={evaluacion.resultado_elegibilidad === 'No elegible' ? 'red' : 'emerald'}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                                <ButtonDinamic
                                                    onClick={() => cargarEvaluacionGuardada(evaluacion)}
                                                    className="bg-blue-700 hover:bg-blue-600"
                                                >
                                                    Cargar en formulario
                                                </ButtonDinamic>

                                                <ButtonDinamic
                                                    onClick={() => router.push(`/dashboard/evaluacionClinica/detalle/${evaluacion.id_evaluacion}`)}
                                                    className="bg-slate-700 hover:bg-slate-600"
                                                >
                                                    Ver detalle completo
                                                </ButtonDinamic>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400">Este paciente aún no tiene evaluaciones clínicas registradas.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FieldBlock({ label, children }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            {children}
        </div>
    );
}

function TextAreaField({ label, value, onChange, placeholder }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <TextAreaDinamic
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="min-h-[132px] w-full"
            />
        </div>
    );
}

function DataCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">{label}</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
        </div>
    );
}

function MetricCard({ label, value, tone = 'slate' }) {
    const toneClasses = {
        slate: 'border-slate-200 bg-slate-50 text-slate-900',
        blue: 'border-blue-200 bg-blue-50 text-blue-900',
        amber: 'border-amber-200 bg-amber-50 text-amber-900',
        red: 'border-red-200 bg-red-50 text-red-900'
    };

    return (
        <div className={`rounded-2xl border p-4 ${toneClasses[tone]}`}>
            <p className="text-xs font-medium uppercase tracking-[0.16em] opacity-70">{label}</p>
            <p className="mt-2 text-lg font-semibold">{value}</p>
        </div>
    );
}

function Tag({ label, tone = 'slate' }) {
    const toneClasses = {
        slate: 'border-slate-200 bg-white text-slate-700',
        blue: 'border-blue-200 bg-blue-50 text-blue-700',
        amber: 'border-amber-200 bg-amber-50 text-amber-700',
        red: 'border-red-200 bg-red-50 text-red-700',
        emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700'
    };

    return (
        <span className={`inline-flex w-full justify-center rounded-full border px-3 py-1 text-center text-xs font-medium ${toneClasses[tone]}`}>
            {label}
        </span>
    );
}
