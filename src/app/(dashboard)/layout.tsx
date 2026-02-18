import { getCFUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCFUser();

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userEmail={user?.email} userName={user?.name} />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
            {children}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
