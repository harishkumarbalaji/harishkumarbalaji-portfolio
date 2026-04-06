import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import '../styles/Projects.css';

const mapExplicitType = (type, url) => {
  const t = String(type || '').toLowerCase();
  if (t === 'google_slides' || t === 'slides') return 'slides';
  if (t === 'linkedin_post' || t === 'linkedin') return 'linkedin';
  if (t === 'google_drive_video' || t === 'google_drive') return 'gdrive';
  if (t === 'youtube' || t === 'yt') return 'youtube';
  if (t === 'local_path' || t === 'local') {
    const lower = (url || '').toLowerCase();
    const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    const videoExts = ['.mp4', '.webm', '.ogv', '.mov'];
    if (imgExts.some((ext) => lower.includes(ext))) return 'image';
    if (videoExts.some((ext) => lower.includes(ext))) return 'video';
    return 'link';
  }
  if (t === 'image' || t === 'video' || t === 'link') return t;
  return null;
};

const detectMedia = (item) => {
  const { url = '', type } = item || {};
  const explicit = mapExplicitType(type, url);
  if (explicit) return explicit;
  const lower = (url || '').toLowerCase();
  if (
    lower.includes('youtube.com/watch?v=') ||
    lower.includes('youtu.be/') ||
    lower.includes('youtube.com/playlist')
  )
    return 'youtube';
  if (lower.includes('drive.google.com')) return 'gdrive';
  if (lower.includes('docs.google.com/presentation')) return 'slides';
  if (lower.includes('onedrive.live.com') || lower.includes('1drv.ms')) return 'onedrive';
  if (lower.includes('linkedin.com')) return 'linkedin';
  let pathname = '';
  try {
    pathname = new URL(url).pathname.toLowerCase();
  } catch {
    pathname = lower;
  }
  const videoExts = ['.mp4', '.webm', '.ogv', '.mov'];
  if (videoExts.some((ext) => pathname.endsWith(ext) || lower.includes(ext))) return 'video';
  const imgExts = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
  if (imgExts.some((ext) => pathname.endsWith(ext) || lower.includes(ext))) return 'image';
  return 'link';
};

const normalizeUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${import.meta.env.BASE_URL}${url.replace(/^\//, '')}`;
};

const getYouTubeId = (url) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v');
  } catch {
    /* invalid URL */
  }
  return null;
};

const toYouTubeEmbed = (url, { autoplay = 0, mute = 1 } = {}) => {
  if (url.includes('playlist') || url.includes('list=')) {
    try {
      const u = new URL(url);
      const listId = u.searchParams.get('list');
      if (listId) return `https://www.youtube.com/embed/videoseries?list=${listId}`;
    } catch {
      /* invalid URL */
    }
  }
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=${autoplay}&mute=${mute}`;
};

const toGDriveEmbed = (url) => {
  const fileIdMatch = url.match(/\/file\/d\/([^/]+)\/|[?&]id=([^&]+)/);
  const id = fileIdMatch ? fileIdMatch[1] || fileIdMatch[2] : null;
  if (!id) return null;
  return `https://drive.google.com/file/d/${id}/preview`;
};

const toOneDriveEmbed = (url) => {
  if (url.includes('embed')) return url;
  return null;
};

const toSlidesEmbed = (url) => {
  try {
    const u = new URL(url);
    const path = u.pathname;
    if (path.includes('/embed'))
      return `${url}${url.includes('?') ? '&' : '?'}start=true&loop=true&delayms=4000`;
    const pubMatch = path.match(/\/presentation\/d\/e\/([^/]+)/);
    if (pubMatch && pubMatch[1]) {
      return `https://docs.google.com/presentation/d/e/${pubMatch[1]}/embed?start=true&loop=true&delayms=4000`;
    }
    const idMatch = path.match(/\/presentation\/d\/([^/]+)/);
    const id = idMatch ? idMatch[1] : null;
    if (id) {
      return `https://docs.google.com/presentation/d/${id}/embed?start=true&loop=true&delayms=4000`;
    }
  } catch {
    /* invalid URL */
  }
  return null;
};

