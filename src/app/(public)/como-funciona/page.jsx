"use client";

import RevealOnScroll from "@/Componentes/RevealOnScroll";
import Link from "next/link";
import { ScanFace, Aperture, Orbit, Target } from "lucide-react";

const STEPS = [
    {
        title: "Evaluación Médica",
        description: "Evaluación clínica estructural adaptada a tus necesidades bioquímicas e historial clínico para determinar tu elegibilidad.",
        icon: ScanFace,
        colorClass: "bg-slate-100 text-slate-800",
    },
    {
        title: "Inicio Tratamiento",
        description: "Utilizamos terapias farmacológicas avanzadas y basadas en evidencia científica (como agonistas GLP-1) prescriptas por médicos expertos.",
        icon: Aperture,
        colorClass: "bg-indigo-50 text-indigo-700",
    },
    {
        title: "Seguimiento Semanal",
        description: "Monitoreo remoto activo, acompañamiento nutricional profundo y ajustes dinámicos de tratamiento según tu tolerancia y avance.",
        icon: Orbit,
        colorClass: "bg-slate-100 text-slate-800",
    },
    {
        title: "Resultados Sostenibles",
        description: "Un manejo continuo altamente adherente que permite no solo la pérdida de peso, sino una real reestructuración de tu perfil cardiometabólico.",
        icon: Target,
        colorClass: "bg-indigo-50 text-indigo-700",
    },
];

export default function ComoFuncionaPage() {
    return (
        <div className="bg-[#f8f9fa] min-h-screen pt-32 pb-32 font-sans text-slate-900">
            <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">

                {/* Header Block Minimal */}
                <RevealOnScroll>
                    <div className="max-w-3xl mb-24 lg:mb-32">
                        <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-medium tracking-tight leading-[1.05] mb-8">
                            Tu Ruta a <br />
                            la Salud.
                        </h1>
                        <p className="text-slate-500 text-xl font-light leading-relaxed max-w-2xl">
                            Combinamos evaluación estructurada, algoritmos clínicos de evidencia y un
                            seguimiento semanal digital para un manejo metabólico continuo.
                        </p>
                    </div>
                </RevealOnScroll>

                {/* Steps Grid - Minimalist approach */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-start">
                    {STEPS.map((step, index) => {
                        const StepIcon = step.icon;

                        return (
                            <RevealOnScroll key={index} delayClass={`delay-${index * 100}`}>
                                <div className={`flex flex-col ${index % 2 !== 0 ? 'lg:mt-16' : ''}`}>

                                    {/* Numbering at top left */}
                                    <span className="text-slate-400 font-medium text-lg mb-6 border-b border-slate-200 pb-4 inline-block w-full">
                                        0{index + 1}
                                    </span>

                                    {/* Clean Visual box */}
                                    <div className="w-full aspect-[4/3] bg-white rounded-3xl flex items-center justify-center mb-8 group overflow-hidden transition-all duration-700 hover:-translate-y-2">
                                        <div className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl ${step.colorClass}`}>
                                            <StepIcon strokeWidth={1} className={`h-10 w-10 ${index % 2 === 0 ? 'animate-icon-bounce-slow' : 'animate-icon-swing'}`} />
                                        </div>
                                    </div>

                                    {/* Clean Typography */}
                                    <h3 className="text-xl md:text-2xl font-medium text-slate-900 mb-3">{step.title}</h3>
                                    <p className="text-slate-500 font-light leading-relaxed text-[15px]">
                                        {step.description}
                                    </p>
                                </div>
                            </RevealOnScroll>
                        );
                    })}
                </div>

                {/* Bottom CTA Outline Minimal */}
                <RevealOnScroll className="mt-32">
                    <div className="flex flex-col md:flex-row gap-12 items-center justify-between rounded-[2.5rem] bg-white p-12 md:p-20">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
                                ¿Listo para el Paso 01?
                            </h2>
                            <p className="text-slate-500 text-lg font-light">
                                Inicia tu evaluación médica. Tomamos decisiones individualizadas para tu éxito continuo.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                            <Link
                                href="/agendaProfesionales"
                                className="inline-flex rounded-full border border-slate-900 px-8 py-3.5 text-sm md:text-base font-medium text-slate-900 transition hover:bg-slate-900 hover:text-white"
                            >
                                Agendar Mi Evaluación
                            </Link>
                        </div>
                    </div>
                </RevealOnScroll>

            </div>
        </div>
    );
}
