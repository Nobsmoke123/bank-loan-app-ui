import type { Metadata } from "next";
import { getAuthUser } from "@/lib/dal";
import AuthProvider from "@/providers/auth.provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loan App - Lending Management",
  description: "Modern loan management platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getAuthUser();

  return (
    <html lang="en">
      <body>
        <AuthProvider initialUser={authUser}>{children}</AuthProvider>
      </body>
    </html>
  );
}
