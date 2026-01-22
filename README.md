# Burst - AI Authority Content Platform

Burst is a premium AI-powered content generation platform designed to help professionals build authority on high-trust platforms like LinkedIn, Medium, and Substack.

![Burst Screenshot](https://via.placeholder.com/1200x600/0a0a0f/8b5cf6?text=Burst+AI+Platform)

## ✨ Features

### Core Features
- **AI Article Generation** - Generate publication-ready articles using ChatGPT API
- **Multi-Platform Optimization** - Content tailored for LinkedIn, Medium, Substack
- **Multiple Tone Styles** - Authoritative, Conversational, Bold
- **Image Enhancement** - AI-suggested images to increase engagement
- **Content Library** - Save, manage, and reuse your articles

### Premium Upsells
- **10X Mode** - Generate 10 article variations with different hooks
- **Infinite Mode** - Remove all generation limits
- **Automation** - Templates and presets for faster creation
- **Done-For-You** - Pre-written content packs by niche

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/burst.git
cd burst
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

4. Set up Supabase:
   - Create a new Supabase project
   - Enable Email Auth in Authentication settings
   - Run the following SQL in the SQL editor:

```sql
-- Users profile extension (optional)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  upsells_unlocked text[] default '{}',
  articles_generated int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Auth pages (login, signup, forgot-password)
│   ├── (dashboard)/         # Dashboard pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── create/          # Article generator
│   │   ├── images/          # Image enhancement
│   │   ├── publish/         # Publish & distribute
│   │   ├── saved/           # Saved articles
│   │   ├── unlock/[type]/   # Upsell unlock pages
│   │   └── upsell/          # Upsell content pages
│   ├── api/
│   │   └── generate/        # Article generation API
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── layout/              # Layout components
│   └── ui/                  # UI components
├── lib/
│   └── supabase/            # Supabase client configuration
├── store/                   # Zustand state management
└── types/                   # TypeScript types
```

## 🎨 Design System

Burst uses a custom dark-mode-first design system with:
- **Primary Colors**: Purple (#8b5cf6) to Cyan (#06b6d4) gradients
- **Background**: Deep blacks and charcoal (#0a0a0f, #0f0f18)
- **Typography**: Clash Display (headings), Satoshi (body)
- **Animations**: Smooth fade-ins, glow effects, and hover states

## 🔐 Authentication

Burst uses Supabase Auth with:
- Email/Password authentication
- Session persistence across refreshes
- Protected route middleware
- Automatic redirects based on auth state

## 📝 Content Generation

The article generator uses OpenAI's GPT-4 to create:
- **Hook**: Attention-grabbing opening
- **Body**: Structured content with formatting
- **CTA**: Call-to-action section

Content is optimized for each platform's specific requirements and best practices.

## ⚠️ Important Notes

- **No Auto-Posting**: Burst is designed for manual posting only to keep accounts safe
- **Platform Compliant**: All generated content is meant to be reviewed and edited before publishing
- **API Key Required**: You need your own OpenAI API key for article generation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **State Management**: Zustand
- **Icons**: Lucide React
- **Animations**: Framer Motion (available but not required)

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

Built with ⚡ by the Burst team
