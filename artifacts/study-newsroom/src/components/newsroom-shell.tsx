import { BookOpen, Bookmark, Compass, Headphones, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';

export function NewsroomShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = location === '/saved' ? 'saved' : 'home';

  return (
    <div className="grain min-h-[100dvh] bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-sidebar-border bg-sidebar px-6 py-7 text-sidebar-foreground md:flex">
        <Brand />
        <div className="mt-14">
          <p className="font-mono-ui mb-3 text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/45">Your desk</p>
          <nav className="space-y-1" aria-label="Main navigation">
            <NavItem href="/" active={active === 'home'} icon={<Compass size={18} strokeWidth={1.8} />} label="Today's read" />
            <NavItem href="/saved" active={active === 'saved'} icon={<Bookmark size={18} strokeWidth={1.8} />} label="Saved for later" />
          </nav>
        </div>
        <div className="mt-auto rounded-[20px] border border-sidebar-border bg-sidebar-accent/70 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <Headphones size={17} />
          </div>
          <p className="font-display text-lg leading-tight text-sidebar-foreground">A little clarity, every day.</p>
          <p className="mt-2 text-xs leading-relaxed text-sidebar-foreground/55">Short, considered reads for the long road to your next exam.</p>
        </div>
        <div className="mt-5 flex items-center gap-2 text-[11px] text-sidebar-foreground/40">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
          <span className="font-mono-ui uppercase tracking-[0.15em]">Reader mode</span>
        </div>
      </aside>

      <div className="md:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-border/80 bg-background/90 px-5 backdrop-blur-xl sm:px-8 md:px-12">
          <Link href="/" className="md:hidden" data-testid="link-mobile-brand"><Brand compact /></Link>
          <div className="hidden text-sm text-muted-foreground md:block">
            <span className="font-mono-ui mr-2 text-[10px] uppercase tracking-[0.18em] text-secondary">Tuesday, 21 May 2024</span>
            <span className="text-border">/</span>
            <span className="ml-2">Good morning, reader</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
              Built for focused minds
            </span>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              data-testid="button-toggle-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted md:hidden"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>
        {menuOpen && (
          <div className="absolute left-0 right-0 top-[72px] z-20 border-b border-border bg-card p-4 shadow-lg md:hidden">
            <nav className="grid gap-1" aria-label="Mobile navigation">
              <MobileNavItem href="/" active={active === 'home'} icon={<Compass size={17} />} label="Today's read" onClick={() => setMenuOpen(false)} />
              <MobileNavItem href="/saved" active={active === 'saved'} icon={<Bookmark size={17} />} label="Saved for later" onClick={() => setMenuOpen(false)} />
            </nav>
          </div>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" data-testid="brand-study-newsroom">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-secondary text-secondary-foreground">
        <BookOpen size={17} strokeWidth={2.2} />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-accent" />
      </div>
      <div className={compact ? '' : 'text-sidebar-foreground'}>
        <p className="font-display text-[19px] leading-none">Study Newsroom</p>
        <p className="font-mono-ui mt-1 text-[8px] uppercase tracking-[0.22em] opacity-45">Read well / learn deeply</p>
      </div>
    </div>
  );
}

function NavItem({ href, active, icon, label }: { href: string; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}
      className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 ${active ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/55 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'}`}
    >
      <span className={active ? 'text-secondary' : 'text-sidebar-foreground/50 group-hover:text-secondary'}>{icon}</span>
      <span>{label}</span>
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-secondary" />}
    </Link>
  );
}

function MobileNavItem({ href, active, icon, label, onClick }: { href: string; active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${active ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
    >
      {icon}<span>{label}</span>
    </Link>
  );
}