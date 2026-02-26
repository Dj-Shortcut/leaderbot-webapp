import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  MessageCircle,
  Camera,
  Palette,
  Download,
  ChevronRight,
  Star,
  Zap,
  Shield,
} from "lucide-react";

// ─── Style data ───────────────────────────────────────────────────────────────

const STYLES = [
  {
    id: "caricature",
    name: "Caricature",
    emoji: "🎨",
    description: "Playful exaggerated portrait with artistic flair",
    gradient: "from-orange-500/20 to-yellow-500/20",
    border: "border-orange-500/30",
    accent: "text-orange-400",
    badge: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    demo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "petals",
    name: "Petals",
    emoji: "🌸",
    description: "Soft floral aesthetic with delicate petal overlays",
    gradient: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
    accent: "text-pink-400",
    badge: "bg-pink-500/10 text-pink-300 border-pink-500/20",
    demo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "gold",
    name: "Gold",
    emoji: "✨",
    description: "Luxurious golden tones with metallic shimmer",
    gradient: "from-yellow-500/20 to-amber-500/20",
    border: "border-yellow-500/30",
    accent: "text-yellow-400",
    badge: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    demo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    emoji: "🎬",
    description: "Movie-grade color grading with dramatic depth",
    gradient: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30",
    accent: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    demo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "disco",
    name: "Disco Glow",
    emoji: "🪩",
    description: "Vibrant neon lights with retro disco energy",
    gradient: "from-purple-500/20 to-fuchsia-500/20",
    border: "border-purple-500/30",
    accent: "text-purple-400",
    badge: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    demo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&q=80",
  },
  {
    id: "clouds",
    name: "Clouds",
    emoji: "☁️",
    description: "Dreamy ethereal atmosphere with soft cloud textures",
    gradient: "from-sky-500/20 to-cyan-500/20",
    border: "border-sky-500/30",
    accent: "text-sky-400",
    badge: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    demo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&q=80",
  },
];

