import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences.
        </p>
      </div>
      <Separator />
      <p className="text-sm text-muted-foreground">
        Settings coming in Phase 2.
      </p>
    </div>
  );
}
