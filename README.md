# DocGen AI — AI-Powered Technical Documentation Generator

> **Problem Statement #8: Technical Documentation Generator** | AI Hackathon for Builders 2025

DocGen AI is an intelligent documentation generator that analyzes your source code and automatically creates professional technical documentation — with a unique emotional twist. Beyond just generating docs, it discovers your **code's personality**, giving it a soul.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![AI Powered](https://img.shields.io/badge/AI-Powered-emerald)

---

## Demo

🔗 **Live App**: [Your deployed URL here]

🎬 **Demo Video**: [Your demo video link here]

---

## Features

### 📝 Core — Documentation Generation
- **4 Documentation Styles**: Comprehensive, API Docs, README, Inline Comments
- **17+ Language Support**: JavaScript, TypeScript, Python, Java, Go, Rust, C#, C++, Ruby, PHP, Swift, Kotlin, SQL, Bash, HTML, CSS + Auto-detect
- **File Upload**: Drag & drop or upload `.py`, `.js`, `.ts`, `.java` etc.
- **Markdown Export**: One-click download as `.md` file
- **Copy to Clipboard**: Instant copy for pasting into wikis

### 🫀 Unique — Code Soul (Emotional AI)
- **Personality Analysis**: AI discovers your code's personality type (The Architect, The Minimalist, The Guardian, etc.)
- **Mood Detection**: How your code "feels" (Confident & Well-Structured, Anxious & Tangled, etc.)
- **Health Score**: Visual 0-100 score with animated ring based on code quality
- **AI Mentor Encouragement**: Warm, personalized encouraging feedback
- **Fun Facts**: Witty observations that make developers smile
- **Gentle Tips**: Actionable improvement suggestions framed with kindness

### 🎨 UX Polish
- **Confetti Celebration**: Particle animation on successful generation
- **Dark/Light Mode**: Seamless theme switching
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Animated Transitions**: Smooth framer-motion animations throughout
- **Syntax Highlighting**: Beautiful code rendering in documentation output

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16 + React 19 | UI framework with App Router |
| Styling | Tailwind CSS 4 + shadcn/ui | Beautiful, responsive design |
| Animations | Framer Motion | Smooth page transitions & reveals |
| Backend | Next.js API Routes | Server-side AI integration |
| AI Engine | z-ai-web-dev-sdk | LLM-powered documentation & personality analysis |
| Language | TypeScript | Type safety throughout |
| Markdown | react-markdown + rehype | Rich documentation rendering |
| Code Display | react-syntax-highlighter | Syntax-highlighted code blocks |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                   Browser                    │
│  ┌──────────────┐  ┌──────────────────────┐ │
│  │  Code Input   │  │  Documentation Output │ │
│  │  + Controls   │  │  + Markdown Rendering │ │
│  └──────┬───────┘  └──────────▲───────────┘ │
│         │                     │              │
│         │  Promise.allSettled │              │
│         ├─────────┬───────────┤              │
│         ▼         │           ▼              │
│  ┌─────────────┐  │  ┌────────────────────┐ │
│  │ /api/        │  │  │ /api/               │ │
│  │ generate-docs│  │  │ analyze-mood        │ │
│  └──────┬──────┘  │  └─────────┬──────────┘ │
└─────────┼─────────┼───────────┼──────────────┘
          │         │           │
          ▼         │           ▼
    ┌──────────┐    │     ┌──────────┐
    │  AI SDK   │    │     │  AI SDK   │
    │ (docs)    │    │     │ (person-  │
    │           │    │     │  ality)   │
    └──────────┘    │     └──────────┘
                    │
              ┌─────▼─────┐
              │  Code Soul │
              │  Card +    │
              │  Confetti  │
              └───────────┘
```

**Key Design Decision**: Both API calls run in **parallel** using `Promise.allSettled`, so the user gets documentation + personality analysis simultaneously without extra wait time. If one fails, the other still succeeds.

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- An AI API key (configured via environment)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/docgen-ai.git
cd docgen-ai

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your API key

# Run the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
bun run build
bun run start
```

---

## API Endpoints

### `POST /api/generate-docs`
Generates technical documentation from code.

**Request Body:**
```json
{
  "code": "your source code here",
  "language": "python",
  "docType": "comprehensive"
}
```

**Response:**
```json
{
  "documentation": "# Documentation\n\n...",
  "language": "python"
}
```

### `POST /api/analyze-mood`
Analyzes code personality and emotional characteristics.

**Request Body:**
```json
{
  "code": "your source code here",
  "language": "python"
}
```

**Response:**
```json
{
  "personality": "The Architect",
  "personalityEmoji": "🏗️",
  "mood": "Confident & Well-Structured",
  "moodEmoji": "💪",
  "healthScore": 85,
  "encouragement": "Your code shows real craftsmanship...",
  "funFact": "This code has more error handling than most space shuttles.",
  "tip": "Consider adding type hints for even stronger documentation.",
  "vibe": "Corporate"
}
```

### `POST /api/detect-language`
Auto-detects the programming language of code.

---

## Project Structure

```
docgen-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main UI — code input, docs output, Code Soul card
│   │   ├── layout.tsx            # Root layout with theme provider
│   │   ├── globals.css           # Tailwind + custom styles
│   │   └── api/
│   │       ├── generate-docs/
│   │       │   └── route.ts      # AI documentation generation endpoint
│   │       ├── analyze-mood/
│   │       │   └── route.ts      # AI personality analysis endpoint
│   │       └── detect-language/
│   │           └── route.ts      # Language auto-detection endpoint
│   ├── components/ui/            # shadcn/ui components
│   ├── hooks/                    # Custom React hooks
│   └── lib/
│       └── utils.ts              # Utility functions
├── public/                       # Static assets (logo, favicon)
├── tailwind.config.ts            # Tailwind configuration
├── next.config.ts                # Next.js configuration
└── package.json                  # Dependencies & scripts
```

---

## What Makes This Special for the Hackathon

1. **Real-World Usability**: Developers actually need this — documentation is the #1 pain point in software teams
2. **AI-Native**: Two separate AI personas (technical writer + emotional coach) working in parallel
3. **Emotional Connection**: Code Soul is a novel feature that makes documentation generation *enjoyable*
4. **Zero External Dependencies**: No database, no auth, no external services — just AI + clean code
5. **Polished UX**: Confetti, animations, dark mode, responsive — feels like a real product, not a hackathon prototype
6. **Clean Architecture**: Parallel API calls, type-safe, error-resilient

---

## Team

Built for the **AI Hackathon for Builders 2025**

- Problem Statement #8: Technical Documentation Generator

---

## License

MIT
