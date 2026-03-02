import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hirvo — Orbital Timeline",
  description: "Radial orbital timeline component",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black antialiased">{children}</body>
    </html>
  );
}
