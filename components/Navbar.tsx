"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { setCurrentUser } from "@/lib/store";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/loan-application", label: "Apply" },
  { href: "/loan-processing", label: "Processing" },
  { href: "/loan-repayment", label: "Repayment" },
];

export default function Navbar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    setCurrentUser(null);
    router.push("/login");
  }

  return (
    <header className="bg-slate text-cream border-b border-cream/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gold flex items-center justify-center">
            <span className="text-ink font-display font-bold text-sm">L</span>
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">LoanVault</span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm tracking-wide transition-colors ${
                pathname === link.href
                  ? "bg-cream/10 text-gold"
                  : "text-cream/70 hover:text-cream hover:bg-cream/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-cream/60 hidden sm:block">
            {userName}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm px-4 py-2 border border-cream/20 text-cream/70 hover:border-cream/50 hover:text-cream transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex overflow-x-auto border-t border-cream/10">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-shrink-0 px-4 py-2.5 text-xs tracking-widest uppercase transition-colors ${
              pathname === link.href
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
