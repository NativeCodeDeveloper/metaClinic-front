"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Eye, Grid3x3, Flame, Infinity } from "lucide-react";
import RevealOnScroll from "@/Componentes/RevealOnScroll";

const TIER_FEATURES = [
    "Evaluación clínica y antropométrica",
    "Análisis e interpretación de exámenes bio-químicos",
    "Prescripción de medicamentos GLP-1 y ajustes dinámicos",
    "Plan de Alimentación Personalizado",
    "Pauta de suplementación específica",
    "Educación mensual médica / nutricional",
    "Acompañamiento online vía WhatsApp (Lun - Vie)",
    "Reporte estructurado de avances",
];

const METABOLIC_QUESTIONS = [
    {
        question: "¿Has intentado bajar de peso anteriormente sin resultados sostenibles?",
        options: ["Varias veces", "Solo una vez", "Nunca he intentado formalmente"],
    },
    {
        question: "¿Sientes fatiga frecuente o falta de energía después de comer?",
        options: ["Casi siempre", "A veces", "Nunca"],
    },
    {
        question: "¿Tienes historial o diagnóstico de resistencia a la insulina o SOP?",
        options: ["Sí, diagnosticado", "Sospecho tenerlo", "No tengo"],
    },
];

export default function ProgramaPage() {
    const [testStep, setTestStep] = useState(0);
    const [testAnswers, setTestAnswers] = useState([]);
    const [testCompleted, setTestCompleted] = useState(false);

    const handleOptionSelect = (option) => {
        const newAnswers = [...testAnswers, option];
        setTestAnswers(newAnswers);

        if (testStep < METABOLIC_QUESTIONS.length - 1) {
            setTestStep(testStep + 1);
        } else {
            setTestCompleted(true);
        }
    };

    return (
        <div className="bg-[#f8f9fa] text-slate-900 min-h-screen pt-32 pb-32 font-sans">

            {/* Header Section Minimalist */}
            <section className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10 mb-20 lg:mb-32">
                <RevealOnScroll>
                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-6xl lg:text-[6rem] font-medium tracking-tight leading-[1.05] mb-8">
                            Programa <br />
                            Metabólico.
                        </h1>
                        <p className="text-xl lg:text-2xl text-slate-500 font-light max-w-2xl leading-relaxed mb-10">
                            Un plan mensual diseñado para pacientes que buscan resultados reales,
                            prescripción segura (GLP-1) y acompañamiento guiado.
                        </p>
                        <a href="#test-metabolico" className="inline-flex rounded-full bg-slate-900 px-8 py-3.5 text-sm md:text-base font-medium text-white transition hover:bg-indigo-600">
                            Ir al Test Inicial
                        </a>
                    </div>
                </RevealOnScroll>
            </section>

            {/* Program Details - Asymmetrical minimalist split layout */}
            <section className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10 mb-32">
                <RevealOnScroll>
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

                        {/* Value Proposion Grid */}
                        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
                            <div className="group">
                                <span className="block text-slate-400 font-medium mb-4 border-b border-slate-200 pb-2">01</span>
                                <Eye strokeWidth={1} className="w-10 h-10 text-slate-900 mb-6 animate-icon-swing" />
                                <h3 className="font-medium text-xl mb-2 text-slate-900">Visión Médica</h3>
                                <p className="text-slate-500 font-light text-[15px]">Tratamiento con respaldo técnico y científico riguroso.</p>
                            </div>
                            <div className="group lg:mt-12">
                                <span className="block text-slate-400 font-medium mb-4 border-b border-slate-200 pb-2">02</span>
                                <Grid3x3 strokeWidth={1} className="w-10 h-10 text-slate-900 mb-6 animate-icon-bounce-slow" />
                                <h3 className="font-medium text-xl mb-2 text-slate-900">Pauta Exacta</h3>
                                <p className="text-slate-500 font-light text-[15px]">Trazabilidad nutricional y farmacológica diaria.</p>
                            </div>
                            <div className="group">
                                <span className="block text-slate-400 font-medium mb-4 border-b border-slate-200 pb-2">03</span>
                                <Flame strokeWidth={1} className="w-10 h-10 text-slate-900 mb-6 animate-icon-bounce-slow" />
                                <h3 className="font-medium text-xl mb-2 text-slate-900">Pérdida de Grasa</h3>
                                <p className="text-slate-500 font-light text-[15px]">Enfoque protector muscular y regenerativo base.</p>
                            </div>
                            <div className="group lg:mt-12">
                                <span className="block text-slate-400 font-medium mb-4 border-b border-slate-200 pb-2">04</span>
                                <Infinity strokeWidth={1} className="w-10 h-10 text-slate-900 mb-6 animate-icon-spin-pulse" />
                                <h3 className="font-medium text-xl mb-2 text-slate-900">Alianza Activa</h3>
                                <p className="text-slate-500 font-light text-[15px]">No estás solo durante tu transformación física.</p>
                            </div>
                        </div>

                        {/* Pricing Section Minimal */}
                        <div className="w-full lg:w-1/2 rounded-[2.5rem] bg-white p-12 lg:p-16">
                            <h3 className="font-medium tracking-tight text-3xl mb-10 text-slate-900">
                                ¿Qué incluye?
                            </h3>

                            <ul className="space-y-6 mb-12">
                                {TIER_FEATURES.map((feature, i) => (
                                    <li key={i} className="flex flex-start gap-4 text-slate-800">
                                        <Check className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                        <span className="font-light leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/agendaProfesionales"
                                className="inline-flex w-full justify-center rounded-full border border-slate-900 px-8 py-3.5 font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white"
                            >
                                Ver Disponibilidad
                            </Link>
                        </div>

                    </div>
                </RevealOnScroll>
            </section>

            {/* Interactive Metabolic Test - Clean App-like Layout */}
            <section id="test-metabolico" className="mx-auto w-full max-w-3xl px-5 md:px-8 lg:px-10">
                <RevealOnScroll>
                    <div className="flex flex-col text-center items-center">

                        <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
                            Test Inteligente.
                        </h2>
                        <p className="text-slate-500 text-lg font-light mb-12">
                            Responde 3 breves preguntas para pre-evaluar tu elegibilidad clínica.
                        </p>

                        <div className="w-full bg-white rounded-[2.5rem] p-10 md:p-16 border border-slate-100">
                            {!testCompleted ? (
                                <div className="w-full text-center">
                                    <div className="flex justify-center gap-3 mb-10">
                                        {METABOLIC_QUESTIONS.map((_, i) => (
                                            <div key={i} className={`h-1.5 w-16 rounded-full transition-all duration-300 ${i <= testStep ? 'bg-slate-900' : 'bg-slate-200'}`}></div>
                                        ))}
                                    </div>

                                    <h3 className="text-2xl lg:text-3xl font-medium text-slate-900 mb-10 leading-snug">
                                        {METABOLIC_QUESTIONS[testStep].question}
                                    </h3>

                                    <div className="flex flex-col gap-4">
                                        {METABOLIC_QUESTIONS[testStep].options.map((option, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleOptionSelect(option)}
                                                className="w-full text-left bg-transparent border border-slate-200 hover:border-slate-900 rounded-full px-8 py-4 font-medium text-slate-700 transition flex items-center justify-between group"
                                            >
                                                {option}
                                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full text-center py-6">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                        <Check className="w-10 h-10 text-slate-900 relative z-10" />
                                    </div>
                                    <h3 className="text-3xl font-medium text-slate-900 mb-4 leading-tight">
                                        ¡Análisis Completado!
                                    </h3>
                                    <p className="text-slate-500 text-lg font-light mb-10 leading-relaxed max-w-sm mx-auto">
                                        Basado en tu perfil, posees alta probabilidad de ser candidato a nuestro programa.
                                    </p>
                                    <Link
                                        href="/agendaProfesionales"
                                        className="inline-flex rounded-full bg-slate-900 px-8 py-4 text-white font-medium transition hover:bg-indigo-600"
                                    >
                                        Agendar mi Evaluación Médica
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>
                </RevealOnScroll>
            </section>

        </div>
    );
}
