import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import Header from "./Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Header />
      <Sidebar />
      <main className="flex-1 min-h-screen md:ml-60 pt-14 md:pt-0 pb-28 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
