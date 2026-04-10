'use client'

import Link from "next/link";
import RevealOnScroll from "@/Componentes/RevealOnScroll";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default function Seccion2() {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [infoData, setInfoData] = useState([]);

  const fallbackServices = [
    {
      id: "srv-1",
      name: "Atención médica general",
      description: "Evaluación integral de salud, orientación profesional y seguimiento.",
      image: "/fondo2.png",
    },
    {
      id: "srv-2",
      name: "Tratamientos Metabólicos",
      description: "Planes personalizados para la salud a largo plazo.",
      image: "/fondo3.png",
    },
    {
      id: "srv-3",
      name: "Nutrición Clínica",
      description: "Orientación alimentaria para mejorar tu calidad de vida.",
      image: "/fondo1.png",
    },
  ];

  const services = infoData.map((item) => ({
    id: item.id_publicacionesTituloDescripcion,
    name: item.publicacionesTitulo,
    description: item.publicacionesDescripcion,
    image: `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${item.publicacionesTituloDescripcionImagen}/card`,
  }));

  async function loadServices() {
    try {
      const res = await fetch(`${API}/publicacionesTituloDetalle/seleccionarPublicacionesTituloDetalle`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) return;

      const data = await res.json();
      setInfoData(data);
    } catch {
      console.warn("Could not load original seccion2 data, using fallbacks");
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const content = services.length > 0 ? services : fallbackServices;

  return (
    <section id="servicios-clinicos" className="scroll-mt-24 bg-slate-50 py-20 text-slate-800 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">

        {/* Header centered */}
        <RevealOnScroll>
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-8 bg-indigo-600"></div>
              <span className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
                Servicios Médicos
              </span>
              <div className="h-px w-8 bg-indigo-600"></div>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
              Nuestras Especialidades
            </h2>
            <p className="max-w-2xl text-lg text-slate-600">
              Explora todos los tratamientos y servicios dinámicos que ofrecemos en nuestra clínica para abordar tu salud metabólica de forma completa.
            </p>
          </div>
        </RevealOnScroll>

        {/* Dynamic Services Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {content.map((service, index) => (
            <RevealOnScroll
              key={service.id ?? index}
              delayClass={index % 3 === 1 ? "delay-100" : index % 3 === 2 ? "delay-200" : ""}
            >
              <article className="relative h-[480px] overflow-hidden rounded-[2.5rem] bg-slate-200 shadow-md group">
                {/* Background Full Image */}
                <Image
                  src={service.image}
                  alt={service.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition duration-500 ease-out group-hover:scale-105"
                />

                {/* Gradient overlay for readability and premium look */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />

                {/* Top Right Label for Service Name (if short enough) */}
                <div className="absolute top-6 right-6 rounded-full bg-indigo-600/90 backdrop-blur-md px-5 py-2 text-sm font-semibold text-white shadow-lg max-w-[80%] text-center truncate">
                  {service.name}
                </div>

                {/* Bottom Descriptions since it's a service, they need to see description */}
                <div className="absolute bottom-6 left-[6.5rem] right-6 p-2 pointer-events-none">
                  <h3 className="text-white font-bold text-lg leading-tight mb-1 drop-shadow-md">{service.name}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{service.description}</p>
                </div>

                {/* Bottom Left Cutout Illusion Wrapper */}
                <div className="absolute bottom-0 left-0 h-[5.5rem] w-[5.5rem] rounded-tr-[2rem] bg-slate-50 transition-colors">
                  <div className="absolute bottom-0 left-0 bg-slate-50 h-full w-full" />
                  {/* The interactive circular button resting in the cutout */}
                  <Link
                    href={`/contacto`}
                    className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 transition-all hover:scale-105"
                  >
                    <ArrowUpRight className="h-5 w-5" />
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
