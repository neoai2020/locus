'use client'

import { useState } from 'react'
import { 
  GraduationCap, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen,
  Rocket,
  Target,
  Zap,
  ArrowRight,
  Lock
} from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const trainingModules = [
  {
    id: 'getting-started',
    title: 'Getting Started with Burst',
    description: 'Learn the basics of generating authority content',
    duration: '5 min',
    lessons: [
      { id: '1', title: 'Welcome to Burst', duration: '1:30', completed: true },
      { id: '2', title: 'Creating Your First Article', duration: '2:00', completed: true },
      { id: '3', title: 'Understanding Platforms', duration: '1:30', completed: false },
    ],
    icon: Rocket,
    gradient: 'from-[var(--color-burst-purple)] to-[var(--color-burst-indigo)]',
    progress: 66,
  },
  {
    id: 'content-strategy',
    title: 'Content Strategy Mastery',
    description: 'Build a content system that drives results',
    duration: '15 min',
    lessons: [
      { id: '1', title: 'Choosing Your Niche', duration: '3:00', completed: false },
      { id: '2', title: 'Content Pillars Framework', duration: '4:00', completed: false },
      { id: '3', title: 'Publishing Schedule', duration: '3:00', completed: false },
      { id: '4', title: 'Repurposing Content', duration: '5:00', completed: false },
    ],
    icon: Target,
    gradient: 'from-[var(--color-burst-cyan)] to-[var(--color-burst-blue)]',
    progress: 0,
  },
  {
    id: 'platform-mastery',
    title: 'Platform Mastery',
    description: 'Optimize for LinkedIn, Medium, and Substack',
    duration: '20 min',
    lessons: [
      { id: '1', title: 'LinkedIn Algorithm Secrets', duration: '5:00', completed: false },
      { id: '2', title: 'Medium SEO Tactics', duration: '5:00', completed: false },
      { id: '3', title: 'Substack Growth Hacks', duration: '5:00', completed: false },
      { id: '4', title: 'Cross-Platform Strategy', duration: '5:00', completed: false },
    ],
    icon: BookOpen,
    gradient: 'from-[var(--color-burst-pink)] to-[var(--color-burst-purple)]',
    progress: 0,
  },
  {
    id: 'advanced-tactics',
    title: 'Advanced Tactics',
    description: 'Scale your authority with proven systems',
    duration: '25 min',
    lessons: [
      { id: '1', title: 'Hook Writing Masterclass', duration: '6:00', completed: false },
      { id: '2', title: 'Viral Content Formulas', duration: '7:00', completed: false },
      { id: '3', title: 'Building Your Audience', duration: '6:00', completed: false },
      { id: '4', title: 'Monetization Strategies', duration: '6:00', completed: false },
    ],
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-500',
    progress: 0,
    locked: true,
  },
]

