'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  FileCode2,
  Sparkles,
  Download,
  Copy,
  Check,
  Upload,
  Zap,
  BookOpen,
  Shield,
  Moon,
  Sun,
  X,
  Loader2,
  Code2,
  FileText,
  Braces,
  BookMarked,
  ArrowRight,
  Trash2,
  Heart,
  Brain,
  Lightbulb,
  Smile,
  TrendingUp,
  Star,
  Coffee,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from 'next-themes';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CodeSoul {
  personality: string;
  personalityEmoji: string;
  mood: string;
  moodEmoji: string;
  healthScore: number;
  encouragement: string;
  funFact: string;
  tip: string;
  vibe: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LANGUAGES = [
  { value: 'auto', label: 'Auto-detect', icon: '🔍' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'go', label: 'Go', icon: '🔵' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'csharp', label: 'C#', icon: '💜' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
  { value: 'ruby', label: 'Ruby', icon: '💎' },
  { value: 'php', label: 'PHP', icon: '🐘' },
  { value: 'swift', label: 'Swift', icon: '🍎' },
  { value: 'kotlin', label: 'Kotlin', icon: '🟣' },
  { value: 'sql', label: 'SQL', icon: '🗃️' },
  { value: 'bash', label: 'Bash', icon: '🖥️' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
];

const DOC_TYPES = [
  {
    value: 'comprehensive',
    label: 'Comprehensive',
    icon: BookOpen,
    desc: 'Full technical documentation',
  },
  {
    value: 'api',
    label: 'API Docs',
    icon: Braces,
    desc: 'API endpoint documentation',
  },
  {
    value: 'readme',
    label: 'README',
    icon: BookMarked,
    desc: 'GitHub-style README',
  },
  {
    value: 'inline',
    label: 'Inline Comments',
    icon: Code2,
    desc: 'Code with inline docs',
  },
];

const SAMPLE_CODES: Record<string, string> = {
  python: `import sqlite3
from typing import List, Optional, Dict, Any
from dataclasses import dataclass
from datetime import datetime

@dataclass
class User:
    """Represents a user in the system."""
    id: int
    username: str
    email: str
    created_at: datetime
    is_active: bool = True

class UserService:
    """Service class for managing users with SQLite backend."""

    def __init__(self, db_path: str = "users.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self._init_db()

    def _init_db(self) -> None:
        cursor = self.conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        """)
        self.conn.commit()

    def create_user(self, username: str, email: str) -> User:
        if not self._validate_email(email):
            raise ValueError(f"Invalid email format: {email}")
        try:
            cursor = self.conn.cursor()
            cursor.execute(
                "INSERT INTO users (username, email) VALUES (?, ?)",
                (username, email)
            )
            self.conn.commit()
            return self.get_user_by_username(username)
        except sqlite3.IntegrityError:
            raise ValueError(f"User with username '{username}' or email '{email}' already exists")

    def get_user_by_username(self, username: str) -> Optional[User]:
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        row = cursor.fetchone()
        if row:
            return User(id=row[0], username=row[1], email=row[2],
                       created_at=row[3], is_active=bool(row[4]))
        return None

    def get_all_active_users(self) -> List[User]:
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM users WHERE is_active = 1")
        return [User(id=r[0], username=r[1], email=r[2],
                     created_at=r[3], is_active=bool(r[4]))
                for r in cursor.fetchall()]

    def deactivate_user(self, username: str) -> bool:
        cursor = self.conn.cursor()
        cursor.execute(
            "UPDATE users SET is_active = 0 WHERE username = ? AND is_active = 1",
            (username,)
        )
        self.conn.commit()
        return cursor.rowcount > 0

    @staticmethod
    def _validate_email(email: str) -> bool:
        return "@" in email and "." in email.split("@")[-1]

    def __del__(self):
        if hasattr(self, 'conn'):
            self.conn.close()`,

  javascript: `/**
 * Task Queue Manager - Handles asynchronous task processing
 * with priority support and concurrent execution limits.
 */

class TaskQueue {
  #queue = [];
  #running = new Set();
  #maxConcurrency;
  #eventListeners = new Map();

  constructor(maxConcurrency = 3) {
    if (maxConcurrency < 1) {
      throw new Error('maxConcurrency must be at least 1');
    }
    this.#maxConcurrency = maxConcurrency;
  }

  addTask(taskFn, priority = 0, id = crypto.randomUUID()) {
    const task = {
      id,
      execute: taskFn,
      priority,
      createdAt: Date.now(),
      status: 'pending',
      retries: 0,
      maxRetries: 3,
    };

    this.#queue.push(task);
    this.#queue.sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt);

    this.#emit('taskAdded', { taskId: id, priority });
    this.#processNext();
    return id;
  }

  async #processNext() {
    if (this.#running.size >= this.#maxConcurrency) return;
    if (this.#queue.length === 0) {
      if (this.#running.size === 0) this.#emit('drain');
      return;
    }

    const task = this.#queue.shift();
    task.status = 'running';
    this.#running.add(task);

    try {
      const result = await task.execute();
      task.status = 'completed';
      this.#emit('taskCompleted', { taskId: task.id, result });
    } catch (error) {
      task.retries++;
      if (task.retries < task.maxRetries) {
        task.status = 'pending';
        this.#queue.unshift(task);
        this.#emit('taskRetrying', { taskId: task.id, attempt: task.retries, error });
      } else {
        task.status = 'failed';
        this.#emit('taskFailed', { taskId: task.id, error });
      }
    } finally {
      this.#running.delete(task);
      this.#processNext();
    }
  }

  on(event, callback) {
    if (!this.#eventListeners.has(event)) {
      this.#eventListeners.set(event, []);
    }
    this.#eventListeners.get(event).push(callback);
    return () => {
      const listeners = this.#eventListeners.get(event);
      const idx = listeners.indexOf(callback);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }

  #emit(event, data) {
    const listeners = this.#eventListeners.get(event) || [];
    listeners.forEach(cb => cb(data));
  }

  getStats() {
    return {
      pending: this.#queue.length,
      running: this.#running.size,
      maxConcurrency: this.#maxConcurrency,
      totalTasks: this.#queue.length + this.#running.size,
    };
  }

  clear() {
    this.#queue = [];
    this.#emit('queueCleared');
  }
}

module.exports = { TaskQueue };`,

  typescript: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Redis from 'ioredis';

interface AuthConfig {
  jwtSecret: string;
  tokenExpiry: string;
  refreshTokenExpiry: string;
  redisUrl: string;
}

interface TokenPayload {
  userId: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

interface AuthResult {
  isValid: boolean;
  payload?: TokenPayload;
  error?: string;
}

class AuthenticationService {
  private redis: Redis;
  private config: AuthConfig;
  private readonly BLACKLIST_PREFIX = 'auth:blacklist:';
  private readonly REFRESH_PREFIX = 'auth:refresh:';

  constructor(config: AuthConfig) {
    this.config = config;
    this.redis = new Redis(config.redisUrl);
  }

  async generateTokenPair(userId: string, email: string, roles: string[]): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload: Omit<TokenPayload, 'iat' | 'exp'> = { userId, email, roles };

    const accessToken = jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.tokenExpiry,
    });

    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      this.config.jwtSecret,
      { expiresIn: this.config.refreshTokenExpiry }
    );

    await this.redis.set(
      \`\${this.REFRESH_PREFIX}\${userId}\`,
      refreshToken,
      'EX',
      this.parseExpiry(this.config.refreshTokenExpiry)
    );

    return { accessToken, refreshToken };
  }

  async validateToken(token: string): Promise<AuthResult> {
    try {
      const isBlacklisted = await this.redis.exists(
        \`\${this.BLACKLIST_PREFIX}\${token}\`
      );
      if (isBlacklisted) {
        return { isValid: false, error: 'Token has been revoked' };
      }

      const decoded = jwt.verify(token, this.config.jwtSecret) as TokenPayload;
      return { isValid: true, payload: decoded };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { isValid: false, error: 'Token has expired' };
      }
      return { isValid: false, error: 'Invalid token' };
    }
  }

  async revokeToken(token: string): Promise<void> {
    const decoded = jwt.decode(token) as TokenPayload;
    if (!decoded?.exp) return;

    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await this.redis.set(
        \`\${this.BLACKLIST_PREFIX}\${token}\`,
        'revoked',
        'EX',
        ttl
      );
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<AuthResult & {
    accessToken?: string;
  }> {
    try {
      const decoded = jwt.verify(refreshToken, this.config.jwtSecret) as TokenPayload;
      const storedToken = await this.redis.get(
        \`\${this.REFRESH_PREFIX}\${decoded.userId}\`
      );

      if (storedToken !== refreshToken) {
        return { isValid: false, error: 'Invalid refresh token' };
      }

      const { accessToken } = await this.generateTokenPair(
        decoded.userId,
        decoded.email,
        decoded.roles
      );

      return { isValid: true, payload: decoded, accessToken };
    } catch {
      return { isValid: false, error: 'Refresh token validation failed' };
    }
  }

  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\\d+)([smhd])$/);
    if (!match) return 86400;
    const [, value, unit] = match;
    const multipliers = { s: 1, m: 60, h: 3600, d: 86400 };
    return parseInt(value) * (multipliers[unit as keyof typeof multipliers] || 1);
  }
}

export function authMiddleware(authService: AuthenticationService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const result = await authService.validateToken(token);

    if (!result.isValid) {
      return res.status(401).json({ error: result.error });
    }

    req.user = result.payload;
    next();
  };
}

export { AuthenticationService, AuthConfig, TokenPayload };`,
};

// ─── Confetti Component ──────────────────────────────────────────────────────

function ConfettiCelebration({ show }: { show: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!show || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }[] = [];

    const colors = [
      '#10b981', '#34d399', '#6ee7b7', '#14b8a6', '#2dd4bf',
      '#f59e0b', '#fbbf24', '#f97316', '#ef4444', '#8b5cf6',
      '#ec4899', '#06b6d4',
    ];

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: Math.random() * -18 - 5,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let animationId: number;
    const gravity = 0.3;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.005;

        if (p.opacity <= 0 || p.y > canvas.height + 50) return;
        aliveCount++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        // Draw different shapes
        if (p.size > 6) {
          // Star shape
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            const angle = (j * 4 * Math.PI) / 5;
            const method = j === 0 ? 'moveTo' : 'lineTo';
            ctx[method](Math.cos(angle) * p.size, Math.sin(angle) * p.size);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Rectangle
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }

        ctx.restore();
      });

      if (aliveCount > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [show]);

  if (!show) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}

// ─── Health Score Ring Component ─────────────────────────────────────────────

function HealthScoreRing({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    if (s >= 40) return '#f97316';
    return '#ef4444';
  };

  const color = getColor(score);

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-muted/50"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
          Health
        </span>
      </div>
    </div>
  );
}

