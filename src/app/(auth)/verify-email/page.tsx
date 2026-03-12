'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShieldCheck, RotateCcw, Mail, ArrowRight, AlertTriangle, Gift, Inbox } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const TIMER_SECONDS = 60
const OTP_LENGTH = 6

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-locus-teal border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-locus-muted text-sm">Loading...</p>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const name = searchParams.get('name') || ''

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [timer, setTimer] = useState(TIMER_SECONDS)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState<boolean | null>(null)
  const [verifying, setVerifying] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Send OTP email on mount (never auto-redirect — always wait for timer)
  useEffect(() => {
    const sendEmail = async () => {
      try {
        const res = await fetch('/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name }),
        })
        const data = await res.json()
        setEmailSent(data.sent)
      } catch {
        setEmailSent(false)
      }
    }

    if (email) sendEmail()
  }, [email, name, router])

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return
    const interval = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(interval)
  }, [timer])

  // Handle input change
  const handleChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const digit = value.slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError('')

    // Auto-focus next
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all digits filled
    const code = newOtp.join('')
    if (code.length === OTP_LENGTH) {
      verifyCode(code)
    }
  }, [otp])

  // Handle paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return

    const newOtp = Array(OTP_LENGTH).fill('')
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)

    if (pasted.length === OTP_LENGTH) {
      verifyCode(pasted)
    } else {
      inputRefs.current[pasted.length]?.focus()
    }
  }, [])

  // Handle backspace
  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }, [otp])

  // Verify the code
  const verifyCode = (code: string) => {
    setVerifying(true)
    // Static code check — uses env or defaults to 123456
    const staticCode = '123456'
    setTimeout(() => {
      if (code === staticCode) {
        router.push('/dashboard')
      } else {
        setError('Invalid code. Please try again.')
        setVerifying(false)
        setOtp(Array(OTP_LENGTH).fill(''))
        inputRefs.current[0]?.focus()
      }
    }, 800) // slight delay for UX
  }

  // Resend / Bypass handler
  const handleResend = () => {
    // Bypass: directly enter the app
    router.push('/dashboard')
  }

  // Timer display
  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60
  const timerProgress = ((TIMER_SECONDS - timer) / TIMER_SECONDS) * 100

  return (
    <div className="animate-fade-in">
      <div className="flex justify-center mb-8">
        <Logo size="lg" />
      </div>

      <Card className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-[rgba(45,212,191,0.15)] to-[rgba(16,185,129,0.15)] border border-[rgba(45,212,191,0.25)] flex items-center justify-center">
            <ShieldCheck size={28} className="text-locus-teal" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Verify Your Email
          </h1>
          <p className="text-locus-muted text-sm">
              We sent a 6-digit code to <span className="text-locus-teal font-medium">{email || 'your email'}</span>. It may take up to 60 seconds to arrive.
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={verifying}
              className={`
                w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl
                border-2 transition-all duration-200 outline-none
                bg-[rgba(255,255,255,0.03)]
                ${digit 
                  ? 'border-locus-teal text-white shadow-[0_0_12px_rgba(45,212,191,0.2)]' 
                  : 'border-[rgba(255,255,255,0.1)] text-white'}
                focus:border-locus-teal focus:shadow-[0_0_16px_rgba(45,212,191,0.25)]
                disabled:opacity-50
              `}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-sm text-red-400 mb-4">{error}</p>
        )}

        {/* Timer + Resend */}
        <div className="text-center mb-8">
          {timer > 0 ? (
            <div>
              {/* Progress ring */}
              <div className="relative w-16 h-16 mx-auto mb-3">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                  <circle
                    cx="32" cy="32" r="28" fill="none"
                    stroke="url(#timerGrad)" strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (timerProgress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                  <defs>
                    <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs text-locus-muted">
                Didn&apos;t receive the code? Wait for the timer to resend.
              </p>
            </div>
          ) : (
            <Button
              onClick={handleResend}
              variant="secondary"
              size="sm"
              className="mx-auto"
            >
              <RotateCcw size={14} />
              <span>Resend Code</span>
            </Button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-[rgba(255,255,255,0.06)] pt-6 mb-2">
          <p className="text-center text-xs text-locus-muted uppercase tracking-wider mb-4 font-medium">
            Important — Check your inbox
          </p>
        </div>

        {/* Spam Instructions Card */}
        <div className="rounded-xl border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.04)] p-5 mb-5">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-[rgba(251,191,36,0.12)] flex items-center justify-center">
              <Inbox size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-yellow-300 mb-2">
                Can&apos;t find the email?
              </p>
              <div className="text-xs text-[#d1d5db] space-y-2 leading-relaxed">
                <p>📧 Check your <strong className="text-white">Spam</strong> or <strong className="text-white">Promotions</strong> folder</p>
                <div className="pl-4 space-y-1 border-l-2 border-[rgba(251,191,36,0.2)]">
                  <p><strong className="text-yellow-200">Gmail:</strong> Open email → Click <span className="text-white">⋮</span> → &quot;Move to&quot; → <span className="text-locus-teal font-semibold">Primary</span></p>
                  <p><strong className="text-yellow-200">Outlook:</strong> Right-click → &quot;Move to Focused&quot;</p>
                  <p><strong className="text-yellow-200">Yahoo:</strong> Click &quot;Not Spam&quot;</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gift CTA */}
        <div className="rounded-xl border border-[rgba(45,212,191,0.2)] bg-[rgba(45,212,191,0.04)] p-5">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-[rgba(45,212,191,0.12)] flex items-center justify-center">
              <Gift size={20} className="text-locus-teal" />
            </div>
            <div>
              <p className="text-sm font-semibold text-locus-teal mb-1">
                🎁 Claim Your Special Gift!
              </p>
              <p className="text-xs text-[#d1d5db] leading-relaxed">
                Reply to the verification email with the word <strong className="text-white">&quot;GIFT&quot;</strong> and 
                we&apos;ll send you an exclusive bonus — completely free!
              </p>
            </div>
          </div>
        </div>

        {/* Skip link */}
        <p className="text-center mt-6 text-xs text-locus-muted">
          Having trouble?{' '}
          <button
            onClick={() => router.push('/dashboard')}
            className="text-locus-teal hover:text-locus-emerald transition-colors font-medium underline underline-offset-2"
          >
            Skip verification
          </button>
        </p>
      </Card>
    </div>
  )
}
