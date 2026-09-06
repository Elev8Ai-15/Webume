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
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader />
        <main
          id="main-content"
          className="workspace-main mx-auto w-full max-w-7xl flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
