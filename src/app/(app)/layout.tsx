import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { ensureUser } from "@/lib/repositories/user.repository";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureUser();
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