export default function TrainingPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const activeModule = trainingModules.find(m => m.id === selectedModule)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--color-burst-purple)] to-[var(--color-burst-cyan)] flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          <Badge variant="purple">Training Center</Badge>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Master Authority Building
        </h1>
        <p className="text-[var(--color-burst-muted)]">
          Learn how to create content that establishes you as a thought leader
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8 animate-fade-in stagger-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Your Progress</h2>
          <Badge variant="cyan">2 of 12 lessons completed</Badge>
        </div>
        <div className="w-full bg-[var(--color-burst-border)] rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-[var(--color-burst-purple)] to-[var(--color-burst-cyan)] h-3 rounded-full transition-all duration-500"
            style={{ width: '17%' }}
          />
        </div>
        <p className="text-sm text-[var(--color-burst-muted)] mt-2">
          17% complete • Keep going, you're doing great!
        </p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Modules List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Training Modules</h2>
          {trainingModules.map((module, index) => (
            <Card
              key={module.id}
              className={`
                animate-fade-in cursor-pointer relative overflow-hidden
                ${selectedModule === module.id ? 'border-[var(--color-burst-purple)] ring-2 ring-[rgba(139,92,246,0.2)]' : ''}
                ${module.locked ? 'opacity-60' : ''}
              `}
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              onClick={() => !module.locked && setSelectedModule(module.id)}
            >
              {module.locked && (
                <div className="absolute inset-0 bg-[var(--color-burst-dark)] bg-opacity-60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <Badge variant="warning">
                    <Lock size={12} className="mr-1" />
                    Premium
                  </Badge>
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${module.gradient} flex items-center justify-center flex-shrink-0`}>
                  <module.icon size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1 text-sm">{module.title}</h3>
                  <p className="text-xs text-[var(--color-burst-muted)] mb-2">{module.description}</p>
                  <div className="flex items-center gap-3 text-xs text-[var(--color-burst-muted)]">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {module.duration}
                    </span>
                    <span>{module.lessons.length} lessons</span>
                  </div>
                  {module.progress > 0 && (
                    <div className="mt-2 w-full bg-[var(--color-burst-border)] rounded-full h-1.5">
                      <div 
                        className={`bg-gradient-to-r ${module.gradient} h-1.5 rounded-full`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Video Player & Lessons */}
        <div className="lg:col-span-2">
          {activeModule ? (
            <div className="space-y-6 animate-fade-in">
              {/* Video Player */}
              <Card className="p-0 overflow-hidden">
                <div className="aspect-video bg-[var(--color-burst-darker)] flex items-center justify-center relative">
                  {playingVideo ? (
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-[var(--color-burst-purple)] flex items-center justify-center mb-4 mx-auto animate-pulse">
                        <Play size={32} className="text-white ml-1" />
                      </div>
                      <p className="text-white">Video playing...</p>
                      <p className="text-sm text-[var(--color-burst-muted)]">
                        {activeModule.lessons.find(l => l.id === playingVideo)?.title}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${activeModule.gradient} flex items-center justify-center mb-4 mx-auto`}>
                        <activeModule.icon size={40} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{activeModule.title}</h3>
                      <p className="text-[var(--color-burst-muted)]">Select a lesson to start learning</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Lessons List */}
              <Card>
                <h3 className="font-semibold text-white mb-4">Lessons</h3>
                <div className="space-y-2">
                  {activeModule.lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => setPlayingVideo(lesson.id)}
                      className={`
                        w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left
                        ${playingVideo === lesson.id 
                          ? 'bg-[rgba(139,92,246,0.15)] border border-[var(--color-burst-purple)]' 
                          : 'bg-[rgba(255,255,255,0.02)] border border-[var(--color-burst-border)] hover:border-[var(--color-burst-purple)]'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${lesson.completed 
                          ? 'bg-[var(--color-burst-success)]' 
                          : playingVideo === lesson.id
                            ? 'bg-[var(--color-burst-purple)]'
                            : 'bg-[var(--color-burst-border)]'
                        }
                      `}>
                        {lesson.completed ? (
                          <CheckCircle size={20} className="text-white" />
                        ) : (
                          <span className="text-white font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${playingVideo === lesson.id ? 'text-white' : 'text-[var(--color-burst-text)]'}`}>
                          {lesson.title}
                        </h4>
                        <p className="text-sm text-[var(--color-burst-muted)]">{lesson.duration}</p>
                      </div>
                      {playingVideo === lesson.id && (
                        <div className="w-8 h-8 rounded-full bg-[var(--color-burst-purple)] flex items-center justify-center">
                          <Play size={14} className="text-white ml-0.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center text-center py-20 animate-fade-in">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-burst-border)] flex items-center justify-center mx-auto mb-4">
                  <GraduationCap size={32} className="text-[var(--color-burst-muted)]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Select a Module</h3>
                <p className="text-[var(--color-burst-muted)] mb-6">
                  Choose a training module from the left to start learning
                </p>
                <Button onClick={() => setSelectedModule('getting-started')}>
                  <span>Start with Basics</span>
                  <ArrowRight size={18} />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
