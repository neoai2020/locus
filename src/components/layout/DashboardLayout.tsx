'use client'

import { useAppStore } from '@/store'
import Sidebar from './Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="min-h-screen locus-bg">
      <Sidebar />
      <main 
        className={`
          transition-all duration-300 min-h-screen
          ${sidebarOpen ? 'ml-64' : 'ml-20'}
        `}
      >
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
