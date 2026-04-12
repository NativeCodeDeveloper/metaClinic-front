"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Portada() {
  const [dataPortada, setDataPortada] = useState([]);
  const API = process.env.NEXT_PUBLIC_API_URL;

  // Preserve backend fetch logic as per instructions
  async function cargarPortada() {
    try {
      const res = await fetch(`${API}/carruselPortada/seleccionarCarruselPortada`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setDataPortada(data);
      } else {
        setDataPortada([]);
      }
    } catch (err) {
      console.error("No se ha podido cargar datos del carrusel original", err);
    }
  }

  useEffect(() => {
    cargarPortada();
  }, []);

  return (
    <section id="inicio" className="relative w-full overflow-hidden bg-slate-50 pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">

          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              
              <span className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
                Tratamiento Médico Metabólico
              </span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6 leading-[1.1]">
              Transforma tu peso de forma clínica y segura
            </h1>

            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
              Evaluación médica completa, terapias farmacológicas avanzadas (GLP-1)
              y acompañamiento continuo para un control metabólico real y duradero.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="/agendaProfesionales"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-indigo-700"
              >
                Agendar consulta
              </Link>
              <Link
                href="/agendaProfesionales"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white transition-all hover:bg-indigo-700"
              >
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="relative pt-10 lg:pt-0">
            <div className="relative h-[500px] w-full sm:h-[600px] lg:h-[650px]">
              {/* Main rounded vertical image */}
              <div className="absolute right-0 top-0 h-[85%] w-[75%] overflow-hidden rounded-[2rem] bg-slate-200">
                {/* Fallback image if design hasn't got distinct metamedical photos. Using placeholder from existing or standard */}
                <Image
                  src="/corazon.webp"
                  alt="Tratamiento Médico"
                  layout="fill"
                  objectFit="cover"
                  className="opacity-90"
                />
              </div>

              {/* Top left horizontal rectangle image */}
              <div className="absolute left-0 top-0 h-[25%] w-[55%] overflow-hidden rounded-3xl border-4 border-slate-50 bg-slate-300">
                <Image
                  src="/metabologo.png"
                  alt="Consulta"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom left stats overlap card */}
              <div className="absolute bottom-[20%] left-0 w-[55%] rounded-3xl bg-white p-5 shadow-xl shadow-slate-200/50">
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Evaluaciones personalizadas y resultados reales con GLP-1.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {/* Placeholder avatars */}
                    <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white"></div>
                    <div className="h-8 w-8 rounded-full bg-indigo-200 border-2 border-white"></div>
                    <div className="h-8 w-8 rounded-full bg-slate-300 border-2 border-white"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">+1,200</p>
                    <p className="text-[10px] text-slate-500">Pacientes Activos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

