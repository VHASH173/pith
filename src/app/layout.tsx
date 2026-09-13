import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Asegúrate de tener la fuente que uses
import "./globals.css";
import AuthGuard from "../AuthGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pitch Black",
  description: "Tu compañero en la oscuridad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Aquí está el vigilante bloqueando la entrada */}
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}