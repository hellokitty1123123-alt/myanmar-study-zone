import { ArrowLeft, Bookmark, BookOpen, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'wouter';
import type { Article } from '@workspace/api-client-react';
import { useGetSavedArticles } from '@workspace/api-client-react';
import { ArticleCard } from '@/components/article-card';
import { NewsroomShell } from '@/components/newsroom-shell';

const readerId = 'study-reader';

export default function SavedPage() {
  const savedQuery = useGetSavedArticles({ readerId });
  const articles = savedQuery.data ?? [];
  const savedIds = useMemo(() => new Set(articles.map((article) => article.id)), [articles]);

  return (
    <NewsroomShell>
      <div className="mx-auto max-w-[1180px] px-5 pb-24 sm:px-8 md:px-12">
        <header className="border-b border-border py-12 sm:py-16">
          <div className="flex items-center gap-3"><Bookmark size={17} className="text-secondary" /><span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-secondary">Your reading shelf</span></div>
          <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div><h1 className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[.9] tracking-[-0.045em] text-primary">Saved for<br /><span className="text-accent">the right moment.</span></h1><p className="mt-6 max-w-[470px] text-base leading-relaxed text-muted-foreground">The pieces you chose to keep close. Come back when you have a little more time to think.</p></div>
            <div className="font-mono-ui text-right text-[10px] uppercase tracking-[0.16em] text-muted-foreground"><span data-testid="text-saved-count" className="font-display text-5xl tracking-normal text-primary">{articles.length}</span><br />{articles.length === 1 ? 'saved piece' : 'saved pieces'}</div>
          </div>
        </header>
        {savedQuery.isLoading ? <SavedSkeleton /> : savedQuery.isError ? <SavedError onRetry={() => void savedQuery.refetch()} /> : articles.length ? <SavedGrid articles={articles} savedIds={savedIds} /> : <SavedEmpty />}
      </div>
    </NewsroomShell>
  );
}

function SavedGrid({ articles, savedIds }: { articles: Article[]; savedIds: Set<string> }) {
  return <section className="grid gap-5 pt-9 md:grid-cols-2" data-testid="list-saved-articles">{articles.map((article, index) => <div key={article.id} className="animate-rise-in" style={{ animationDelay: `${index * 70}ms` }}><ArticleCard article={article} savedIds={savedIds} /></div>)}</section>;
}

function SavedEmpty() {
  return (
    <section className="relative mt-10 overflow-hidden rounded-[28px] border border-border bg-card px-7 py-16 text-center sm:px-12 sm:py-24" data-testid="empty-saved-articles">
      <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-[28px] border-secondary/10" />
      <div className="relative mx-auto flex max-w-[480px] flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-secondary/20 text-primary"><BookOpen size={28} strokeWidth={1.5} /></div>
        <p className="font-mono-ui mt-7 text-[10px] uppercase tracking-[0.2em] text-secondary">A blank, useful space</p>
        <h2 className="font-display mt-3 text-4xl leading-tight text-primary">Nothing saved yet.</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">When a story stays with you, tap the bookmark. It will be waiting here whenever you are ready for it.</p>
        <Link href="/" data-testid="link-empty-find-stories" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"><ArrowLeft size={15} /> Find something to save</Link>
      </div>
    </section>
  );
}

function SavedSkeleton() {
  return <section className="grid gap-5 pt-9 md:grid-cols-2">{[1, 2].map((item) => <div key={item} className="animate-pulse rounded-[24px] border border-border bg-card p-7"><div className="h-3 w-24 rounded bg-muted" /><div className="mt-8 h-8 w-4/5 rounded bg-muted" /><div className="mt-3 h-4 w-full rounded bg-muted" /><div className="mt-2 h-4 w-3/4 rounded bg-muted" /><div className="mt-10 h-px w-full bg-muted" /></div>)}</section>;
}

function SavedError({ onRetry }: { onRetry: () => void }) {
  return <section className="mt-10 rounded-[24px] border border-destructive/30 bg-destructive/5 p-10"><p className="font-display text-3xl text-primary">Your shelf is out of reach.</p><p className="mt-2 text-sm text-muted-foreground">We couldn't check your saved pieces.</p><button type="button" data-testid="button-retry-saved" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"><RefreshCw size={14} /> Try again</button></section>;
}