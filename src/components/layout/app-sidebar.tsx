"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileUp,
  BookOpen,
  Images,
  Milestone,
  ScanText,
  WandSparkles,
  Settings2,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Your portfolio",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Profile", href: "/profile", icon: BookOpen },
      { label: "Resume import", href: "/resume", icon: FileUp },
      { label: "Gallery", href: "/gallery", icon: Images },
      { label: "Testimonials", href: "/testimonials", icon: BookOpen },
      { label: "Career milestones", href: "/milestones", icon: Milestone },
    ],
  },
  {
    label: "Application tools",
    items: [
      { label: "ATS Score", href: "/ats", icon: ScanText },
      { label: "AI Tailor", href: "/tailor", icon: WandSparkles },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Plan & billing", href: "/pricing", icon: CreditCard },
      { label: "Settings & publishing", href: "/settings", icon: Settings2 },
    ],
  },
];

export function AppNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Workspace" className="space-y-7 px-4 py-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-3 px-3 text-xs font-medium uppercase tracking-[.16em] text-muted-foreground">
            {group.label}
          </p>
          <div className="space-y-1">
            {group.items.map(({ icon: Icon, ...item }) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "border-primary/20 bg-primary/10 text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground",
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn("h-4 w-4 shrink-0", active && "text-primary")}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-white/10 bg-sidebar md:flex">
      <Link
        href="/dashboard"
        className="flex h-24 shrink-0 items-center gap-3 px-7 font-heading text-3xl"
      >
        <span className="text-primary">w.</span>Webume
      </Link>
      <div className="flex-1 overflow-y-auto">
        <AppNavigation />
      </div>
      <div className="m-5 border-t border-white/10 pt-5">
        <p className="text-sm text-foreground">A career worth knowing.</p>
        <Link
          href="/profile"
          className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"
        >
          Preview your portfolio{" "}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
