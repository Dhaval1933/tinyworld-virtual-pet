import { Link } from 'react-router-dom';
import { Sparkles, Heart, Palette, ListChecks, Trophy, ArrowRight, Star } from 'lucide-react';
import Button from '../components/common/Button';

const features = [
  {
    icon: Heart,
    title: 'Adopt & Care',
    description: 'Choose a cute companion — feed, pet, and watch them thrive as you take care of yourself.',
    color: 'bg-peach/30',
    iconColor: 'text-peach-dark',
  },
  {
    icon: Palette,
    title: 'Decorate Your Room',
    description: 'Drag and drop furniture, plants, and decorations to create your perfect cozy space.',
    color: 'bg-lavender/30',
    iconColor: 'text-lavender-dark',
  },
  {
    icon: ListChecks,
    title: 'Track Real Activities',
    description: 'Log reading, exercise, studying and more. Your progress fuels your tiny world.',
    color: 'bg-sage/30',
    iconColor: 'text-sage-dark',
  },
  {
    icon: Trophy,
    title: 'Earn & Unlock',
    description: 'Collect coins, level up, unlock new items, and earn achievements along the way.',
    color: 'bg-sky/30',
    iconColor: 'text-sky-dark',
  },
];

const shopPreview = [
  { name: 'Pastel Sofa', price: 120, rarity: 'uncommon', emoji: '🛋️' },
  { name: 'Star Lamp', price: 75, rarity: 'uncommon', emoji: '⭐' },
  { name: 'Potted Plant', price: 30, rarity: 'common', emoji: '🌿' },
  { name: 'Bookshelf', price: 80, rarity: 'common', emoji: '📚' },
  { name: 'Cloud Wallpaper', price: 150, rarity: 'rare', emoji: '☁️' },
  { name: 'Round Rug', price: 40, rarity: 'common', emoji: '🟤' },
];

export default function LandingPage() {
  return (
    <div className="page-enter">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-lavender rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-peach rounded-full animate-float opacity-50" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-sage rounded-full animate-float opacity-40" style={{ animationDelay: '2s' }} />
        <div className="absolute top-32 right-1/3 w-2.5 h-2.5 bg-sky rounded-full animate-float opacity-50" style={{ animationDelay: '0.5s' }} />

        <div className="max-w-6xl mx-auto px-4 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-lavender/20 border border-lavender/30 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-lavender-dark" />
              <span className="text-sm font-medium text-ink-light">Your cozy corner of the internet</span>
            </div>

            {/* Main heading */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold text-ink leading-tight mb-6">
              A little world that's{' '}
              <span className="relative">
                <span className="relative z-10 text-lavender-dark">all yours</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-lavender/30 -z-0 rounded" />
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-ink-muted max-w-xl mx-auto mb-10 leading-relaxed">
              Adopt a tiny creature, build a cozy room, complete real-life activities,
              and watch your little world grow — one kind habit at a time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" icon={ArrowRight}>
                  Create Your World
                </Button>
              </Link>
              <a href="#features">
                <Button variant="ghost" size="lg">
                  See How It Works
                </Button>
              </a>
            </div>
          </div>

          {/* Room Preview */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="relative bg-gradient-to-b from-sky/30 to-sage/20 rounded-3xl p-6 md:p-8 shadow-card border border-white/60">
              {/* Room window */}
              <div className="absolute top-4 right-6 w-16 h-20 bg-sky/40 rounded-lg border-2 border-white/60">
                <div className="w-full h-0.5 bg-white/60 absolute top-1/2" />
                <div className="w-0.5 h-full bg-white/60 absolute left-1/2" />
              </div>

              {/* Floor */}
              <div className="bg-peach/20 rounded-2xl p-6 mt-8 relative min-h-[200px] md:min-h-[260px]">
                {/* Pet - Mochi */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center animate-bounce-gentle">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-lavender rounded-full flex items-center justify-center shadow-lg relative">
                    <span className="text-3xl md:text-4xl">😺</span>
                    {/* Speech bubble */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-lg px-3 py-1 shadow-soft text-xs font-medium text-ink whitespace-nowrap">
                      Hi there! ✨
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-ink-muted mt-1">Mochi</p>
                </div>

                {/* Furniture items */}
                <div className="absolute bottom-4 left-4 text-2xl md:text-3xl">🛋️</div>
                <div className="absolute top-4 right-4 text-2xl md:text-3xl">📚</div>
                <div className="absolute bottom-4 right-8 text-xl md:text-2xl">🌿</div>
                <div className="absolute top-2 left-8 text-xl md:text-2xl">⭐</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3">
              How TinyWorld Works
            </h2>
            <p className="text-ink-muted max-w-lg mx-auto">
              Take care of your little world while taking care of yourself.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-cream hover:bg-white hover:shadow-card transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <h3 className="font-display font-bold text-lg text-ink mb-2">{feature.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Shop Preview Section ─── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-ink mb-3">
              Collect & Customize
            </h2>
            <p className="text-ink-muted max-w-md mx-auto">
              Earn coins from activities and unlock furniture, plants, wallpapers, and more.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {shopPreview.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-xl p-4 text-center shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="font-semibold text-sm text-ink">{item.name}</p>
                <p className="flex items-center justify-center gap-1 text-xs text-ink-muted mt-1">
                  <Star className="w-3 h-3 text-peach-dark" />
                  {item.price} coins
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 bg-gradient-to-b from-lavender/10 to-cream">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-ink-muted mb-8">
            Create your world in minutes. Adopt a pet, decorate your room, and start building good habits today.
          </p>
          <Link to="/register">
            <Button size="lg" icon={Sparkles}>
              Create Your World — It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-white border-t border-cream-dark py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌍</span>
              <span className="font-display font-bold text-ink">TinyWorld</span>
              <span className="text-xs text-ink-muted ml-2">— A cozy virtual pet game</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-ink-muted">
              <span>Built with 💕 as an end-term project</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
