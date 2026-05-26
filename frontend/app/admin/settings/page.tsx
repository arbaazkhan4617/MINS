import { PasswordManager } from "@/components/admin/password-manager";
import { SiteSettingsManager } from "@/components/admin/site-settings-manager";

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-6">
      <SiteSettingsManager />
      <PasswordManager />
    </div>
  );
}
