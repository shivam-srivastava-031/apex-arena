import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { TournamentCard } from '@/components/TournamentCard';
import { tournaments } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, ClipboardList, Trophy, Zap, Shield, Target } from 'lucide-react';

const featuredTournaments = tournaments.filter((t) => t.status !== 'completed').slice(0, 3);

const steps = [
  { icon: UserPlus, title: 'Create Account', desc: 'Sign up in seconds and set up your gamer profile.' },
  { icon: Users, title: 'Form Your Team', desc: 'Build your dream squad by inviting the best players.' },
  { icon: ClipboardList, title: 'Register', desc: 'Browse tournaments and register your team to compete.' },
  { icon: Trophy, title: 'Compete & Win', desc: 'Battle it out and climb the leaderboard for prizes.' },
];

const stats = [
  { value: '10K+', label: 'Players' },
  { value: '500+', label: 'Tournaments' },
  { value: '₹50L+', label: 'Prize Money' },
  { value: '1K+', label: 'Teams' },
];

const Index = () => {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary blur-[100px]" />
          <div className="absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-secondary blur-[120px]" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center md:py-36">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" /> Season 4 Now Live
          </div>
          <h1 className="animate-fade-up font-display text-4xl font-black leading-tight tracking-wider text-primary-foreground md:text-6xl lg:text-7xl">
            COMPETE, WIN,<br />
            <span className="text-gradient">DOMINATE</span>
          </h1>
          <p className="animate-fade-up-delay-1 mx-auto mt-6 max-w-xl text-lg text-primary-foreground/70">
            India's Premier Esports Tournament Platform. Join thousands of gamers competing for glory and massive prize pools.
          </p>
          <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gradient-primary border-0 px-8 text-base font-semibold shadow-glow">
              <Link to="/tournaments">Browse Tournaments</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="animate-fade-up-delay-3 mt-16 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-12">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-black text-primary-foreground">{s.value}</div>
                <div className="text-sm text-primary-foreground/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-wider md:text-3xl">FEATURED TOURNAMENTS</h2>
            <p className="mt-2 text-muted-foreground">Don't miss out on these top competitions</p>
          </div>
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <Link to="/tournaments">View All →</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
        <div className="mt-6 text-center md:hidden">
          <Button asChild variant="outline">
            <Link to="/tournaments">View All Tournaments</Link>
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="font-display text-2xl font-bold tracking-wider md:text-3xl">HOW IT WORKS</h2>
            <p className="mt-2 text-muted-foreground">Get started in 4 simple steps</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="gaming-card flex flex-col items-center p-6 text-center">
                <div className="gradient-primary mb-4 flex h-14 w-14 items-center justify-center rounded-xl shadow-glow">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="mb-1 font-display text-xs font-bold tracking-wider text-muted-foreground">
                  STEP {i + 1}
                </span>
                <h3 className="mb-2 font-display text-base font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="gradient-hero overflow-hidden rounded-2xl p-8 text-center md:p-16">
          <div className="relative">
            <Shield className="mx-auto mb-6 h-12 w-12 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-wider text-primary-foreground md:text-4xl">
              READY TO COMPETE?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-primary-foreground/70">
              Join the fastest growing esports community in India. Create your team and start winning today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gradient-primary border-0 px-8 font-semibold shadow-glow">
                <Link to="/register">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
