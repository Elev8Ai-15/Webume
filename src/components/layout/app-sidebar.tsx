"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Resume", href: "/resume" },
  { label: "Profile", href: "/profile" },
  { label: "Gallery", href: "/gallery" },
  { label: "Activity", href: "/activity" },
  { label: "ATS Score", href: "/ats" },
  { label: "AI Tailor", href: "/tailor" },
  { label: "Pricing", href: "/pricing" },
  { label: "Settings", href: "/settings" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r border-border bg-sidebar md:block">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/dashboard" className="font-heading text-2xl">
          Webume
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({
                variant: pathname === item.href ? "secondary" : "ghost",
              }),
              "justify-start",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
