import { ArrowRight, BookMarked, ChevronRight, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useGetArticles, useGetSavedArticles, useGetTopics } from '@workspace/api-client-react';
import { ArticleCard, ArticleSkeleton } from '@/components/article-card';
import { NewsroomShell } from '@/components/newsroom-shell';

const readerId = 'study-reader';

export default function HomePage() {
  const articlesQuery = useGetArticles();
  const savedQuery = useGetSavedArticles({ readerId });
  const topicsQuery = useGetTopics();
  const [selectedTopic, setSelectedTopic] = useState('all');
  const articles = articlesQuery.data ?? [];
  const savedIds = useMemo(() => new Set((savedQuery.data ?? []).map((article) => article.id)), [savedQuery.data]);
  const featured = articles[0];
  const latest = articles.slice(1);
  const filteredLatest = selectedTopic === 'all' ? latest : latest.filter((article) => article.topic === selectedTopic);

  return (
    <NewsroomShell>
      <div className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 md:px-12">
        <section className="animate-rise-in relative grid gap-8 border-b border-border py-12 sm:py-16 lg:grid-cols-[1fr_340px] lg:gap-16 lg:py-20">
          <div>
            <div className="mb-7 flex items-center gap-3">
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.22em] text-secondary">The daily brief</span>
              <span className="h-px w-12 bg-secondary/60" />
              <span className="text-xs text-muted-foreground">6 quiet minutes for a sharper mind</span>
            </div>
            <h1 className="font-display max-w-[840px] text-[clamp(3.25rem,8vw,7.2rem)] leading-[.88] tracking-[-0.055em] text-primary">
              Learn something<br /><span className="text-accent">worth keeping.</span>
            </h1>
            <p className="mt-8 max-w-[580px] text-base leading-relaxed text-muted-foreground sm:text-lg">A considered stream of ideas, methods, and small discoveries to help you study with more direction — not more noise.</p>
          </div>
          <div className="relative flex flex-col justify-end lg:pb-2">
            <div className="absolute -right-4 top-0 hidden h-32 w-32 rounded-full border border-secondary/30 lg:block" />
            <div className="relative border-l-2 border-secondary pl-5">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">A note from the desk</p>
              <p className="font-display mt-3 text-2xl leading-tight text-foreground">“The best study habit is knowing what deserves your attention.”</p>
              <p className="mt-3 text-xs text-muted-foreground">— Editorial team, Yangon</p>
            </div>
          </div>
        </section>

        <section className="animate-rise-in grid gap-6 py-9 sm:grid-cols-3" style={{ animationDelay: '90ms' }}>
          <div className="rounded-[20px] bg-primary p-6 text-primary-foreground sm:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-primary-foreground/55">Today's focus</p>
                <p className="font-display mt-2 text-2xl sm:text-3xl">One useful idea beats ten open tabs.</p>
              </div>
              <BookMarked className="hidden text-secondary sm:block" size={34} strokeWidth={1.4} />
            </div>
            <div className="mt-7 flex items-center gap-4 text-xs text-primary-foreground/65">
              <span>{articles.length || '—'} reads in the newsroom</span><span className="h-1 w-1 rounded-full bg-secondary" /><span>Updated each morning</span>
            </div>
          </div>
          <Link href="/saved" data-testid="link-home-saved" className="group flex min-h-[150px] flex-col justify-between rounded-[20px] border border-border bg-card p-6 transition-all hover:border-secondary hover:bg-secondary/10">
            <div className="flex items-center justify-between"><BookMarked size={20} className="text-secondary" /><ArrowRight size={17} className="text-muted-foreground transition-transform group-hover:translate-x-1" /></div>
            <div><p className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Your reading shelf</p><p className="font-display mt-1 text-2xl">{savedQuery.data?.length ?? 0} saved {savedQuery.data?.length === 1 ? 'piece' : 'pieces'}</p></div>
          </Link>
        </section>

        <section className="animate-rise-in" style={{ animationDelay: '160ms' }}>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-secondary">Lead story</p><h2 className="font-display mt-2 text-3xl text-primary sm:text-4xl">Start here</h2></div>
            <span className="hidden text-xs text-muted-foreground sm:block">Hand-picked for your next study break</span>
          </div>
          {articlesQuery.isLoading ? <ArticleSkeleton featured /> : articlesQuery.isError ? <QueryError onRetry={() => void articlesQuery.refetch()} /> : featured ? <ArticleCard article={featured} savedIds={savedIds} featured /> : <EmptyFeed />}
        </section>

        <section className="animate-rise-in pt-16" style={{ animationDelay: '220ms' }}>
          <div className="flex flex-col justify-between gap-5 border-b border-border pb-5 sm:flex-row sm:items-end">
            <div><p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-secondary">Keep exploring</p><h2 className="font-display mt-2 text-3xl text-primary sm:text-4xl">Latest from the desk</h2></div>
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
              <button type="button" data-testid="button-topic-all" onClick={() => setSelectedTopic('all')} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${selectedTopic === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-secondary/25 hover:text-foreground'}`}>All stories</button>
              {(topicsQuery.data ?? []).slice(0, 4).map((topic) => <button type="button" key={topic.id} data-testid={`button-topic-${topic.id}`} onClick={() => setSelectedTopic(topic.id)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${selectedTopic === topic.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-secondary/25 hover:text-foreground'}`}>{topic.label}</button>)}
            </div>
          </div>
          {articlesQuery.isLoading ? <div className="grid gap-5 pt-6 md:grid-cols-2"><ArticleSkeleton /><ArticleSkeleton /></div> : filteredLatest.length ? <div className="grid gap-5 pt-6 md:grid-cols-2">{filteredLatest.map((article, index) => <div key={article.id} className="animate-rise-in" style={{ animationDelay: `${index * 60}ms` }}><ArticleCard article={article} savedIds={savedIds} /></div>)}</div> : <div className="py-16 text-center"><p className="font-display text-2xl text-primary">No stories in this corner yet.</p><p className="mt-2 text-sm text-muted-foreground">Try another topic for now.</p></div>}
        </section>

        <section className="mt-20 overflow-hidden rounded-[24px] border border-secondary/35 bg-secondary/10 px-6 py-8 sm:flex sm:items-center sm:justify-between sm:px-9">
          <div><p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-secondary">A slower kind of reading</p><h2 className="font-display mt-2 text-2xl text-primary sm:text-3xl">Keep the good ones close.</h2><p className="mt-2 text-sm text-muted-foreground">Save a piece when it meets you at the right moment.</p></div>
          <Link href="/saved" data-testid="link-bottom-saved" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary sm:mt-0">Open your shelf <ChevronRight size={17} /></Link>
        </section>
      </div>
    </NewsroomShell>
  );
}

function QueryError({ onRetry }: { onRetry: () => void }) {
  return <div className="rounded-[24px] border border-destructive/30 bg-destructive/5 p-8"><p className="font-display text-2xl text-primary">The desk is quiet right now.</p><p className="mt-2 text-sm text-muted-foreground">We couldn't bring in the latest reading. Give it another moment.</p><button type="button" data-testid="button-retry-feed" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"><RefreshCw size={14} /> Try again</button></div>;
}

function EmptyFeed() {
  return <div className="rounded-[24px] border border-dashed border-border bg-muted/40 p-12 text-center"><p className="font-display text-2xl text-primary">The first story is on its way.</p><p className="mt-2 text-sm text-muted-foreground">Check back soon for a fresh idea to carry into your day.</p></div>;
}