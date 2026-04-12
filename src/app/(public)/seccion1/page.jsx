import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Stethoscope, Pill, CalendarClock } from "lucide-react";
import RevealOnScroll from "@/Componentes/RevealOnScroll";

const services = [
  {
    id: "consulta",
    title: "Consulta inicial metabólica",
    desc: "Evaluación médica completa con anamnesis estructurada y determinación de elegibilidad para el tratamiento.",
    icon: <Stethoscope className="h-6 w-6" />,
    img: "/logosolo.png",
  },
  {
    id: "tratamiento",
    title: "Tratamiento con GLP-1",
    desc: "Indicación y seguimiento de terapias, con titulación progresiva y control de efectos adversos.",
    icon: <Pill className="h-6 w-6" />,
    img: "/logosolo.png",
  },
  {
    id: "seguimiento",
    title: "Seguimiento semanal",
    desc: "Monitoreo digital con médico tratante para evaluar evolución clínica, adherencia y tolerancia.",
    icon: <CalendarClock className="h-6 w-6" />,
    img: "/logosolo.png",
  },
];

export default function Seccion1() {
  return (
    <section id="servicios" className="scroll-mt-24 bg-slate-50 py-20 sm:py-28 text-slate-800">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">

        {/* Header */}
        <RevealOnScroll className="max-w-3xl mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-10 bg-indigo-600"></div>
            <span className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
              Profesional y Especializado
            </span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-slate-600">
            Transforma tu peso y salud con nuestro programa integral. Desde la evaluación inicial hasta el control semanal, nuestro equipo médico asegura un tratamiento seguro y efectivo adaptado a ti.
          </p>
        </RevealOnScroll>

        {/* Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {services.map((item) => (
            <RevealOnScroll key={item.id} className="h-full">
              <article className="relative flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-white transition duration-300 hover:shadow-xl hover:shadow-slate-200">

                {/* The "notch" image effect */}
                <div className="absolute top-0 left-0 h-28 w-[65%]">
                  <div className="relative h-full w-full rounded-br-[2.5rem] overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="opacity-90"
                    />
                  </div>
                </div>

                {/* Card Content Area. Add top padding to clear the image notch */}
                <div className="relative z-10 flex flex-1 flex-col p-8 pt-[8.5rem]">
                  {/* Purple Circle Icon */}
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md shadow-indigo-200">
                    {item.icon}
                  </div>

                  <h3 className="mb-4 text-2xl font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h3>

                  <p className="mb-8 text-slate-600 leading-relaxed flex-1">
                    {item.desc}
                  </p>

                  <Link
                    href="/agendaProfesionales"
                    className="group inline-flex items-center font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    Saber más
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
}
