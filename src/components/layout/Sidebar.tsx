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
  { href: '/saved', icon: FileText, label: 'Saved Articles' },
  { href: '/images', icon: Image, label: 'Images' },
  { href: '/publish', icon: Send, label: 'Publish' },
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
        fixed left-0 top-0 h-screen bg-locus-dark border-r border-locus-border
        transition-all duration-300 z-50 flex flex-col
        ${sidebarOpen ? 'w-64' : 'w-20'}
      `}
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-5 border-b border-locus-border">
        <Logo size="md" showText={sidebarOpen} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <div
                key={item.href}
                onClick={() => {
                  if (item.href === '/create') {
                    useAppStore.getState().setCurrentArticle(null)
                  }
                  router.push(item.href)
                }}
                className={`
                  relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group cursor-pointer
                  ${isActive 
                    ? 'bg-linear-to-r from-[rgba(20,184,166,0.15)] to-[rgba(16,185,129,0.1)] text-white border border-[rgba(20,184,166,0.3)] shadow-[0_0_15px_rgba(20,184,166,0.1)]' 
                    : 'text-locus-muted hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                  }
                `}
              >
                <item.icon size={20} className={isActive ? 'text-locus-teal' : 'group-hover:text-locus-teal transition-colors'} />
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                {isActive && sidebarOpen && (
                  <ChevronRight size={16} className="ml-auto text-locus-teal" />
                )}
              </div>
            )
          })}
        </div>

        {/* Unlocked Upsells Section */}
        {visibleUpsells.length > 0 && (
          <div className="mt-8">
            {sidebarOpen && (
              <h3 className="px-3 text-xs font-semibold text-locus-muted uppercase tracking-wider mb-3">
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
                      relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-linear-to-r from-[rgba(6,182,212,0.15)] to-[rgba(20,184,166,0.1)] text-white border border-[rgba(6,182,212,0.3)] shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                        : 'text-locus-muted hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                      }
                    `}
                  >
                    <item.icon size={20} className={isActive ? 'text-locus-cyan' : 'group-hover:text-locus-cyan transition-colors'} />
                    {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-locus-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-locus-muted hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200"
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>

    </aside>
  )
}
