import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Be Global Pro — Pilot Control",
  description:
    "Dashboard operativo del piloto de agentes IA de Be Global Pro.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
