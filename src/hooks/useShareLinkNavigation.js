import { useCallback, useEffect, useRef } from 'react';
import { focusTileFromHash, parseShareHash } from '../utils/shareLink';

const NAV_EVENT = 'portfolio-share-navigate';
const MAX_ATTEMPTS = 40;
const RETRY_MS = 80;

/**
 * Scrolls to a project or timeline tile when the URL hash matches (or after navigation events).
 * @param {'project' | 'timeline'} kind
 * @param {object} options
 * @param {boolean} options.isReady - data loaded and tile should be in the DOM (or soon)
 * @param {(id: string) => void} [options.prepareForId] - e.g. switch timeline filter before scroll
 */
export function useShareLinkNavigation(kind, { isReady, prepareForId, retryKey } = {}) {
  const pendingIdRef = useRef(null);
  const retryTimerRef = useRef(null);

  const clearRetry = useCallback(() => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const tryFocus = useCallback(
    (id) => {
      if (!id) return false;
      const ok = focusTileFromHash(kind, id);
      if (ok) {
        pendingIdRef.current = null;
        clearRetry();
      }
      return ok;
    },
    [kind, clearRetry]
  );

  const scheduleFocus = useCallback(
    (id, attempt = 0) => {
      if (!id) return;
      pendingIdRef.current = id;
      prepareForId?.(id);

      if (tryFocus(id)) return;

      if (attempt >= MAX_ATTEMPTS) return;

      clearRetry();
      retryTimerRef.current = window.setTimeout(() => {
        scheduleFocus(id, attempt + 1);
      }, RETRY_MS);
    },
    [prepareForId, tryFocus, clearRetry]
  );

  const queueFromHash = useCallback(() => {
    const parsed = parseShareHash();
    if (parsed?.kind === kind) {
      scheduleFocus(parsed.id);
    }
  }, [kind, scheduleFocus]);

  useEffect(() => {
    const onNavigate = (event) => {
      const detail = event.detail;
      if (detail?.kind !== kind) return;
      scheduleFocus(detail.id);
    };

    window.addEventListener(NAV_EVENT, onNavigate);
    return () => window.removeEventListener(NAV_EVENT, onNavigate);
  }, [kind, scheduleFocus]);

  useEffect(() => {
    queueFromHash();
    const onHashChange = () => queueFromHash();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [queueFromHash]);

  useEffect(() => {
    if (!isReady) return;
    const id = pendingIdRef.current;
    if (id) {
      tryFocus(id);
    } else {
      queueFromHash();
    }
  }, [isReady, retryKey, tryFocus, queueFromHash]);

  useEffect(() => clearRetry, [clearRetry]);

  return { scheduleFocus };
}
