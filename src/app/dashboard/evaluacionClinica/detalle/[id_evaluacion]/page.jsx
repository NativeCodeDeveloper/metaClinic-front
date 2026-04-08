'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ButtonDinamic } from "@/Componentes/ButtonDinamic";
import ToasterClient from "@/Componentes/ToasterClient";
import toast from 'react-hot-toast';

export default function DetalleEvaluacionClinica() {
    const { id_evaluacion } = useParams();
    const router = useRouter();
    const API = process.env.NEXT_PUBLIC_API_URL;
    const [detalleEvaluacion, setDetalleEvaluacion] = useState(null);

    async function seleccionarEvaluacionEspecifica(id_evaluacion) {
        try {
            if (!id_evaluacion) {
                return toast.error('No se encontró el identificador de la evaluación.');
            }

            const res = await fetch(`${API}/evolucionClinica/seleccionar_evolucionEspecifica`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_evaluacion }),
                mode: 'cors'
            });

            if (!res.ok) {
                return toast.error('Error al cargar el detalle de la evaluación clínica.');
            }

            const respustaBackend = await res.json();
            const resultadoModel = Array.isArray(respustaBackend?.resultadoModel) ? respustaBackend.resultadoModel[0] : null;

            if (resultadoModel) {
                setDetalleEvaluacion(resultadoModel);
            } else {
                return toast.error('No se encontró información para esta evaluación clínica.');
            }
        } catch (error) {
            return toast.error('Error al cargar el detalle de la evaluación clínica.');
        }
    }

    useEffect(() => {
        seleccionarEvaluacionEspecifica(id_evaluacion);
    }, [id_evaluacion]);

    const tonoElegibilidad = detalleEvaluacion?.resultado_elegibilidad === 'No elegible'
        ? 'border-red-200 bg-red-50 text-red-900'
        : detalleEvaluacion?.resultado_elegibilidad === 'Elegible'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
            : 'border-slate-200 bg-slate-50 text-slate-900';

    const fechaEvaluacionFormateada = detalleEvaluacion?.fecha_evaluacion
        ? String(detalleEvaluacion.fecha_evaluacion).slice(0, 10)
        : 'Sin fecha';

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#edf4ff_0%,#f6f9fc_24%,#ffffff_100%)]">
            <ToasterClient />

            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
                <div className="relative overflow-hidden rounded-[28px] border border-slate-200/70 bg-[linear-gradient(135deg,#0f172a_0%,#172554_38%,#1d4ed8_100%)] p-5 text-white shadow-[0_36px_90px_-52px_rgba(15,23,42,0.7)] sm:p-6">
                    <div className="absolute -right-16 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute left-8 top-8 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
                    <div className="absolute bottom-0 right-1/3 h-20 w-20 rounded-full bg-blue-200/10 blur-2xl" />

                    <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex w-fit rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-medium tracking-[0.18em] text-blue-100 backdrop-blur">
                                Detalle de evaluación
                            </div>

                            <div className="space-y-1.5">
                                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                                    Evaluación clínica #{id_evaluacion}
                                </h1>
                                <p className="text-xs font-medium text-blue-100/80 sm:text-sm">
                                    Fecha evaluacion: <span className="font-semibold text-white">{fechaEvaluacionFormateada}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <ButtonDinamic
                                onClick={() => router.back()}
                                className="bg-white text-slate-900 hover:bg-slate-100"
                            >
                                Volver
                            </ButtonDinamic>
                        </div>
                    </div>
                </div>

                {detalleEvaluacion && (
                    <>
                        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                            <MetricStrip
                                label="Score total"
                                value={detalleEvaluacion.score_total || '0'}
                                tone="blue"
                            />
                            <MetricStrip
                                label="Tipo de evaluación"
                                value={detalleEvaluacion.tipo_evaluacion || 'Sin dato'}
                                tone="slate"
                            />
                            <MetricStrip
                                label="Resultado"
                                value={detalleEvaluacion.resultado_elegibilidad || 'Pendiente'}
                                tone={detalleEvaluacion.resultado_elegibilidad === 'No elegible' ? 'red' : 'emerald'}
                            />
                        </div>

                        <div className="mt-6 flex flex-col gap-6">
                            <section className="rounded-[26px] border border-slate-200/75 bg-white/95 p-5 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.34)] sm:p-6">
                                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                        <div>
                                            <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
                                                Variables clínicas
                                            </div>
                                            <h2 className="pt-2 text-base font-semibold text-slate-900">Mediciones y signos clínicos</h2>
                                        </div>

                                        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-3 py-2.5 shadow-sm">
                                            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-blue-600">IMC actual</p>
                                            <p className="mt-1.5 text-base font-semibold text-blue-900">{detalleEvaluacion.imc || 'Sin dato'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                                        <InfoBlock label="Peso (kg)" value={detalleEvaluacion.peso_kg} />
                                        <InfoBlock label="Talla (cm)" value={detalleEvaluacion.talla_cm} />
                                        <InfoBlock label="Cintura (cm)" value={detalleEvaluacion.cintura_cm} />
                                        <InfoBlock label="IMC" value={detalleEvaluacion.imc} />
                                        <InfoBlock label="PA sistólica" value={detalleEvaluacion.pa_sistolica} />
                                        <InfoBlock label="PA diastólica" value={detalleEvaluacion.pa_diastolica} />
                                        <InfoBlock label="Estado" value={detalleEvaluacion.estado || 'Sin dato'} />
                                        <InfoBlock label="Tipo evaluación" value={detalleEvaluacion.tipo_evaluacion || 'Sin dato'} />
                                        <InfoBlock label="Score total" value={detalleEvaluacion.score_total || '0'} />
                                    </div>
                            </section>

                            <section className="rounded-[26px] border border-slate-200/75 bg-white/95 p-5 shadow-[0_24px_60px_-46px_rgba(15,23,42,0.34)] sm:p-6">
                                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-2">
                                        <div className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                                            Narrativa clínica
                                        </div>
                                        <h2 className="text-base font-semibold text-slate-900">Contexto médico registrado</h2>
                                    </div>

                                    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${tonoElegibilidad}`}>
                                        <p className="text-[11px] font-medium uppercase tracking-[0.16em] opacity-70">Elegibilidad</p>
                                        <p className="mt-1.5 text-base font-semibold">{detalleEvaluacion.resultado_elegibilidad || 'Pendiente'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                    <TextCard label="Justificación del resultado" value={detalleEvaluacion.justificacion_resultado} />
                                    <TextCard label="Actividad física" value={detalleEvaluacion.actividad_fisica} />
                                    <TextCard label="Motivo consulta" value={detalleEvaluacion.motivo_consulta} />
                                    <TextCard label="Medicamentos actuales" value={detalleEvaluacion.medicamentos_actuales} />
                                    <TextCard label="Alergias" value={detalleEvaluacion.alergias} />
                                    <TextCard label="Tratamientos previos obesidad" value={detalleEvaluacion.tratamientos_previos_obesidad} />
                                    <TextCard label="Historia familiar" value={detalleEvaluacion.historia_familiar} />
                                    <TextCard label="Observaciones clínicas" value={detalleEvaluacion.observaciones_clinicas} />
                                </div>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function MetricStrip({ label, value, tone = 'slate' }) {
    const classes = {
        slate: 'border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] text-slate-900',
        blue: 'border-blue-200 bg-[linear-gradient(180deg,#eff6ff_0%,#dbeafe_100%)] text-blue-900',
        red: 'border-red-200 bg-[linear-gradient(180deg,#fef2f2_0%,#fee2e2_100%)] text-red-900',
        emerald: 'border-emerald-200 bg-[linear-gradient(180deg,#ecfdf5_0%,#d1fae5_100%)] text-emerald-900'
    };

    return (
        <div className={`rounded-[22px] border p-4 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.28)] ${classes[tone]}`}>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] opacity-70">{label}</p>
            <p className="mt-2 text-lg font-semibold">{value}</p>
        </div>
    );
}

function InfoBlock({ label, value }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{value || 'Sin dato'}</p>
        </div>
    );
}

function TextCard({ label, value }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-sm">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">{label}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{value || 'Sin información registrada.'}</p>
        </div>
    );
}
