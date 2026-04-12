import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const footerLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Equipo Médico", href: "/#equipo" },
  { label: "Testimonios", href: "/#testimonios" },
  { label: "Agendar", href: "/reserva-hora" },
];

const externalLinks = [
  { label: "Portal Paciente", href: "#" },
  { label: "Preguntas Frecuentes", href: "#" },
  { label: "Términos y Condiciones", href: "#" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "#",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "#",
    icon: Facebook,
  },
  {
    label: "WhatsApp",
    href: "#",
    icon: MessageCircle,
  },
];

export default function FooterPremiumMedico() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-slate-950 text-slate-300 pt-20 pb-12">

      {/* Background Watermark */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none select-none overflow-hidden opacity-5 z-0">
        <span className="text-[16vw] font-black leading-none text-white whitespace-nowrap translate-y-1/4">
          METABOCARE
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 border-b border-slate-800 pb-16">

          {/* Brand Info */}
          <div className="lg:col-span-4">
            {/* Brand / Logo */}
            <Link href="/" aria-label="Ir al inicio" className="group flex shrink-0 items-center gap-3 mb-6">
              <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logonombre.png"
                  alt="Logo Metaclinic"
                  width={165}
                  height={65}
                  priority
                  className="h-12 w-auto object-contain sm:h-18"
                />
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm mb-8">
              Transformando la salud metabólica a través de la ciencia, la empatía y la innovación clínica para resultados sostenibles.
            </p>

            <div className="space-y-4 text-sm text-slate-400">
              <a href="tel:+56987728500" className="flex items-center gap-3 transition hover:text-indigo-400">
                <Phone className="h-5 w-5 text-indigo-500" />
                +56 9 8772 8500
              </a>
              <a href="mailto:Centrointegral.essenza@gmail.com" className="flex items-center gap-3 transition hover:text-indigo-400">
                <Mail className="h-5 w-5 text-indigo-500" />
                contacto@metaclinic.cl
              </a>
              <a
                href="https://maps.google.com/?q=Santiago,+Chile"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition hover:text-indigo-400"
              >
                <MapPin className="h-5 w-5 shrink-0 text-indigo-500" />
                Santiago, Chile
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">

            {/* Column 1 */}
            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Explorar</h4>
              <ul className="space-y-4">
                {footerLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-slate-400 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Legal & Ayuda</h4>
              <ul className="space-y-4">
                {externalLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-slate-400 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Socials & Location */}
            <div>
              <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Síguenos</h4>
              <div className="flex gap-4 mb-8">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-indigo-600 hover:text-white"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>

              <div className="rounded-2xl overflow-hidden h-32 w-full mt-4">
                <iframe
                  title="Mapa ubicacion Metaclinic"
                  src="https://www.google.com/maps?q=Santiago,+Chile&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full grayscale opacity-70"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between px-2">
          <p>© {new Date().getFullYear()} Metaclinic. Todos los derechos reservados.</p>
          <p>
            Desarrollado por{" "}
            <a
              href="https://nativecode.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-400 hover:text-white transition"
            >
              NativeCode
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
