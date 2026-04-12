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
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.metaclinic.cl"
);

export const metadata = {
  title: {
    default: "Metaclinic | Tratamiento Médico Metabólico en Santiago",
    template: "%s | Metaclinic",
  },
  description:
    "Metaclinic: Transformando la salud metabólica a través de la ciencia, empatía e innovación clínica. Evaluación médica, terapias GLP-1 y acompañamiento continuo en Santiago, Chile.",
  keywords: [
    "Metaclinic",
    "tratamiento metabólico",
    "GLP-1",
    "salud metabólica",
    "medicina clínica",
    "control de peso",
    "Santiago",
    "Chile",
    "tratamiento a medida",
    "consulta médica",
  ],
  authors: [{ name: "Metaclinic", url: metadataBase.href }],
  publisher: "Metaclinic",
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
    icon: "/logosolo.png",
    shortcut: "/logosolo.png",
    apple: "/logosolo.png",
  },
  openGraph: {
    title: "Metaclinic | Tratamiento Médico Metabólico en Santiago",
    description:
      "Transformando la salud metabólica a través de la ciencia, la empatía y la innovación clínica para resultados sostenibles.",
    url: metadataBase.href,
    siteName: "Metaclinic",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/logonombre.png",
        width: 1200,
        height: 630,
        alt: "Metaclinic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metaclinic",
    description:
      "Evaluación médica, terapias farmacológicas avanzadas (GLP-1) y acompañamiento continuo para control metabólico real.",
    image: "/logonombre.png",
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
