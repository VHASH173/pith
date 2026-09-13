import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Aquí está la magia del SEO que pediste
export const metadata: Metadata = {
  title: "Hydra AI | Tu Ecosistema Inteligente",
  description: "Plataforma de IA con múltiples modelos especializados en código, ventas y marketing.",
  keywords: ["IA", "Inteligencia Artificial", "Generador de código", "Asistente virtual", "Hydra AI"],
  alternates: {
    canonical: "https://tu-dominio-futuro.com", // La URL principal para no perder ranking
  },
  openGraph: {
    title: "Hydra AI | Múltiples Cerebros, Una Plataforma",
    description: "Chatea con modelos especializados para potenciar tu productividad.",
    url: "https://tu-dominio-futuro.com",
    siteName: "Hydra AI Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}