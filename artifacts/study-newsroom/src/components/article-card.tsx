import { ArrowUpRight, Clock3, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import type { Article } from '@workspace/api-client-react';
import { SaveButton } from '@/components/save-button';

export function ArticleCard({ article, savedIds, featured = false }: { article: Article; savedIds: Set<string>; featured?: boolean }) {
  const accent = article.accent || '#D98A66';
  return (
    <article
      data-testid={`card-article-${article.id}`}
      className={`group relative overflow-hidden rounded-[24px] border border-border bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/60 hover:shadow-[0_16px_40px_hsl(181_29%_25%/0.08)] ${featured ? 'min-h-[330px]' : ''}`}
    >
      <div className="absolute left-0 top-0 h-full w-1.5" style={{ backgroundColor: accent }} />
      <div className={`flex h-full flex-col ${featured ? 'p-7 sm:p-9' : 'p-6'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.16em]" style={{ color: accent }}>{article.topicLabel}</span>
            {featured && <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"><Sparkles size={10} /> Editor's pick</span>}
          </div>
          <SaveButton articleId={article.id} saved={savedIds.has(article.id)} compact />
        </div>
        <Link href={`/article/${article.id}`} data-testid={`link-article-${article.id}`} className="mt-5 block flex-1">
          <h2 className={`font-display leading-[1.07] text-foreground transition-colors group-hover:text-primary ${featured ? 'max-w-[640px] text-3xl sm:text-[42px]' : 'text-[25px]'}`}>{article.title}</h2>
          <p className={`mt-4 leading-relaxed text-muted-foreground ${featured ? 'max-w-[610px] text-[15px]' : 'line-clamp-3 text-sm'}`}>{article.summary}</p>
        </Link>
        <div className="mt-6 flex items-center justify-between border-t border-border/70 pt-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono-ui text-[10px] uppercase tracking-[0.08em]">{article.sourceName}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="inline-flex items-center gap-1"><Clock3 size={13} /> {article.readTime} min read</span>
          </div>
          <Link href={`/article/${article.id}`} aria-label={`Read ${article.title}`} data-testid={`link-read-${article.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-secondary">
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ArticleSkeleton({ featured = false }: { featured?: boolean }) {
  return <div className={`animate-pulse rounded-[24px] border border-border bg-card p-7 ${featured ? 'min-h-[330px]' : 'h-[260px]'}`}><div className="h-3 w-24 rounded bg-muted" /><div className="mt-8 h-9 w-4/5 rounded bg-muted" /><div className="mt-3 h-4 w-full rounded bg-muted" /><div className="mt-2 h-4 w-3/4 rounded bg-muted" /><div className="mt-10 h-px w-full bg-muted" /></div>;
}