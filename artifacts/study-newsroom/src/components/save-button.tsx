import { Bookmark, Check, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import {
  getGetArticleQueryKey,
  getGetArticlesQueryKey,
  getGetSavedArticlesQueryKey,
  useSaveArticle,
  useUnsaveArticle,
} from '@workspace/api-client-react';

const readerId = 'study-reader';

export function SaveButton({ articleId, saved, compact = false }: { articleId: string; saved: boolean; compact?: boolean }) {
  const queryClient = useQueryClient();
  const [savedState, setSavedState] = useState(saved);
  const save = useSaveArticle();
  const unsave = useUnsaveArticle();
  const pending = save.isPending || unsave.isPending;

  useEffect(() => {
    setSavedState(saved);
  }, [saved]);

  const toggle = () => {
    if (pending) return;
    const next = !savedState;
    setSavedState(next);
    const mutation = next ? save : unsave;
    mutation.mutate(
      { id: articleId, params: { readerId } },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({ queryKey: getGetSavedArticlesQueryKey({ readerId }) });
          void queryClient.invalidateQueries({ queryKey: getGetArticlesQueryKey() });
          void queryClient.invalidateQueries({ queryKey: getGetArticleQueryKey(articleId) });
        },
        onError: () => setSavedState(!next),
      },
    );
  };

  return (
    <button
      type="button"
      aria-label={savedState ? 'Remove from saved articles' : 'Save article for later'}
      aria-pressed={savedState}
      data-testid={`button-save-article-${articleId}`}
      onClick={toggle}
      className={`group inline-flex items-center justify-center gap-2 rounded-full border transition-all duration-200 ${compact ? 'h-9 w-9' : 'h-10 px-4'} ${savedState ? 'border-secondary/70 bg-secondary/15 text-primary' : 'border-border bg-card/70 text-muted-foreground hover:border-secondary/70 hover:bg-secondary/10 hover:text-primary'} ${pending ? 'cursor-wait opacity-70' : ''}`}
    >
      {pending ? <Loader2 size={compact ? 16 : 15} className="animate-spin" /> : savedState ? <Check size={compact ? 16 : 15} className="bookmark-pop" /> : <Bookmark size={compact ? 16 : 15} />}
      {!compact && <span className="text-xs font-semibold">{savedState ? 'Saved' : 'Save for later'}</span>}
    </button>
  );
}