import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoanVault — Lending Management",
  description: "Modern loan management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
