"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import RevealOnScroll from "@/Componentes/RevealOnScroll";

const FALLBACK_CASE_IMAGE = "/ac3.png";

export default function Seccion3() {
  const scrollerRef = useRef(null);
  const [imageErrors, setImageErrors] = useState({});
  const [listaPublicaciones, setListaPublicaciones] = useState([]);
  const API = process.env.NEXT_PUBLIC_API_URL;

  // PRESCRIPTION: DO NOT ALTER BACKEND FETCH LOGIC
  async function listarPublicacionesSeccion3() {
    try {
      const res = await fetch(`${API}/publicaciones/seleccionarPublicaciones`, {
        method: "GET",
        headers: { Accept: "application/json" },
        mode: "cors",
      });

      if (!res.ok) {
        console.error("No se han podido listar publicaciones.");
        setListaPublicaciones([]);
        return [];
      }

      const publicaciones = await res.json();
      setListaPublicaciones(publicaciones);
      return publicaciones;
    } catch (err) {
      console.error("Problema al consultar backend desde la vista frontend:" + err);
      setListaPublicaciones([]);
      return [];
    }
  }

  useEffect(() => {
    listarPublicacionesSeccion3();
  }, []);

  const clinicalCases = listaPublicaciones.map((publicaciones) => ({
    title: publicaciones.descripcionPublicaciones,
    image: `https://imagedelivery.net/aCBUhLfqUcxA2yhIBn1fNQ/${publicaciones.imagenPublicaciones_primera}/card`,
  }));

  const scrollByAmount = (direction) => {
    const container = scrollerRef.current;
    if (!container) return;

    const firstCardWidth = container.firstElementChild?.clientWidth ?? 0;
    const styles = window.getComputedStyle(container);
    const gap = parseFloat(styles.columnGap || styles.gap || "0");
    const amount =
      firstCardWidth > 0 ? Math.round(firstCardWidth + gap) : Math.round(container.clientWidth * 0.82);
    const nextLeft = direction === "left" ? -amount : amount;

    container.scrollBy({ left: nextLeft, behavior: "smooth" });
  };

  return (
    <>
      <section id="testimonios" className="scroll-mt-24 bg-white py-20 text-slate-800 sm:py-28 overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">

          <RevealOnScroll>
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px w-8 bg-indigo-600"></div>
                <span className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
                  Testimonios
                </span>
                <div className="h-px w-8 bg-indigo-600"></div>
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
                Nuestros Pacientes Relatan Su Experiencia
              </h2>
              <p className="text-lg text-slate-600">
                Descubre cómo hemos transformado la salud y calidad de vida de quienes confiaron en nosotros. Tu bienestar metabólico es nuestro mayor logro.
              </p>
            </div>
          </RevealOnScroll>

          <div className="mt-10 flex items-center justify-end gap-3 mb-4">
            <button
              type="button"
              onClick={() => scrollByAmount("left")}
              aria-label="Desplazar resultados hacia la izquierda"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition hover:bg-slate-200 hover:text-indigo-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("right")}
              aria-label="Desplazar resultados hacia la derecha"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollerRef} className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-8 pt-2">
            {clinicalCases.length > 0 ? clinicalCases.map((item, index) => (
              <RevealOnScroll
                key={index}
                className="w-[90%] shrink-0 snap-start sm:w-[50%] lg:w-[350px]"
                delayClass={index === 0 ? "delay-100" : "delay-150"}
              >
                <article className="flex h-full flex-col justify-between rounded-[2rem] bg-slate-100 p-8 pt-10 shadow-sm">
                  <div>
                    {/* Testimonial Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-sm">
                        <img
                          src={imageErrors[item.image] ? FALLBACK_CASE_IMAGE : item.image}
                          alt="Patient"
                          loading="lazy"
                          className="h-full w-full object-cover"
                          onError={() =>
                            setImageErrors((current) => ({
                              ...current,
                              [item.image]: true,
                            }))
                          }
                        />
                      </div>
                      <Quote className="h-8 w-8 text-indigo-500 opacity-80" />
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-4 text-indigo-600">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-slate-700 leading-relaxed min-h-[5rem]">
                      {item.title || "Una experiencia muy profesional y guiada."}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <p className="font-bold text-slate-900">Paciente Metaclinic</p>
                    <p className="text-xs text-slate-500 mt-1">Tratamiento Asistido</p>
                  </div>
                </article>
              </RevealOnScroll>
            )) : (
              // Empty state to visualize layout if backend isn't returning yet
              [1, 2, 3, 4].map(placeholder => (
                <div key={placeholder} className="w-[90%] shrink-0 snap-start sm:w-[50%] lg:w-[350px] opacity-60">
                  <article className="flex h-full min-h-[320px] flex-col justify-between rounded-[2rem] bg-slate-100 p-8 pt-10 shadow-sm border border-dashed border-slate-300">
                    <p className="text-slate-400 text-center my-auto text-sm">Esperando datos del sistema...</p>
                  </article>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Agenda CTA Bottom Block */}
      <section id="agenda" className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-5xl px-5 md:px-8">
          <RevealOnScroll>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 px-6 py-16 text-center shadow-lg sm:px-12">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white opacity-5 mix-blend-overlay blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-indigo-400 opacity-20 mix-blend-overlay blur-3xl"></div>

              <div className="relative z-10">
                <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-white mb-6">
                  Inicia hoy tu transformación hacia un metabolismo sano
                </h2>
                <p className="mx-auto max-w-xl text-lg text-indigo-100 mb-10">
                  Reserva tu evaluación médica para determinar tu elegibilidad y comienza a recuperar el control de tu salud con profesionales expertos.
                </p>
                <Link
                  href="/agendaProfesionales"
                  className="inline-flex rounded-full bg-white px-8 py-4 font-bold text-indigo-600 transition hover:bg-slate-50 hover:scale-105 shadow-md"
                >
                  Agendar evaluación clínica
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
