import { useCallback, useState } from 'react';
import { buildShareHash, buildShareUrl } from '../utils/shareLink';
import '../styles/ShareTileButton.css';

/**
 * Copy (or native-share) a deep link to a project or timeline tile.
 * @param {'project' | 'timeline'} kind
 * @param {string | number} shareId
 * @param {string} [label] - accessible name, e.g. project title
 * @param {string} [className] - extra classes (project-link-btn, etc.)
 */
const ShareTileButton = ({ kind, shareId, label = 'item', className = '' }) => {
  const [feedback, setFeedback] = useState(null);

  const handleClick = useCallback(
    async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const url = buildShareUrl(kind, shareId);
      const hash = buildShareHash(kind, shareId);
      if (!url || !hash) return;

      const shareTitle = typeof document !== 'undefined' ? document.title : 'Portfolio';

      if (navigator.share) {
        try {
          await navigator.share({ url, title: shareTitle });
          setFeedback('shared');
          window.setTimeout(() => setFeedback(null), 2000);
          if (window.location.hash !== `#${hash}`) {
            window.history.replaceState(null, '', `#${hash}`);
          }
          return;
        } catch (err) {
          if (err?.name === 'AbortError') return;
        }
      }

      try {
        await navigator.clipboard.writeText(url);
        setFeedback('copied');
      } catch {
        window.prompt('Copy this link:', url);
        setFeedback('copied');
      }

      window.setTimeout(() => setFeedback(null), 2000);
      if (window.location.hash !== `#${hash}`) {
        window.history.replaceState(null, '', `#${hash}`);
      }
    },
    [kind, shareId]
  );

  const feedbackText =
    feedback === 'copied' ? 'Copied!' : feedback === 'shared' ? 'Shared!' : 'Copy link';

  return (
    <button
      type="button"
      className={`share-tile-btn ${className}`.trim()}
      onClick={handleClick}
      title={`Copy link to ${label}`}
      aria-label={`Share ${label}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" strokeLinecap="round" />
      </svg>
      <span className="share-tile-btn-feedback" aria-live="polite">
        {feedback ? feedbackText : null}
      </span>
    </button>
  );
};

export default ShareTileButton;