const STEPS = [
  {
    number: "01",
    icon: <Camera className="w-6 h-6" />,
    title: "Send Your Photo",
    description: "Open Facebook Messenger and send any photo to the Leaderbot AI page.",
  },
  {
    number: "02",
    icon: <Palette className="w-6 h-6" />,
    title: "Choose a Style",
    description: "Pick from 6 stunning AI transformation styles — from Caricature to Disco Glow.",
  },
  {
    number: "03",
    icon: <Download className="w-6 h-6" />,
    title: "Get Your Art",
    description: "Receive your AI-transformed image within seconds, ready to share.",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function Navbar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ background: "oklch(10% 0.01 260 / 0.85)", backdropFilter: "blur(20px)" }}>
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))" }}>
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <span className="font-semibold text-foreground tracking-tight">Leaderbot AI</span>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated && user?.role === "admin" && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Button>
            </Link>
          )}
          {isAuthenticated ? (
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
          ) : (
            <a href={getLoginUrl()}>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Sign in
              </Button>
            </a>
          )}
          <a href="https://m.me/61587343141159" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-2 font-medium"
              style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))", color: "oklch(12% 0.02 80)" }}>
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Try on Messenger</span>
              <span className="sm:hidden">Try Now</span>
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(oklch(30% 0.02 260) 1px, transparent 1px), linear-gradient(90deg, oklch(30% 0.02 260) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "oklch(78% 0.14 80)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl"
        style={{ background: "oklch(65% 0.18 300)" }} />

      <div className="container relative z-10 text-center py-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 mb-8"
          style={{ background: "oklch(78% 0.14 80 / 0.08)" }}>
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">Powered by GPT Image AI</span>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Transform Your Photos
          <br />
          <span style={{
            background: "linear-gradient(135deg, oklch(85% 0.16 80), oklch(70% 0.18 60))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Into AI Masterpieces
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          AI image transformations inside Messenger.
          Simple. Instant. Fun. — powered by GPT Image AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a href="https://m.me/61587343141159" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-3 px-8 py-6 text-base font-semibold shadow-lg"
              style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))", color: "oklch(12% 0.02 80)" }}>
              <MessageCircle className="w-5 h-5" />
              Start on Messenger
              <ChevronRight className="w-4 h-4" />
            </Button>
          </a>
          <a href="#styles">
            <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-base border-white/10 hover:border-primary/40 hover:bg-primary/5">
              <Palette className="w-5 h-5" />
              Explore Styles
            </Button>
          </a>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          {[
            { icon: <Zap className="w-4 h-4 text-primary" />, label: "Results in seconds" },
            { icon: <Star className="w-4 h-4 text-primary" />, label: "6 unique styles" },
            { icon: <Shield className="w-4 h-4 text-primary" />, label: "Free to try" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
            How It Works
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">Three Simple Steps</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            No app downloads, no sign-ups. Just open Messenger and start creating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {STEPS.map((step, i) => (
            <div key={i} className="relative text-center group">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px"
                  style={{ background: "linear-gradient(90deg, oklch(78% 0.14 80 / 0.4), transparent)" }} />
              )}
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors"
                  style={{ background: "oklch(78% 0.14 80 / 0.08)" }}>
                  <div className="text-primary">{step.icon}</div>
                </div>
                <div className="text-xs font-mono text-primary/60 mb-2 tracking-widest">{step.number}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StyleShowcaseSection() {
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null);

  return (
    <section id="styles" className="py-24 border-t border-white/5">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5">
            AI Styles
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">Six Signature Transformations</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Each style is crafted with a unique AI prompt to deliver a distinct artistic vision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STYLES.map((style) => (
            <div
              key={style.id}
              className={`group relative rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 ${style.border} hover:scale-[1.02]`}
              style={{ background: `linear-gradient(135deg, oklch(14% 0.015 260), oklch(14% 0.015 260))` }}
              onMouseEnter={() => setHoveredStyle(style.id)}
              onMouseLeave={() => setHoveredStyle(null)}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={style.demo}
                  alt={`${style.name} style example`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient} opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                {/* Emoji badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${style.badge}`}>
                    {style.emoji} {style.name}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className={`text-lg font-semibold mb-1 ${style.accent}`}>{style.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{style.description}</p>
              </div>

              {/* Hover glow */}
              {hoveredStyle === style.id && (
                <div className={`absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br ${style.gradient} opacity-20`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="container">
        <div className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{ background: "oklch(14% 0.015 260)", border: "1px solid oklch(78% 0.14 80 / 0.2)" }}>
          {/* Background glow */}
          <div className="absolute inset-0 opacity-10"
            style={{ background: "radial-gradient(ellipse at center, oklch(78% 0.14 80), transparent 70%)" }} />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))" }}>
              <MessageCircle className="w-8 h-8 text-black" />
            </div>

            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Photos?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          It's completely free to start. Send a photo to Leaderbot on Facebook Messenger
          and receive your AI-transformed image in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <a href="https://m.me/61587343141159" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-3 px-10 py-6 text-base font-semibold"
                  style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))", color: "oklch(12% 0.02 80)" }}>
                  <MessageCircle className="w-5 h-5" />
                  Open Messenger
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-left">
              {[
                { step: "1", text: "Find Leaderbot on Facebook Messenger (ID: 61587343141159)" },
                { step: "2", text: "Send any photo you'd like to transform" },
                { step: "3", text: "Choose a style and receive your AI artwork" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: "oklch(18% 0.015 260)", border: "1px solid oklch(25% 0.02 260)" }}>
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                    style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))" }}>
                    {item.step}
                  </span>
                  <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, oklch(78% 0.14 80), oklch(65% 0.18 60))" }}>
            <Sparkles className="w-3 h-3 text-black" />
          </div>
          <span className="text-sm font-medium text-foreground">Leaderbot AI</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Leaderbot. AI image transformations inside Messenger.
        </p>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a href="https://m.me/61587343141159" target="_blank" rel="noopener noreferrer"
            className="hover:text-primary transition-colors">
              Messenger
          </a>
          <span>·</span>
          <a href="https://www.facebook.com/profile.php?id=61587343141159" target="_blank" rel="noopener noreferrer"
            className="hover:text-primary transition-colors">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <StyleShowcaseSection />
      <CTASection />
      <Footer />
    </div>
  );
}
