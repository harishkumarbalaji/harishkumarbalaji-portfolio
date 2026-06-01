/** Fixed header (~70px) plus breathing room when scrolling to a tile. */
export const TILE_SCROLL_OFFSET_PX = 88;

const HASH_PATTERN = /^(project|timeline)\/([^/?#]+)$/;

/**
 * Stable DOM id for a shareable project or timeline tile.
 * @param {'project' | 'timeline'} kind
 * @param {string | number} id
 */
export function getTileElementId(kind, id) {
  return `portfolio-tile-${kind}-${String(id)}`;
}

/**
 * @param {'project' | 'timeline'} kind
 * @param {string | number} id
 * @returns {string | null} e.g. `project/1` or `timeline/exp-0`
 */
export function buildShareHash(kind, id) {
  const safeId = String(id).trim();
  if (!safeId) return null;
  if (kind === 'project' || kind === 'timeline') {
    return `${kind}/${encodeURIComponent(safeId)}`;
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
 * @param {string | number} id
 */
export function buildShareUrl(kind, id) {
  const shareHash = buildShareHash(kind, id);
  if (!shareHash || typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.hash = shareHash;
  return url.href;
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

const HIGHLIGHT_CLASS = 'tile-share-highlight';

export function highlightTileElement(element, durationMs = 2600) {
  if (!element) return;
  element.classList.remove(HIGHLIGHT_CLASS);
  // Reflow so re-adding the class replays the animation
  void element.offsetWidth;
  element.classList.add(HIGHLIGHT_CLASS);
  window.setTimeout(() => element.classList.remove(HIGHLIGHT_CLASS), durationMs);
}

export function focusTileFromHash(kind, id, options) {
  const el = document.getElementById(getTileElementId(kind, id));
  if (!el) return false;
  scrollToTileElement(el, options);
  if (options?.highlight !== false) {
    highlightTileElement(el);
  }
  return true;
}
