"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { formatRole } from "@/lib/format";
import { useAuth } from "@/providers/auth.context";

export default function Navbar() {
  const pathname = usePathname();
  const { authUser } = useAuth();

  if (!authUser) {
    return null;
  }

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/loans", label: "Loans" },
    ...(authUser.role === "CUSTOMER"
      ? [
          { href: "/loan-application", label: "Apply" },
          { href: "/loan-repayment", label: "Repayment" },
        ]
      : [{ href: "/loan-processing", label: "Processing" }]),
  ];

  function isActiveLink(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="bg-slate text-cream border-b border-cream/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gold flex items-center justify-center">
            <span className="text-ink font-display font-bold text-sm">L</span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            Loan App
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm tracking-wide transition-colors ${
                isActiveLink(link.href)
                  ? "bg-cream/10 text-gold"
                  : "text-cream/70 hover:text-cream hover:bg-cream/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <div className="text-sm text-cream">{authUser.name}</div>
            <div className="text-xs text-cream/50">{formatRole(authUser.role)}</div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm px-4 py-2 border border-cream/20 text-cream/70 hover:border-cream/50 hover:text-cream transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </div>

      <div className="md:hidden flex overflow-x-auto border-t border-cream/10">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-shrink-0 px-4 py-2.5 text-xs tracking-widest uppercase transition-colors ${
              isActiveLink(link.href)
                ? "text-gold border-b-2 border-gold"
                : "text-cream/60 hover:text-cream"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
