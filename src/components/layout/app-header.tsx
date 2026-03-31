import { UserButton } from "@clerk/nextjs";

export function AppHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <div className="text-sm text-muted-foreground" />
      <UserButton
        appearance={{
          elements: { avatarBox: "h-8 w-8" },
        }}
      />
    </header>
  );
}
