import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BookOpen, Wand2, Infinity, Brain, Zap, Star, Users, Globe, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { BookPreview } from "@/components/BookPreview";
import { useEffect, useRef } from "react";

interface MagicalParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
}

interface FloatingSymbol {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  opacity: number;
  symbol: string;
  color: string;
}

const Landing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<MagicalParticle[]>([]);
  const symbolsRef = useRef<FloatingSymbol[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize magical particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 15; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() * 60 + 260, // Purple to pink range
          life: Math.random() * 200 + 100
        });
      }
    };

    // Initialize floating symbols
    const initSymbols = () => {
      const symbols = ['✨', '🌟', '⭐', '💫', '🔮', '🌙', '☄️', '🌠'];
      const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];
      
      symbolsRef.current = [];
      for (let i = 0; i < 8; i++) {
        symbolsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          scale: Math.random() * 0.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.1,
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    initParticles();
    initSymbols();

    // Animation loop using requestAnimationFrame
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Create glowing effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Regenerate particle if life ended
        if (particle.life <= 0) {
          particlesRef.current[index] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.2,
            hue: Math.random() * 60 + 260,
            life: Math.random() * 200 + 100
          };
        }
      });

      // Update and draw floating symbols
      symbolsRef.current.forEach((symbol) => {
        // Update position and rotation
        symbol.x += symbol.vx;
        symbol.y += symbol.vy;
        symbol.rotation += symbol.rotationSpeed;

        // Gentle floating motion
        symbol.vy += Math.sin(timestamp * 0.001 + symbol.x * 0.01) * 0.002;
        symbol.vx += Math.cos(timestamp * 0.0008 + symbol.y * 0.01) * 0.002;

        // Apply gentle friction
        symbol.vx *= 0.99;
        symbol.vy *= 0.99;

        // Wrap around screen
        if (symbol.x < -50) symbol.x = canvas.width + 50;
        if (symbol.x > canvas.width + 50) symbol.x = -50;
        if (symbol.y < -50) symbol.y = canvas.height + 50;
        if (symbol.y > canvas.height + 50) symbol.y = -50;

        // Draw symbol
        ctx.save();
        ctx.translate(symbol.x, symbol.y);
        ctx.rotate(symbol.rotation);
        ctx.scale(symbol.scale, symbol.scale);
        ctx.globalAlpha = symbol.opacity;
        ctx.font = '32px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Create glow effect for symbols
        ctx.shadowColor = symbol.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = symbol.color;
        ctx.fillText(symbol.symbol, 0, 0);
        
        ctx.restore();
      });

      // Create magical aurora effect
      const auroraGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const auroraOffset = Math.sin(timestamp * 0.0005) * 0.3;
      auroraGradient.addColorStop(0, `hsla(280, 70%, 50%, ${0.03 + auroraOffset * 0.02})`);
      auroraGradient.addColorStop(0.5, `hsla(320, 70%, 50%, ${0.02 + auroraOffset * 0.01})`);
      auroraGradient.addColorStop(1, `hsla(260, 70%, 50%, ${0.03 + auroraOffset * 0.02})`);
      
      ctx.fillStyle = auroraGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden relative">
      {/* Magical Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Static background orbs for depth */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #8b5cf6, transparent)',
            animation: 'pulse 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #ec4899, transparent)',
            animation: 'pulse 10s ease-in-out infinite reverse'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        @keyframes gentle-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.5); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .bg-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 z-10">
        <div className="relative max-w-6xl mx-auto text-center space-y-12">
          {/* Magical floating book icon */}
          <div className="relative mx-auto w-32 h-32 mb-12 group">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl blur-xl opacity-50"
              style={{ animation: 'gentle-glow 6s ease-in-out infinite' }}
            />
            <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 shadow-2xl backdrop-blur-sm border border-purple-300/20 group-hover:scale-110 transition-transform duration-500">
              <BookOpen className="w-20 h-20 text-white" />
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-yellow-900" />
              </div>
            </div>
          </div>

          {/* Main heading */}
          <div className="space-y-6">
            <div className="inline-block px-8 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-sm font-medium text-purple-200 bg-shimmer">
              ✨ The Future of Storytelling is Here ✨
            </div>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Spelltale
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text">
              Where <span className="font-bold">AI Dreams</span> Meet <span className="font-bold">Infinite Stories</span>
            </h2>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Experience the world's first <span className="text-purple-400 font-semibold">living book</span> that writes itself. 
            Powered by cutting-edge AI, every page adapts to you, every story is unique, 
            and every adventure is <span className="text-pink-400 font-semibold">limitless</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12">
            <Button 
              asChild 
              size="lg" 
              className="relative group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-lg px-12 py-6 h-auto rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{ animation: 'gentle-glow 8s ease-in-out infinite' }}
            >
              <Link to="/read" className="flex items-center gap-3 relative z-10">
                <Rocket className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Start Your Journey</span>
                <Sparkles className="w-6 h-6 relative z-10" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-12 py-6 h-auto rounded-2xl bg-white/5 backdrop-blur-xl border-white/20 hover:bg-white/10 text-white hover:text-white transition-all duration-300 hover:scale-105">
              <a href="#magic" className="flex items-center gap-3">
                <Wand2 className="w-6 h-6" />
                Discover the Magic
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 max-w-4xl mx-auto">
            {[
              { symbol: '∞', label: 'Infinite Stories', color: 'text-purple-400' },
              { symbol: 'AI', label: 'Powered Intelligence', color: 'text-pink-400' },
              { symbol: '0s', label: 'Setup Time', color: 'text-blue-400' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-purple-300/50 transition-all duration-300 hover:scale-105">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.symbol}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="magic" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-8 py-3 bg-purple-500/20 backdrop-blur-xl rounded-full border border-purple-300/30 text-sm font-medium text-purple-200 mb-6 bg-shimmer">
              🚀 Next-Generation Technology 🚀
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              The Magic Behind the Story
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience storytelling reimagined through advanced AI that creates, adapts, and evolves with you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "Neural Storytelling", color: "purple", desc: "Advanced neural networks craft compelling narratives that learn from your preferences, creating deeply personalized story experiences that evolve with every page." },
              { icon: Globe, title: "Living Worlds", color: "blue", desc: "Immerse yourself in worlds that breathe and grow. Characters develop relationships, mysteries unfold naturally, and every choice ripples through an ever-expanding universe." },
              { icon: Zap, title: "Instant Generation", color: "pink", desc: "Experience seamless storytelling with real-time page generation. The next chapter materializes as you read, ensuring your adventure never has to pause." }
            ].map((item, i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-purple-400/50 transition-all duration-300 group hover:scale-105 relative overflow-hidden">
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className={`mx-auto w-20 h-20 bg-gradient-to-br from-${item.color}-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300`}>
                    <item.icon className={`w-10 h-10 text-${item.color}-400`} />
                  </div>
                  <CardTitle className={`text-${item.color}-400 text-2xl font-bold`}>{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center relative z-10">
                  <p className="text-gray-300 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Features That Amaze
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Infinity, title: "Endless Stories", color: "purple", desc: "Never run out of content. Your story continues infinitely, with new adventures generating as you explore." },
              { icon: Users, title: "Personal Experience", color: "blue", desc: "Every story is uniquely yours. The AI learns your preferences and crafts narratives tailored just for you." },
              { icon: Sparkles, title: "Instant Magic", color: "pink", desc: "No downloads, no sign-ups, no waiting. Click and enter a world of infinite storytelling immediately." },
              { icon: Star, title: "Premium Quality", color: "yellow", desc: "Experience beautifully crafted prose with rich character development and immersive world-building." }
            ].map((feature, i) => (
              <Card key={i} className={`bg-gradient-to-br from-${feature.color}-500/10 to-pink-500/10 backdrop-blur-md border-${feature.color}-300/20 hover:border-${feature.color}-400/50 transition-all duration-300 hover:scale-105`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-3 text-${feature.color}-400`}>
                    <feature.icon className="h-6 w-6" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-300">
                  {feature.desc}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              Watch Your Story Come Alive
            </h2>
            <p className="text-xl text-gray-300">
              See the magic happen as words materialize before your eyes
            </p>
          </div>

          <div className="relative">
            <Card className="relative bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden rounded-3xl hover:scale-105 transition-transform duration-500">
              <CardContent className="p-12">
                <BookPreview />
                <div className="text-center mt-12">
                  <p className="text-gray-300 mb-8 text-lg">
                    This is just the beginning. Your unique story is waiting to unfold.
                  </p>
                  <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xl px-16 py-8 h-auto rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110">
                    <Link to="/read" className="flex items-center gap-4">
                      <Rocket className="w-6 h-6" />
                      Launch Into Your Story
                      <Sparkles className="w-6 h-6" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative">
        <div className="max-w-5xl mx-auto text-center space-y-12 relative">
          <div className="space-y-8">
            <h2 className="text-6xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Your Infinite Adventure
              </span>
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Starts Now
              </span>
            </h2>
            
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto font-light">
              Join the future of storytelling. Where AI imagination meets human creativity. 
              Where every page is a new discovery. Where your story never ends.
            </p>
          </div>

          <div className="relative">
            <Button asChild size="lg" className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white text-2xl px-20 py-10 h-auto rounded-3xl shadow-2xl transition-all duration-500 transform hover:scale-110">
              <Link to="/read" className="flex items-center gap-4">
                <Star className="w-8 h-8" />
                Begin Your Infinite Story
                <Infinity className="w-8 h-8" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 relative">
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Spelltale</span>
          </div>
          <p className="text-gray-400 mb-6 text-lg">
            The Future of Infinite Storytelling
          </p>
          <p className="text-xs text-gray-600 mt-8">
            © {new Date().getFullYear()} Spelltale • Where Technology Meets Magic ✨
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Landing;