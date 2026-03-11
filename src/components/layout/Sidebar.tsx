'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  PenTool, 
  Image, 
  Send, 
  FileText, 
  Zap, 
  Infinity, 
  Bot, 
  Package,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  HelpCircle
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAppStore } from '@/store'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const mainNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/create', icon: PenTool, label: 'Create Article' },
  { href: '/images', icon: Image, label: 'Images' },
  { href: '/publish', icon: Send, label: 'Publish' },
  { href: '/saved', icon: FileText, label: 'Saved Articles' },
  { href: '/training', icon: GraduationCap, label: 'Training' },
  { href: '/support', icon: HelpCircle, label: 'Support' },
]

const upsellNavItems = [
  { href: '/upsell/10x', icon: Zap, label: '10X Mode', type: '10x' as const },
  { href: '/upsell/infinite', icon: Infinity, label: 'Infinite', type: 'infinite' as const },
  { href: '/upsell/automation', icon: Bot, label: 'Automation', type: 'automation' as const },
  { href: '/upsell/dfy', icon: Package, label: 'Done-For-You', type: 'dfy' as const },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarOpen, setSidebarOpen, unlockedUpsells } = useAppStore()
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const visibleUpsells = upsellNavItems.filter(item => 
    unlockedUpsells.includes(item.type)
  )

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen bg-[var(--color-locus-dark)] border-r border-[var(--color-locus-border)]
        transition-all duration-300 z-50 flex flex-col
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-5 border-b border-[var(--color-locus-border)]">
        <Logo size="md" showText={sidebarOpen} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-gradient-to-r from-[rgba(20,184,166,0.15)] to-[rgba(16,185,129,0.1)] text-white border border-[rgba(20,184,166,0.3)]' 
                    : 'text-[var(--color-locus-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                  }
                `}
              >
                <item.icon size={20} className={isActive ? 'text-[var(--color-locus-teal)]' : ''} />
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </Link>
            )
          })}
        </div>

        {/* Unlocked Upsells Section */}
        {visibleUpsells.length > 0 && (
          <div className="mt-8">
            {sidebarOpen && (
              <h3 className="px-3 text-xs font-semibold text-[var(--color-locus-muted)] uppercase tracking-wider mb-3">
                Premium Features
              </h3>
            )}
            <div className="space-y-1">
              {visibleUpsells.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-[rgba(6,182,212,0.15)] to-[rgba(20,184,166,0.1)] text-white border border-[rgba(6,182,212,0.3)]' 
                        : 'text-[var(--color-locus-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                      }
                    `}
                  >
                    <item.icon size={20} className={isActive ? 'text-[var(--color-locus-cyan)]' : ''} />
                    {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[var(--color-locus-border)]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-[var(--color-locus-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-24 bg-[var(--color-locus-card)] border border-[var(--color-locus-border)] rounded-full p-1.5 hover:border-[var(--color-locus-teal)] transition-all duration-200"
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </aside>
  )
}
