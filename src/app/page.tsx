'use client'

import Link from 'next/link'
import { 
  ArrowRight, 
  Zap, 
  Linkedin, 
  FileText, 
  Mail, 
  Check, 
  Sparkles,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Create publication-ready articles in seconds using advanced AI that understands authority positioning.',
    gradient: 'from-[var(--color-burst-purple)] to-[var(--color-burst-indigo)]'
  },
  {
    icon: Shield,
    title: 'Platform Safe',
    description: 'No auto-posting. No account bans. You maintain full control over what gets published.',
    gradient: 'from-[var(--color-burst-cyan)] to-[var(--color-burst-blue)]'
  },
  {
    icon: Clock,
    title: 'Launch in Minutes',
    description: 'From idea to published article in under 3 minutes. Perfect for busy professionals.',
    gradient: 'from-[var(--color-burst-pink)] to-[var(--color-burst-purple)]'
  },
  {
    icon: TrendingUp,
    title: 'Authority Building',
    description: 'Leverage high-trust platforms like LinkedIn and Medium to establish thought leadership.',
    gradient: 'from-[var(--color-burst-success)] to-[var(--color-burst-cyan)]'
  },
]

const platforms = [
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Medium', icon: FileText },
  { name: 'Substack', icon: Mail },
]

const benefits = [
  'Generate articles optimized for each platform',
  'Multiple tone styles: authoritative, conversational, bold',
  'Save and manage your content library',
  'Image enhancement suggestions',
  'One-click copy for easy publishing',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen burst-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>
                <span>Get Started</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] text-[var(--color-burst-purple)] text-sm font-medium mb-8">
              <Zap size={14} />
              Authority Amplification Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Hijack Authority.
              <br />
              <span className="gradient-text">Dominate Platforms.</span>
            </h1>
            
            <p className="text-xl text-[var(--color-burst-muted)] max-w-2xl mx-auto mb-10">
              Generate AI-powered articles for LinkedIn, Medium, and high-trust publications. 
              Build your personal brand without the grind.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8">
                  <Sparkles size={20} />
                  <span>Start Creating Free</span>
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  <span>I have an account</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Platform Icons */}
          <div className="mt-16 flex items-center justify-center gap-8 animate-fade-in stagger-2">
            <span className="text-sm text-[var(--color-burst-muted)]">Publish to:</span>
            {platforms.map((platform) => (
              <div 
                key={platform.name}
                className="flex items-center gap-2 text-[var(--color-burst-text)]"
              >
                <platform.icon size={20} />
                <span className="text-sm font-medium">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Everything You Need to Build Authority
            </h2>
            <p className="text-[var(--color-burst-muted)] text-lg max-w-2xl mx-auto">
              Burst isn't an auto-poster. It's your authority amplifier. Generate premium content, 
              publish manually, and stay platform-compliant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="animate-fade-in p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-5`}>
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {feature.title}
                </h3>
                <p className="text-[var(--color-burst-muted)]">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Create Authority Content in{' '}
                <span className="gradient-text">Under 3 Minutes</span>
              </h2>
              <p className="text-[var(--color-burst-muted)] text-lg mb-8">
                Stop spending hours writing. Burst generates publication-ready content 
                that positions you as an expert on the platforms that matter.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[var(--color-burst-purple)] to-[var(--color-burst-cyan)] flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-white" />
                    </div>
                    <span className="text-[var(--color-burst-text)]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="animate-fade-in stagger-1 p-0 overflow-hidden">
              <div className="bg-gradient-to-br from-[rgba(139,92,246,0.1)] to-[rgba(6,182,212,0.05)] p-8">
                <div className="bg-[var(--color-burst-dark)] rounded-xl p-6 border border-[var(--color-burst-border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-burst-error)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--color-burst-warning)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--color-burst-success)]" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-[var(--color-burst-border)] rounded w-3/4" />
                    <div className="h-4 bg-[var(--color-burst-border)] rounded w-full" />
                    <div className="h-4 bg-[var(--color-burst-border)] rounded w-5/6" />
                    <div className="h-4 bg-gradient-to-r from-[var(--color-burst-purple)] to-[var(--color-burst-cyan)] rounded w-2/3 animate-pulse" />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-[var(--color-burst-muted)]">AI generating your article...</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-12 relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(139,92,246,0.1)] to-[rgba(6,182,212,0.1)]" />
            <div className="relative">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-[var(--color-burst-purple)] to-[var(--color-burst-cyan)] flex items-center justify-center mb-6 animate-pulse-glow">
                <Zap size={40} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Ready to Build Your Authority?
              </h2>
              <p className="text-[var(--color-burst-muted)] text-lg mb-8 max-w-xl mx-auto">
                Join thousands of professionals using Burst to establish thought leadership 
                and drive visibility on high-trust platforms.
              </p>
              <Link href="/signup">
                <Button size="lg" className="text-lg px-10">
                  <Sparkles size={20} />
                  <span>Get Started Free</span>
                </Button>
              </Link>
              <p className="mt-4 text-sm text-[var(--color-burst-muted)]">
                No credit card required • Start creating in seconds
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--color-burst-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Logo size="sm" />
            <p className="text-sm text-[var(--color-burst-muted)]">
              © 2024 Burst. Authority amplifier for the modern professional.
            </p>
            <div className="flex items-center gap-6 text-sm text-[var(--color-burst-muted)]">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