const toLinkedInEmbed = (url) => {
  try {
    if (url.includes('ugcPost-')) {
      const match = url.match(/ugcPost-(\d+)/);
      if (match) return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${match[1]}`;
    }
    if (url.includes('activity-')) {
      const match = url.match(/activity-(\d+)/);
      if (match) return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${match[1]}`;
    }
    const u = new URL(url);
    const pathname = u.pathname;
    if (pathname.includes('/activity/')) {
      const m = pathname.match(/\/activity\/(\d+)/);
      if (m && m[1]) return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${m[1]}`;
    }
    const urnIdx = url.indexOf('urn:li:');
    if (urnIdx !== -1) {
      const urn = url.slice(urnIdx).split(/[?&#\s]/)[0];
      return `https://www.linkedin.com/embed/feed/update/${urn}`;
    }
  } catch {
    /* invalid URL */
  }
  return null;
};

const truncate = (text, max = 220) => {
  if (!text) return { text: '', isTruncated: false };
  if (text.length <= max) return { text, isTruncated: false };
  return { text: text.slice(0, max).trim() + '…', isTruncated: true };
};

const getCoverImage = (project) => {
  const gallery = project.gallery || [];
  for (let i = 0; i < gallery.length; i++) {
    const item = gallery[i];
    const kind = detectMedia(item);
    if (kind === 'image') return { type: 'image', src: normalizeUrl(item.url), coverIndex: i };
    if (kind === 'youtube') {
      const embedUrl = toYouTubeEmbed(item.url, { autoplay: 0, mute: 1 });
      if (embedUrl) return { type: 'youtube-embed', embedUrl, url: item.url, coverIndex: i };
    }
    if (kind === 'video') return { type: 'video', src: normalizeUrl(item.url), coverIndex: i };
    if (kind === 'slides') {
      const embedUrl = toSlidesEmbed(item.url);
      if (embedUrl) return { type: 'slides', embedUrl, url: item.url, coverIndex: i };
    }
  }
  return null;
};

