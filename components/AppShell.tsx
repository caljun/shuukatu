import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 min-h-screen md:ml-60 pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
