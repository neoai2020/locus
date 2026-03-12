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
  HelpCircle,
  Lock,
  Crown,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAppStore } from '@/store'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'


const mainNavItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/create', icon: PenTool, label: 'Create Article' },
  { href: '/saved', icon: FileText, label: 'My Portfolio' },
  { href: '/images', icon: Image, label: 'Images' },
  { href: '/publish', icon: Send, label: 'Publish' },
  { href: '/training', icon: GraduationCap, label: 'Training' },
  { href: '/support', icon: HelpCircle, label: 'Support' },
]

const premiumNavItems = [
  { href: '/upsell/10x', icon: Zap, label: '10X Mode', type: '10x' as const, gradient: 'from-yellow-500 to-orange-500' },
  { href: '/upsell/infinite', icon: Infinity, label: 'Infinite', type: 'infinite' as const, gradient: 'from-blue-500 to-cyan-500' },
  { href: '/upsell/automation', icon: Bot, label: 'Automation', type: 'automation' as const, gradient: 'from-purple-500 to-pink-500' },
  { href: '/upsell/dfy', icon: Package, label: 'Done-For-You', type: 'dfy' as const, gradient: 'from-emerald-500 to-teal-500' },
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

        {/* Premium Features — always visible */}
        <div className="mt-8">
          {sidebarOpen && (
            <div className="flex items-center gap-2 px-3 mb-3">
              <Crown size={12} className="text-amber-400" />
              <h3 className="text-xs font-semibold text-amber-400/80 uppercase tracking-wider">
                Premium
              </h3>
            </div>
          )}
          {!sidebarOpen && (
            <div className="flex justify-center mb-3">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            </div>
          )}
          <div className="space-y-1">
            {premiumNavItems.map((item) => {
              const isActive = pathname === item.href
              const isUnlocked = unlockedUpsells.includes(item.type)
              const targetHref = isUnlocked ? item.href : `/unlock/${item.type}`
              return (
                <Link
                  key={item.href}
                  href={targetHref}
                  className={`
                    relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-linear-to-r from-[rgba(245,158,11,0.12)] to-[rgba(251,191,36,0.08)] text-white border border-[rgba(245,158,11,0.3)] shadow-[0_0_15px_rgba(245,158,11,0.08)]' 
                      : 'text-locus-muted hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                    }
                  `}
                >
                  <div className="relative">
                    <item.icon
                      size={20}
                      className={
                        isActive
                          ? 'text-amber-400'
                          : isUnlocked
                            ? 'text-amber-400/70 group-hover:text-amber-400 transition-colors'
                            : 'text-locus-muted/60 group-hover:text-locus-muted transition-colors'
                      }
                    />
                    {!isUnlocked && (
                      <Lock size={8} className="absolute -bottom-0.5 -right-0.5 text-locus-muted/80" />
                    )}
                  </div>
                  {sidebarOpen && (
                    <>
                      <span className={`font-medium text-sm flex-1 ${!isUnlocked ? 'opacity-70' : ''}`}>
                        {item.label}
                      </span>
                      {isUnlocked ? (
                        isActive && <ChevronRight size={16} className="ml-auto text-amber-400" />
                      ) : (
                        <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400/10 text-amber-400/70 border border-amber-400/20">
                          Pro
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
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
