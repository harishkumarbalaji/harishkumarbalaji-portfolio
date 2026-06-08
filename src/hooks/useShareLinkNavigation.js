import { useCallback, useEffect, useRef } from 'react';
import {
  focusTileFromHash,
  getShareRegistry,
  notifyShareLinkNotFound,
  parseShareHash,
  replaceShareHash,
  resolveShareTarget,
} from '../utils/shareLink';

const NAV_EVENT = 'portfolio-share-navigate';
const MAX_ATTEMPTS = 40;
const RETRY_MS = 80;

/**
 * Scrolls to a project or timeline tile when the URL hash matches (or after navigation events).
 * Resolves legacy hashes (project/2, timeline/exp-0) to stable slugs via share registry.
 * @param {'project' | 'timeline'} kind
 * @param {object} options
 * @param {boolean} options.isReady - data loaded and tile should be in the DOM (or soon)
 * @param {(target: { slug: string, category: string | null }) => void} [options.prepareForTarget]
 */
export function useShareLinkNavigation(kind, { isReady, prepareForTarget, retryKey } = {}) {
  const pendingRawIdRef = useRef(null);
  const retryTimerRef = useRef(null);
  const notFoundHandledRef = useRef(false);

  const clearRetry = useCallback(() => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const tryFocus = useCallback(
    (rawId) => {
      if (!rawId) return false;

      const registry = getShareRegistry();
      if (!registry) return false;

      const target = resolveShareTarget(kind, rawId, registry);
      if (!target) return false;

      prepareForTarget?.(target);

      const ok = focusTileFromHash(kind, target.slug);
      if (ok) {
        pendingRawIdRef.current = null;
        notFoundHandledRef.current = false;
        clearRetry();
        if (target.slug !== rawId) {
          replaceShareHash(kind, target.slug);
        }
      }
      return ok;
    },
    [kind, prepareForTarget, clearRetry]
  );

  const handleNotFound = useCallback(() => {
    if (notFoundHandledRef.current) return;
    notFoundHandledRef.current = true;
    pendingRawIdRef.current = null;
    clearRetry();
    notifyShareLinkNotFound(kind);
  }, [kind, clearRetry]);

  const scheduleFocus = useCallback(
    (rawId, attempt = 0) => {
      if (!rawId) return;
      pendingRawIdRef.current = rawId;
      notFoundHandledRef.current = false;

      if (tryFocus(rawId)) return;

      const registry = getShareRegistry();
      if (registry && !resolveShareTarget(kind, rawId, registry)) {
        handleNotFound();
        return;
      }

      if (attempt >= MAX_ATTEMPTS) {
        handleNotFound();
        return;
      }

      clearRetry();
      retryTimerRef.current = window.setTimeout(() => {
        scheduleFocus(rawId, attempt + 1);
      }, RETRY_MS);
    },
    [kind, tryFocus, handleNotFound, clearRetry]
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
    const rawId = pendingRawIdRef.current;
    if (rawId) {
      tryFocus(rawId);
    } else {
      queueFromHash();
    }
  }, [isReady, retryKey, tryFocus, queueFromHash]);

  useEffect(() => clearRetry, [clearRetry]);

  return { scheduleFocus };
}

export { NAV_EVENT as SHARE_NAV_EVENT };
