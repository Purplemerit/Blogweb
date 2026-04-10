import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { AuthGuard } from "@/components/AuthGuard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen" style={{ backgroundColor: '#fff' }}>
        {/* Sidebar - hidden on mobile, shown on md+ */}
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden w-full">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto w-full" style={{ backgroundColor: '#fff' }}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
