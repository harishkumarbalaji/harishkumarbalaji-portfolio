import { useEffect, useState } from 'react';
import { SHARE_NOT_FOUND_EVENT } from '../utils/shareLink';
import '../styles/ShareLinkNotice.css';

const MESSAGES = {
  project: 'This project link is no longer available. Showing all projects.',
  timeline: 'This timeline link is no longer available. Showing experience & education.',
};

const ShareLinkNotice = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const onNotFound = (event) => {
      const kind = event.detail?.kind;
      setMessage(MESSAGES[kind] || 'This shared link is no longer available.');
      window.setTimeout(() => setMessage(null), 4500);
    };

    window.addEventListener(SHARE_NOT_FOUND_EVENT, onNotFound);
    return () => window.removeEventListener(SHARE_NOT_FOUND_EVENT, onNotFound);
  }, []);

  if (!message) return null;

  return (
    <div className="share-link-notice" role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default ShareLinkNotice;
