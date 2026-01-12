import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f5f1e8' }}>
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: '#f5f1e8' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