const MediaItem = ({ item, onOpenModal }) => {
  const kind = useMemo(() => detectMedia(item), [item]);
  const url = item?.url || '';
  const title = item?.title || 'Media';

  const handleClick = (e) => {
    if (e.target.tagName === 'A') return;
    if (onOpenModal && kind !== 'link') onOpenModal(item, kind);
  };

  if (kind === 'image') {
    return (
      <div className="media-item clickable" onClick={handleClick}>
        <div className="media-expand-hint">Tap to expand</div>
        <img className="media-thumb" src={normalizeUrl(url)} alt={title} loading="lazy" />
        {title && <div className="media-title">{title}</div>}
      </div>
    );
  }

  if (kind === 'youtube') {
    const embed = toYouTubeEmbed(url, { autoplay: 0, mute: 1 });
    return embed ? (
      <div className="media-item media-iframe clickable">
        <div className="media-click-overlay" onClick={handleClick}>
          <div className="media-expand-hint">Tap to expand</div>
        </div>
        <iframe
          src={embed}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        {title && <div className="media-title">{title}</div>}
      </div>
    ) : null;
  }

  if (kind === 'gdrive') {
    const embed = toGDriveEmbed(url);
    return embed ? (
      <div className="media-item media-iframe clickable">
        <div className="media-click-overlay" onClick={handleClick}>
          <div className="media-expand-hint">Tap to expand</div>
        </div>
        <iframe
          src={embed}
          title={title}
          loading="lazy"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        {title && <div className="media-title">{title}</div>}
      </div>
    ) : (
      <div className="media-item">
        <a className="media-link" href={url} target="_blank" rel="noopener noreferrer">
          View on Google Drive
        </a>
        {title && <div className="media-title">{title}</div>}
      </div>
    );
  }

  if (kind === 'onedrive') {
    const embed = toOneDriveEmbed(url);
    return embed ? (
      <div className="media-item media-iframe clickable">
        <div className="media-click-overlay" onClick={handleClick}>
          <div className="media-expand-hint">Tap to expand</div>
        </div>
        <iframe src={embed} title={title} loading="lazy" allowFullScreen />
        {title && <div className="media-title">{title}</div>}
      </div>
    ) : (
      <div className="media-item">
        <a className="media-link" href={url} target="_blank" rel="noopener noreferrer">
          View on OneDrive
        </a>
        {title && <div className="media-title">{title}</div>}
      </div>
    );
  }

  if (kind === 'video') {
    return (
      <div className="media-item clickable">
        <div className="media-click-overlay" onClick={handleClick}>
          <div className="media-expand-hint">Tap to expand</div>
        </div>
        <video
          className="media-video"
          src={normalizeUrl(url)}
          muted
          playsInline
          controls
          preload="metadata"
        />
        {title && <div className="media-title">{title}</div>}
      </div>
    );
  }

  if (kind === 'linkedin') {
    const embed = toLinkedInEmbed(url);
    return embed ? (
      <div className="media-item media-iframe clickable">
        <div className="media-click-overlay" onClick={handleClick}>
          <div className="media-expand-hint">Tap to expand</div>
        </div>
        <a
          className="media-open-overlay"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title}`}
          onClick={(e) => e.stopPropagation()}
        >
          Open
        </a>
        <iframe
          src={embed}
          title={title}
          loading="lazy"
          allow="encrypted-media; clipboard-write"
          allowFullScreen
        />
        {title && <div className="media-title">{title}</div>}
      </div>
    ) : (
      <div className="media-item">
        <a className="media-link" href={url} target="_blank" rel="noopener noreferrer">
          View on LinkedIn
        </a>
        {title && <div className="media-title">{title}</div>}
      </div>
    );
  }

  if (kind === 'slides') {
    const embed = toSlidesEmbed(url);
    return embed ? (
      <div className="media-item media-iframe slides clickable">
        <div className="media-click-overlay" onClick={handleClick}>
          <div className="media-expand-hint">Tap to expand</div>
        </div>
        <a
          className="media-open-overlay"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title}`}
          onClick={(e) => e.stopPropagation()}
        >
          Open
        </a>
        <iframe src={embed} title={title} loading="lazy" allowFullScreen />
        {title && <div className="media-title">{title}</div>}
      </div>
    ) : (
      <div className="media-item">
        <a className="media-link" href={url} target="_blank" rel="noopener noreferrer">
          Open Slides
        </a>
        {title && <div className="media-title">{title}</div>}
      </div>
    );
  }

  let domain = '';
  try {
    domain = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    domain = url;
  }
  const favicon = domain ? `https://icons.duckduckgo.com/ip3/${domain}.ico` : '';
  return (
    <div className="media-item link-card">
      <div className="link-card-top">
        {favicon ? (
          <img
            className="link-favicon"
            src={favicon}
            alt=""
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        ) : null}
        <span className="link-domain" title={domain}>
          {domain}
        </span>
      </div>
      <div className="link-card-title" title={title}>
        {title || domain}
      </div>
      <div className="link-card-actions">
        <a className="media-link" href={url} target="_blank" rel="noopener noreferrer">
          Open
        </a>
      </div>
    </div>
  );
};

