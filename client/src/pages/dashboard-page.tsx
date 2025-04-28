import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Dashboard from "@/components/dashboard/index";

export default function DashboardPage() {
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <MobileNav />
      
      <main className="flex-1 overflow-y-auto bg-neutral-100 pb-16 md:pb-0">
        <Dashboard />
      </main>
    </div>
  );
}
