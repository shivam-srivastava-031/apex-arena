import { Link } from 'react-router-dom';
import { Trophy, Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <Trophy className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold tracking-wider">ARENA</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              India's premier esports tournament platform. Compete, win, and dominate.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold tracking-wider">PLATFORM</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/tournaments" className="transition-colors hover:text-foreground">Tournaments</Link>
              <Link to="/dashboard/teams" className="transition-colors hover:text-foreground">Teams</Link>
              <Link to="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold tracking-wider">LEGAL</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="cursor-pointer transition-colors hover:text-foreground">About</span>
              <span className="cursor-pointer transition-colors hover:text-foreground">Terms of Service</span>
              <span className="cursor-pointer transition-colors hover:text-foreground">Privacy Policy</span>
              <span className="cursor-pointer transition-colors hover:text-foreground">Contact</span>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold tracking-wider">SOCIAL</h4>
            <div className="flex gap-3">
              <a href="#" className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © 2026 Arena Esports. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
