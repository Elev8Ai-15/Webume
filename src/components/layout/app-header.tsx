"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { AppNavigation } from "./app-sidebar";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const section = pathname.split("/").filter(Boolean)[0] || "dashboard";
  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-white/10 px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open navigation"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto">
              <SheetHeader className="px-7 pt-8">
                <SheetTitle className="text-3xl">Careerory</SheetTitle>
                <SheetDescription>Your career workspace</SheetDescription>
              </SheetHeader>
              <AppNavigation onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        <p className="text-sm text-muted-foreground">
          Workspace <span className="mx-2 text-border">/</span>
          <span className="capitalize text-foreground">{section}</span>
        </p>
      </div>
      <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
    </header>
  );
}
