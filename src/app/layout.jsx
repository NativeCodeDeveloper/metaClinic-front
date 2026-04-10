import "./globals.css";
import { AnimatedLayout } from "@/Componentes/AnimatedLayout";
import AgendaProvider from "@/ContextosGlobales/AgendaContext";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.centrointegralessenza.cl"
);

export const metadata = {
  title: {
    default: "Centro Integral ESSENZA | Salud, Bienestar y Estética",
    template: "%s | Centro Integral ESSENZA",
  },
  description:
    "Centro Integral ESSENZA en Pitrufquén. Salud integral con medicina, psicología, nutrición, fonoaudiología, estética y terapias complementarias.",
  keywords: [
    "Centro Integral ESSENZA",
    "salud integral",
    "bienestar",
    "psicologia",
    "medicina general",
    "nutricion",
    "fonoaudiologia",
    "cosmetologia",
    "masoterapia",
    "Pitrufquen",
  ],
  authors: [{ name: "Centro Integral ESSENZA", url: metadataBase.href }],
  publisher: "Centro Integral ESSENZA",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: metadataBase.href,
  },
  icons: {
    icon: "/logo1.png",
    shortcut: "/logo1.png",
    apple: "/logo1.png",
  },
  openGraph: {
    title: "Centro Integral ESSENZA | Salud, Bienestar y Estética",
    description:
      "Un espacio diseñado para el bienestar completo, con atención profesional, cercana y personalizada.",
    url: metadataBase.href,
    siteName: "Centro Integral ESSENZA",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Centro Integral ESSENZA",
    description:
      "Psicología, medicina, estética y bienestar integral en Pitrufquén.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-200">
        <AnimatedLayout>
          <AgendaProvider>{children}</AgendaProvider>
        </AnimatedLayout>
      </body>
    </html>
  );
}