// ─── Code Soul Card Component ────────────────────────────────────────────────

function CodeSoulCard({ soul }: { soul: CodeSoul }) {
  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' };
    if (score >= 70) return { label: 'Good', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' };
    if (score >= 50) return { label: 'Fair', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' };
    return { label: 'Needs Love', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30' };
  };

  const scoreInfo = getScoreLabel(soul.healthScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Card className="overflow-hidden border-2 border-emerald-200/50 dark:border-emerald-800/50 shadow-xl shadow-emerald-500/5">
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-5 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
          <div className="relative flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
              className="text-5xl"
            >
              {soul.personalityEmoji}
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest opacity-80">Code Personality</span>
                <Badge className="bg-white/20 text-white border-0 text-[10px] backdrop-blur-sm">
                  <Star className="w-2.5 h-2.5 mr-0.5" />
                  {soul.vibe}
                </Badge>
              </div>
              <h3 className="text-xl font-bold">{soul.personality}</h3>
              <p className="text-sm opacity-90 flex items-center gap-1.5">
                {soul.moodEmoji} {soul.mood}
              </p>
            </div>
            <HealthScoreRing score={soul.healthScore} />
          </div>
        </div>

        <CardContent className="p-5 space-y-4">
          {/* Encouragement */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/30 dark:border-emerald-800/30"
          >
            <div className="mt-0.5">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-1">
                Your AI Mentor Says
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {soul.encouragement}
              </p>
            </div>
          </motion.div>

          {/* Fun Fact & Tip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-3 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/30 dark:border-amber-800/30"
            >
              <Smile className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider mb-1">
                  Fun Fact
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {soul.funFact}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex gap-3 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-800/30"
            >
              <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">
                  Gentle Tip
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {soul.tip}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Health Score Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center gap-3 pt-2"
          >
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Code Health</span>
                <span className={`text-xs font-semibold ${scoreInfo.color}`}>
                  {scoreInfo.label}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: scoreInfo.color.includes('emerald') ? '#10b981' : scoreInfo.color.includes('blue') ? '#3b82f6' : scoreInfo.color.includes('amber') ? '#f59e0b' : '#ef4444' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${soul.healthScore}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Home Component ─────────────────────────────────────────────────────

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('auto');
  const [docType, setDocType] = useState('comprehensive');
  const [documentation, setDocumentation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [codeSoul, setCodeSoul] = useState<CodeSoul | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSoul, setShowSoul] = useState(false);
  const [docsGenerated, setDocsGenerated] = useState(0);
  const [displayedDoc, setDisplayedDoc] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();

  const handleGenerate = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code first');
      return;
    }

    setIsGenerating(true);
    setError('');
    setDocumentation('');
    setCodeSoul(null);
    setShowSoul(false);

    try {
      // Fire both API calls in parallel for speed
      const [docResponse, moodResponse] = await Promise.allSettled([
        fetch('/api/generate-docs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            language: language === 'auto' ? undefined : language,
            docType,
          }),
        }),
        fetch('/api/analyze-mood', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            language: language === 'auto' ? undefined : language,
          }),
        }),
      ]);

      // Handle documentation
      if (docResponse.status === 'fulfilled' && docResponse.value.ok) {
        const data = await docResponse.value.json();
        setDocumentation(data.documentation);
      } else {
        const errorMsg = docResponse.status === 'fulfilled'
          ? (await docResponse.value.json())?.error || 'Failed to generate documentation'
          : 'Documentation generation failed';
        throw new Error(errorMsg);
      }

      // Handle mood analysis (non-blocking — don't fail if this errors)
      if (moodResponse.status === 'fulfilled' && moodResponse.value.ok) {
        const moodData = await moodResponse.value.json();
        setCodeSoul(moodData);
      }

      setActiveTab('output');

      // Trigger celebration
      setShowConfetti(true);
      setDocsGenerated((prev) => prev + 1);
      setTimeout(() => setShowConfetti(false), 4000);

      // Show soul card with a dramatic delay
      setTimeout(() => setShowSoul(true), 800);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  }, [code, language, docType]);
    // Typing animation effect
  useEffect(() => {
    if (!documentation) {
      setDisplayedDoc('');
      return;
    }
    let i = 0;
    setDisplayedDoc('');
    const interval = setInterval(() => {
      if (i < documentation.length) {
        setDisplayedDoc(documentation.slice(0, i + 4));
        i += 4;
      } else {
        setDisplayedDoc(documentation);
        clearInterval(interval);
      }
    }, 8);
    return () => clearInterval(interval);
  }, [documentation]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);

        const ext = file.name.split('.').pop()?.toLowerCase();
        const extToLang: Record<string, string> = {
          js: 'javascript',
          jsx: 'javascript',
          ts: 'typescript',
          tsx: 'typescript',
          py: 'python',
          java: 'java',
          go: 'go',
          rs: 'rust',
          cs: 'csharp',
          cpp: 'cpp',
          cc: 'cpp',
          rb: 'ruby',
          php: 'php',
          swift: 'swift',
          kt: 'kotlin',
          sql: 'sql',
          sh: 'bash',
          html: 'html',
          css: 'css',
        };
        if (ext && extToLang[ext]) {
          setLanguage(extToLang[ext]);
        }
      };
      reader.readAsText(file);
    },
    []
  );

  const loadSampleCode = useCallback((lang: string) => {
    const sample = SAMPLE_CODES[lang];
    if (sample) {
      setCode(sample);
      setLanguage(lang);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(documentation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = documentation;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [documentation]);

  const handleDownload = useCallback(() => {
    const ext = 'md';
    const filename = docType === 'readme' ? 'README.md' : `documentation.${ext}`;
    const blob = new Blob([documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [documentation, docType]);

  const handleClear = useCallback(() => {
    setCode('');
    setDocumentation('');
    setError('');
    setCodeSoul(null);
    setShowSoul(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
      {/* Confetti */}
      <ConfettiCelebration show={showConfetti} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <FileCode2 className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                DocGen <span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5 hidden sm:block">
                AI-Powered Documentation Generator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {docsGenerated > 0 && (
              <Badge variant="secondary" className="hidden sm:flex gap-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-0">
                <Coffee className="w-3 h-3" />
                {docsGenerated} doc{docsGenerated > 1 ? 's' : ''} generated
              </Badge>
            )}
            <Badge variant="secondary" className="hidden sm:flex gap-1 text-xs">
              <Sparkles className="w-3 h-3" />
              Powered by AI
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Only show when no docs generated */}
      {!documentation && !isGenerating && !code && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full px-4 py-1.5 text-sm font-medium mb-6"
          >
            <Zap className="w-3.5 h-3.5" />
            2-Day Hackathon Project
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Stop Writing Docs.
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Start Generating Them.
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Paste your code, pick a documentation style, and let AI create professional
            technical docs in seconds. Your code has a personality — discover it.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {[
              {
                icon: BookOpen,
                title: '4 Doc Styles',
                desc: 'Comprehensive, API, README, Inline',
              },
              {
                icon: Shield,
                title: '17+ Languages',
                desc: 'Auto-detect or choose manually',
              },
              {
                icon: Heart,
                title: 'Code Soul',
                desc: 'Discover your code\'s personality',
                highlight: true,
              },
              {
                icon: Download,
                title: 'Export Ready',
                desc: 'Download as Markdown instantly',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
              >
                <Card className={`bg-background/60 border-border/50 backdrop-blur-sm ${'highlight' in feature ? 'border-emerald-300/50 dark:border-emerald-700/50 shadow-md shadow-emerald-500/10' : ''}`}>
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <feature.icon className={`w-5 h-5 ${'highlight' in feature ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    {'highlight' in feature && (
                      <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[9px] border-0">NEW</Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Sample code buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Try a sample:</span>
            {Object.keys(SAMPLE_CODES).map((lang) => (
              <Button
                key={lang}
                variant="outline"
                size="sm"
                onClick={() => loadSampleCode(lang)}
                className="text-xs capitalize"
              >
                {lang === 'typescript' ? 'TypeScript' : lang === 'javascript' ? 'JavaScript' : 'Python'}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            ))}
          </div>
        </motion.section>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
        {/* Mobile tabs */}
        <div className="sm:hidden mb-4">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === 'input'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 inline mr-1.5" />
              Input
            </button>
            <button
              onClick={() => setActiveTab('output')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                activeTab === 'output'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1.5" />
              Output
              {documentation && (
                <span className="ml-1.5 w-2 h-2 bg-emerald-500 rounded-full inline-block" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-full">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex flex-col gap-3 ${activeTab !== 'input' ? 'hidden sm:flex' : 'flex'}`}
          >
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[160px] h-9 text-xs">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="text-xs">
                      <span className="mr-1.5">{lang.icon}</span>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={docType} onValueChange={setDocType}>
                <SelectTrigger className="w-[170px] h-9 text-xs">
                  <SelectValue placeholder="Doc type" />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((dt) => (
                    <SelectItem key={dt.value} value={dt.value} className="text-xs">
                      <dt.icon className="w-3.5 h-3.5 inline mr-1.5" />
                      {dt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <input
                ref={fileInputRef}
                type="file"
                accept=".js,.jsx,.ts,.tsx,.py,.java,.go,.rs,.cs,.cpp,.cc,.rb,.php,.swift,.kt,.sql,.sh,.html,.css,.txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 text-xs"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload
              </Button>

              {code && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-9 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Code Input Area */}
            <div className="relative flex-1">
              <div className="absolute top-0 left-0 right-0 h-8 bg-muted/50 rounded-t-lg border border-border/50 flex items-center px-3 gap-1.5 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="ml-2 text-[10px] text-muted-foreground font-mono">
                  {code ? `${code.split('\n').length} lines` : 'Paste your code here...'}
                </span>
                {code && (
                  <span className="ml-auto text-[10px] text-emerald-600 dark:text-emerald-400">
                    Ready to generate
                  </span>
                )}
              </div>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// Paste your code here...\n// Or upload a file\n// Or try one of the sample codes\n\nfunction hello() {\n  console.log("Hello, World!");\n}`}
                className="h-full min-h-[350px] sm:min-h-[500px] pt-10 font-mono text-sm bg-muted/30 border-border/50 resize-none focus-visible:ring-emerald-500/30"
                spellCheck={false}
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !code.trim()}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Discovering Your Code&apos;s Soul...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Documentation
                </>
              )}
            </Button>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`flex flex-col gap-3 ${
              activeTab !== 'output' ? 'hidden sm:flex' : 'flex'
            }`}
          >
            {/* Output Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Generated Documentation</h3>
                {documentation && (
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-[10px]">
                    <Check className="w-2.5 h-2.5 mr-0.5" />
                    Ready
                  </Badge>
                )}
              </div>
              {documentation && (
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 text-xs"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 mr-1" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="h-8 text-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </div>

            {/* Documentation Output */}
            <div className="flex-1 min-h-[350px] sm:min-h-[500px] rounded-lg border border-border/50 bg-muted/30 overflow-y-auto">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 p-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-200 dark:border-emerald-800 animate-pulse" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">Analyzing your code&apos;s soul...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      AI is reading your code, feeling its vibes, and crafting documentation
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-emerald-500"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground/60 italic">
                    &quot;Every line of code has a story to tell...&quot;
                  </div>
                </div>
              ) : documentation ? (
                <div className="p-4 sm:p-6">
                  <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-border/50">
                    <ReactMarkdown
                      components={{
                        code({ className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !match;
                          return isInline ? (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          ) : (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              className="!rounded-lg !text-xs"
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          );
                        },
                      }}
                    >
                      {displayedDoc}
                    </ReactMarkdown>
                  </article>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-muted/80 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">
                      Your code&apos;s soul awaits
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1 max-w-xs">
                      Paste your code, click Generate, and watch AI create docs AND discover your code&apos;s personality.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Code Soul Card - Appears below the main grid after generation */}
        <AnimatePresence>
          {showSoul && codeSoul && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <h3 className="text-lg font-bold">Your Code&apos;s Soul</h3>
                <span className="text-sm text-muted-foreground">— discovered by AI</span>
              </div>
              <CodeSoulCard soul={codeSoul} />
              {code && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4"
                >
                  <Card className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-semibold">Code Metrics</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Lines', value: code.split('\n').length, color: 'text-blue-600 dark:text-blue-400' },
                          { label: 'Functions', value: (code.match(/function\s+\w+|def\s+\w+|const\s+\w+\s*=\s*(\(|async)|async\s+\w+\s*\(/g) || []).length, color: 'text-emerald-600 dark:text-emerald-400' },
                          { label: 'Classes', value: (code.match(/class\s+\w+/g) || []).length, color: 'text-purple-600 dark:text-purple-400' },
                        ].map((m) => (
                          <div key={m.label} className="text-center p-2 rounded-lg bg-muted/50">
                            <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm"
          >
            <span>{error}</span>
            <button onClick={() => setError('')}>
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/60 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs text-muted-foreground">
          <p>
            DocGen AI — Built for Hackathon 2025
          </p>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Problem Statement #8</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
              AI + DevTools + Soul
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