const MediaModal = ({ item, type, gallery, currentIndex, onClose, onNavigate }) => {
  const hasMultiple = gallery && gallery.length > 1;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (hasMultiple) {
        if (e.key === 'ArrowLeft') onNavigate(-1);
        if (e.key === 'ArrowRight') onNavigate(1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNavigate, hasMultiple]);

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('media-modal-backdrop')) onClose();
  };

  const renderModalContent = () => {
    const url = item?.url || '';
    switch (type) {
      case 'image':
        return (
          <img src={normalizeUrl(url)} alt={item?.title || 'Media'} className="modal-media-image" />
        );
      case 'youtube':
        return (
          <iframe
            src={toYouTubeEmbed(url, { autoplay: 1, mute: 0 })}
            title={item?.title || 'YouTube Video'}
            className="modal-media-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      case 'gdrive':
        return (
          <iframe
            src={toGDriveEmbed(url)}
            title={item?.title || 'Google Drive'}
            className="modal-media-iframe"
            allow="autoplay"
            allowFullScreen
          />
        );
      case 'onedrive':
        return (
          <iframe
            src={toOneDriveEmbed(url)}
            title={item?.title || 'OneDrive'}
            className="modal-media-iframe"
            allowFullScreen
          />
        );
      case 'video':
        return (
          <video src={normalizeUrl(url)} controls autoPlay className="modal-media-video">
            Your browser does not support the video tag.
          </video>
        );
      case 'linkedin':
        return (
          <iframe
            src={toLinkedInEmbed(url)}
            title={item?.title || 'LinkedIn Post'}
            className="modal-media-iframe linkedin"
            allowFullScreen
          />
        );
      case 'slides':
        return (
          <iframe
            src={toSlidesEmbed(url)}
            title={item?.title || 'Google Slides'}
            className="modal-media-iframe slides"
            allowFullScreen
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="media-modal-backdrop" onClick={handleBackdropClick}>
      <div className="media-modal-container">
        <button className="media-modal-close" onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        {hasMultiple && (
          <button
            className="media-modal-nav media-modal-nav-left"
            onClick={() => onNavigate(-1)}
            aria-label="Previous media"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="media-modal-content">{renderModalContent()}</div>
        {hasMultiple && (
          <button
            className="media-modal-nav media-modal-nav-right"
            onClick={() => onNavigate(1)}
            aria-label="Next media"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
        <div className="media-modal-footer">
          {item?.title && <div className="media-modal-title">{item.title}</div>}
          {hasMultiple && (
            <div className="media-modal-counter">
              {currentIndex + 1} / {gallery.length}
            </div>
          )}
        </div>
        <div className="media-modal-actions">
          <a
            href={normalizeUrl(item?.url || '')}
            target="_blank"
            rel="noopener noreferrer"
            className="media-modal-open-link"
          >
            Open Original →
          </a>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [sectionTitle, setSectionTitle] = useState('');
  const [expanded, setExpanded] = useState({});
  const [modalMedia, setModalMedia] = useState(null);
  const cardsRef = useRef([]);

  const openModal = useCallback((item, type, gallery = [], index = 0) => {
    setModalMedia({ item, type, gallery, index });
  }, []);

  const closeModal = useCallback(() => {
    setModalMedia(null);
  }, []);

  const navigateModal = useCallback((direction) => {
    setModalMedia((prev) => {
      if (!prev?.gallery || prev.gallery.length <= 1) return prev;
      const { gallery, index } = prev;
      let newIndex = index + direction;
      if (newIndex < 0) newIndex = gallery.length - 1;
      if (newIndex >= gallery.length) newIndex = 0;
      const newItem = gallery[newIndex];
      return {
        item: newItem,
        type: detectMedia(newItem),
        gallery,
        index: newIndex,
      };
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const sorted = [...(data.projects || [])].sort((a, b) => {
          const yearA = parseInt(a.year?.match(/\d{4}/)?.[0] || '0');
          const yearB = parseInt(b.year?.match(/\d{4}/)?.[0] || '0');
          return yearB - yearA;
        });
        setProjects(sorted);
        setSectionTitle(data.sections?.projects?.title ?? '');
      })
      .catch(() => {
        if (!cancelled) {
          setProjects([]);
          setSectionTitle('');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    cardsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [projects]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="projects" className="projects-section">
      <div className="projects-header">
        <h2>{sectionTitle}</h2>
        <p>Key projects and achievements</p>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => {
          const { text: shortDesc, isTruncated } = truncate(project.description, 220);
          const isOpen = !!expanded[project.id];
          const showDesc = isOpen ? project.description : shortDesc;
          const hasGallery = Array.isArray(project.gallery) && project.gallery.length > 0;
          const galleryItems = hasGallery ? project.gallery : [];
          const cover = getCoverImage(project);
          const galleryStripEntries =
            cover && galleryItems.length > 1
              ? galleryItems
                  .map((gItem, idx) => ({ item: gItem, galleryIndex: idx }))
                  .filter(({ galleryIndex }) => galleryIndex !== cover.coverIndex)
              : galleryItems.map((gItem, idx) => ({ item: gItem, galleryIndex: idx }));
          const showGalleryStrip =
            hasGallery && galleryStripEntries.length > 0 && !(galleryItems.length === 1 && cover);

          const coverGalleryItem = cover ? galleryItems[cover.coverIndex] : null;
          const coverMediaTitle =
            (coverGalleryItem?.title && String(coverGalleryItem.title).trim()) || '';

          return (
            <div
              key={project.id}
              className={`project-card ${!cover ? 'no-cover' : ''}`}
              ref={(el) => (cardsRef.current[index] = el)}
              style={{ '--card-index': index }}
            >
              {/* Cover left, title + details right (opposite of Experience timeline layout) */}
              <div className="project-card-main">
                {cover && (
                  <div className="project-card-cover">
                    <div className="project-card-cover-visual">
                      {cover.type === 'image' && (
                        <img src={cover.src} alt={project.title} loading="lazy" />
                      )}
                      {cover.type === 'youtube-embed' && (
                        <div
                          className="cover-youtube-embed-wrap"
                          onClick={() =>
                            openModal(
                              galleryItems[cover.coverIndex],
                              'youtube',
                              galleryItems,
                              cover.coverIndex
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openModal(
                                galleryItems[cover.coverIndex],
                                'youtube',
                                galleryItems,
                                cover.coverIndex
                              );
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={
                            coverMediaTitle
                              ? `Expand: ${coverMediaTitle}`
                              : `Expand ${project.title} video`
                          }
                        >
                          <div className="media-click-overlay" aria-hidden />
                          <div className="media-expand-hint">Tap to expand</div>
                          <iframe
                            src={cover.embedUrl}
                            title={coverMediaTitle || project.title}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      )}
                      {cover.type === 'video' && (
                        <video src={cover.src} muted playsInline preload="metadata" controls />
                      )}
                      {cover.type === 'slides' && (
                        <div
                          className="cover-slides-wrap"
                          onClick={() =>
                            openModal(
                              galleryItems[cover.coverIndex],
                              'slides',
                              galleryItems,
                              cover.coverIndex
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openModal(
                                galleryItems[cover.coverIndex],
                                'slides',
                                galleryItems,
                                cover.coverIndex
                              );
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={
                            coverMediaTitle
                              ? `Expand: ${coverMediaTitle}`
                              : `Expand ${project.title} slides`
                          }
                        >
                          <div className="media-click-overlay" aria-hidden />
                          <div className="media-expand-hint">Tap to expand</div>
                          <iframe
                            src={cover.embedUrl}
                            title={coverMediaTitle || project.title}
                            loading="lazy"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                    {coverMediaTitle ? (
                      <div className="media-title project-card-cover-title">{coverMediaTitle}</div>
                    ) : null}
                  </div>
                )}

                <div className="project-card-content">
                  <div className="project-card-header">
                    <div className="project-card-header-left">
                      <h3 className="project-card-title">{project.title}</h3>
                      <div className="project-card-meta">
                        <span className="project-card-category">{project.category}</span>
                        <span className="project-card-year">{project.year}</span>
                      </div>
                    </div>
                    <div className="project-card-links">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn github"
                          title="View Code"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>
                      )}
                      {project.live && project.live !== '#' && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link-btn live"
                          title="View Demo"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="project-card-description">{showDesc}</p>
                  {isTruncated && (
                    <button className="view-toggle" onClick={() => toggleExpand(project.id)}>
                      {isOpen ? 'View less' : 'View more'}
                    </button>
                  )}

                  <div className="project-card-technologies">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="project-tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.highlights && project.highlights.length > 0 && (
                    <div className="project-card-highlights">
                      {project.highlights.map((h, i) => (
                        <span key={i} className="project-highlight-badge">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery strip (hidden when a single item is already the cover) */}
              {showGalleryStrip && (
                <div className="project-card-gallery">
                  {galleryStripEntries.map(({ item: stripItem, galleryIndex }) => (
                    <MediaItem
                      key={`${project.id}-g-${galleryIndex}`}
                      item={stripItem}
                      onOpenModal={(mediaItem, type) =>
                        openModal(mediaItem, type, galleryItems, galleryIndex)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modalMedia && (
        <MediaModal
          item={modalMedia.item}
          type={modalMedia.type}
          gallery={modalMedia.gallery}
          currentIndex={modalMedia.index}
          onClose={closeModal}
          onNavigate={navigateModal}
        />
      )}
    </section>
  );
};

export default Projects;
