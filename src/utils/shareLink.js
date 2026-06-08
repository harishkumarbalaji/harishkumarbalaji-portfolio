import { getShareRegistry, resolveShareTarget } from './shareLinkRegistry';

/** Fixed header (~70px) plus breathing room when scrolling to a tile. */
export const TILE_SCROLL_OFFSET_PX = 88;

export const SHARE_NOT_FOUND_EVENT = 'portfolio-share-not-found';

const HASH_PATTERN = /^(project|timeline)\/([^/?#]+)$/;

/**
 * Stable DOM id for a shareable project or timeline tile (uses slug, not array index).
 * @param {'project' | 'timeline'} kind
 * @param {string} slug
 */
export function getTileElementId(kind, slug) {
  return `portfolio-tile-${kind}-${String(slug)}`;
}

/**
 * @param {'project' | 'timeline'} kind
 * @param {string} slug permanent slug from portfolioData.json
 * @returns {string | null} e.g. `project/japan-automotive-ai-challenge`
 */
export function buildShareHash(kind, slug) {
  const safeSlug = String(slug || '').trim();
  if (!safeSlug) return null;
  if (kind === 'project' || kind === 'timeline') {
    return `${kind}/${encodeURIComponent(safeSlug)}`;
  }
  return null;
}

/**
 * @param {string} [hash] window.location.hash
 * @returns {{ kind: 'project' | 'timeline', id: string } | null}
 */
export function parseShareHash(hash = typeof window !== 'undefined' ? window.location.hash : '') {
  const raw = (hash || '').replace(/^#/, '').trim();
  if (!raw) return null;
  const match = raw.match(HASH_PATTERN);
  if (!match) return null;
  return { kind: match[1], id: decodeURIComponent(match[2]) };
}

/**
 * Full URL for sharing (works on dev, GitHub Pages, and PR previews).
 * @param {'project' | 'timeline'} kind
 * @param {string} slug
 */
export function buildShareUrl(kind, slug) {
  const shareHash = buildShareHash(kind, slug);
  if (!shareHash || typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.hash = shareHash;
  return url.href;
}

/**
 * Resolve a raw hash id to a stable slug using loaded portfolio data.
 * @param {'project' | 'timeline'} kind
 * @param {string} hashId
 */
export function resolveShareSlug(kind, hashId) {
  const registry = getShareRegistry();
  if (!registry) return null;
  const target = resolveShareTarget(kind, hashId, registry);
  return target?.slug ?? null;
}

/** Update the URL bar to the canonical slug hash after resolving a legacy link. */
export function replaceShareHash(kind, slug) {
  const hash = buildShareHash(kind, slug);
  if (!hash || typeof window === 'undefined') return;
  if (window.location.hash === `#${hash}`) return;
  const url = new URL(window.location.href);
  url.hash = hash;
  window.history.replaceState(null, '', url.href);
}

export function scrollToTileElement(
  element,
  { behavior = 'smooth', offset = TILE_SCROLL_OFFSET_PX } = {}
) {
  if (!element) return false;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

export function scrollToSection(sectionId, options) {
  const el = document.getElementById(sectionId);
  if (!el) return false;
  return scrollToTileElement(el, { ...options, highlight: false });
}

const HIGHLIGHT_CLASS = 'tile-share-highlight';

export function highlightTileElement(element, durationMs = 2600) {
  if (!element) return;
  element.classList.remove(HIGHLIGHT_CLASS);
  void element.offsetWidth;
  element.classList.add(HIGHLIGHT_CLASS);
  window.setTimeout(() => element.classList.remove(HIGHLIGHT_CLASS), durationMs);
}

export function focusTileFromHash(kind, slug, options) {
  const el = document.getElementById(getTileElementId(kind, slug));
  if (!el) return false;
  scrollToTileElement(el, options);
  if (options?.highlight !== false) {
    highlightTileElement(el);
  }
  return true;
}

/**
 * Scroll to the section and notify UI when a shared link no longer resolves.
 * @param {'project' | 'timeline'} kind
 */
export function notifyShareLinkNotFound(kind) {
  const sectionId = kind === 'project' ? 'projects' : 'timeline';
  scrollToSection(sectionId);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SHARE_NOT_FOUND_EVENT, { detail: { kind } }));
  }
}

export {
  setShareRegistry,
  getShareRegistry,
  buildShareRegistry,
  resolveShareTarget,
} from './shareLinkRegistry';
