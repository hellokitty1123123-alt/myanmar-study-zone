import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock3, ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { getGetArticleQueryKey, useGetArticle, useGetSavedArticles } from '@workspace/api-client-react';
import { NewsroomShell } from '@/components/newsroom-shell';
import { SaveButton } from '@/components/save-button';

const readerId = 'study-reader';

export default function ArticlePage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const id = params.id ?? '';
  const articleQuery = useGetArticle(id, { query: { enabled: Boolean(id), queryKey: getGetArticleQueryKey(id) } });
  const savedQuery = useGetSavedArticles({ readerId });
  const savedIds = useMemo(() => new Set((savedQuery.data ?? []).map((article) => article.id)), [savedQuery.data]);
  const article = articleQuery.data;

  if (articleQuery.isLoading) return <NewsroomShell><ArticleLoading /></NewsroomShell>;
  if (articleQuery.isError || !article) return <NewsroomShell><ArticleError onRetry={() => void articleQuery.refetch()} /></NewsroomShell>;

  const paragraphs = article.body.split(/\n{2,}/).filter(Boolean);
  const accent = article.accent || '#D98A66';
  return (
    <NewsroomShell>
      <article className="mx-auto max-w-[1100px] px-5 pb-24 sm:px-8 md:px-12">
        <div className="flex items-center justify-between border-b border-border py-5">
          <button type="button" data-testid="button-back-article" onClick={() => setLocation('/')} className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"><ArrowLeft size={16} /> Back to the desk</button>
          <span className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Reading room / {article.topicLabel}</span>
        </div>
        <header className="relative overflow-hidden py-12 sm:py-16">
          <div className="absolute -right-32 -top-20 h-72 w-72 rounded-full border-[34px] border-secondary/10" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em]" style={{ color: accent }}>{article.topicLabel}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-xs text-muted-foreground">{formatDate(article.publishedAt)}</span>
            </div>
            <h1 data-testid={`text-article-title-${article.id}`} className="font-display mt-6 max-w-[900px] text-[clamp(2.7rem,6vw,5.8rem)] leading-[.93] tracking-[-0.045em] text-primary">{article.title}</h1>
            <p data-testid={`text-article-summary-${article.id}`} className="mt-7 max-w-[720px] text-lg leading-relaxed text-muted-foreground sm:text-xl">{article.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <SaveButton articleId={article.id} saved={savedIds.has(article.id)} />
              <span className="inline-flex items-center gap-2 px-2 text-xs text-muted-foreground"><Clock3 size={15} /> {article.readTime} min read</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="inline-flex items-center gap-2 px-2 text-xs text-muted-foreground"><ShieldCheck size={15} className="text-secondary" /> Quality checked {article.qualityScore}/10</span>
            </div>
          </div>
        </header>

        <div className="grid gap-12 border-t border-border pt-10 lg:grid-cols-[minmax(0,680px)_250px] lg:gap-20">
          <div className="reading-copy font-display text-[19px] leading-[1.72] text-foreground/80 sm:text-[21px]">
            {paragraphs.map((paragraph, index) => <p key={`${article.id}-paragraph-${index}`} data-testid={`text-article-paragraph-${index}`}>{paragraph}</p>)}
          </div>
          <aside className="h-fit lg:sticky lg:top-[100px]">
            <div className="rounded-[20px] border border-border bg-muted/45 p-5">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-secondary" /><p className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Keep in mind</p></div>
              <ul className="mt-4 space-y-4">
                {article.keyPoints.map((point, index) => <li key={`${article.id}-point-${index}`} data-testid={`text-key-point-${index}`} className="flex gap-3 text-sm leading-relaxed text-foreground/75"><span className="font-mono-ui text-xs text-secondary">0{index + 1}</span><span>{point}</span></li>)}
              </ul>
            </div>
            <div className="mt-5 border-l-2 border-secondary/60 pl-4">
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Reported by</p>
              <p className="mt-2 text-sm font-semibold text-primary">{article.sourceName}</p>
              <a href={article.sourceUrl} target="_blank" rel="noreferrer" data-testid="link-article-source" className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary">View original source <ExternalLink size={12} /></a>
            </div>
          </aside>
        </div>
        <footer className="mt-16 flex flex-col items-start justify-between gap-5 border-t border-border pt-7 sm:flex-row sm:items-center">
          <div><p className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-secondary">End of this briefing</p><p className="font-display mt-1 text-xl text-primary">Let the idea settle.</p></div>
          <Link href="/" data-testid="link-continue-reading" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground transition-transform hover:translate-x-0.5">Find another read <ArrowUpRight size={15} /></Link>
        </footer>
      </article>
    </NewsroomShell>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function ArticleLoading() {
  return <div className="mx-auto max-w-[1100px] animate-pulse px-5 pb-24 sm:px-8 md:px-12"><div className="h-14 border-b border-border" /><div className="py-16"><div className="h-3 w-24 rounded bg-muted" /><div className="mt-7 h-20 max-w-[760px] rounded bg-muted" /><div className="mt-3 h-20 max-w-[600px] rounded bg-muted" /></div><div className="grid gap-5 border-t border-border pt-10 lg:grid-cols-[680px_250px]"><div className="space-y-4"><div className="h-5 rounded bg-muted" /><div className="h-5 rounded bg-muted" /><div className="h-5 w-4/5 rounded bg-muted" /><div className="h-5 rounded bg-muted" /></div><div className="h-48 rounded-[20px] bg-muted" /></div></div>;
}

function ArticleError({ onRetry }: { onRetry: () => void }) {
  return <div className="mx-auto flex min-h-[65vh] max-w-[700px] flex-col items-center justify-center px-6 text-center"><p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-secondary">Reading room unavailable</p><h1 className="font-display mt-4 text-4xl text-primary">This story took a wrong turn.</h1><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">We couldn't open the article just now. Return to the desk or try again.</p><div className="mt-7 flex gap-3"><Link href="/" data-testid="link-error-home" className="rounded-full border border-border px-4 py-2.5 text-xs font-semibold text-foreground">Back to desk</Link><button type="button" data-testid="button-retry-article" onClick={onRetry} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"><RefreshCw size={14} /> Try again</button></div></div>;
}