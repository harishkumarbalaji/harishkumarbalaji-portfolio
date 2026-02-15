import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../styles/ResumeModal.css';

const ResumeModal = ({ resumeUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('resume-modal-backdrop')) {
      onClose();
    }
  };

  // Helper function to extract Google Drive file ID and generate URLs
  const getGoogleDriveUrls = (url) => {
    if (!url) return null;

    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        const fileId = match[1];
        return {
          viewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
          originalUrl: `https://drive.google.com/file/d/${fileId}/view`,
          fileId,
        };
      }
    }

    return null;
  };

  const driveUrls = getGoogleDriveUrls(resumeUrl);
  const isGoogleDrive = !!driveUrls;

  const handleDownload = () => {
    if (isGoogleDrive) {
      window.open(driveUrls.downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      // For local files
      const link = document.createElement('a');
      link.href = `${import.meta.env.BASE_URL}${resumeUrl.replace(/^\//, '')}`;
      link.download = resumeUrl.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenOriginal = () => {
    if (isGoogleDrive) {
      window.open(driveUrls.originalUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`${import.meta.env.BASE_URL}${resumeUrl.replace(/^\//, '')}`, '_blank');
    }
  };

  const modalContent = (
    <div className="resume-modal-backdrop" onClick={handleBackdropClick}>
      <div className="resume-modal-container">
        <button className="resume-modal-close" onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="resume-modal-content">
          {isGoogleDrive ? (
            <iframe
              src={driveUrls.viewUrl}
              title="Resume Preview"
              className="resume-modal-iframe"
              allow="autoplay"
            />
          ) : (
            <iframe
              src={`${import.meta.env.BASE_URL}${resumeUrl.replace(/^\//, '')}`}
              title="Resume Preview"
              className="resume-modal-iframe"
            />
          )}
        </div>

        <div className="resume-modal-footer">
          <div className="resume-modal-title">Resume</div>
        </div>

        <div className="resume-modal-actions">
          <button
            onClick={handleOpenOriginal}
            className="resume-modal-action-btn resume-modal-open-btn"
          >
            Open Original →
          </button>
          <button
            onClick={handleDownload}
            className="resume-modal-action-btn resume-modal-download-btn"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document.body level to avoid CSS containing block issues
  return createPortal(modalContent, document.body);
};

export default ResumeModal;
