import { useEffect, useState, useCallback } from 'react';
import '../styles/Timeline.css';

// Media type detection helpers (same as Projects)
const getMediaType = (url) => {
  if (!url) return 'unknown';
  const lower = url.toLowerCase();
  
  // Image extensions
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
  
  // YouTube
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  
  // Google Drive
  if (lower.includes('drive.google.com')) return 'gdrive';
  
  // OneDrive
  if (lower.includes('onedrive.live.com') || lower.includes('1drv.ms')) return 'onedrive';
  
  // Direct video
  if (lower.match(/\.(mp4|webm|ogg|mov)$/)) return 'video';
  
  // LinkedIn
  if (lower.includes('linkedin.com')) return 'linkedin';
  
  // Google Slides
  if (lower.includes('docs.google.com/presentation')) return 'slides';
  
  return 'link';
};

const toYouTubeEmbed = (url) => {
  // Handle playlists
  if (url.includes('playlist')) {
    const match = url.match(/list=([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/videoseries?list=${match[1]}`;
  }
  // Handle regular videos
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
  } else if (url.includes('v=')) {
    videoId = url.split('v=')[1]?.split(/[&?]/)[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const toGoogleDriveEmbed = (url) => {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  return url;
};

const toOneDriveEmbed = (url) => {
  return url.replace('view.aspx', 'embed');
};

const toLinkedInEmbed = (url) => {
  // Extract post/activity ID from LinkedIn URL
  
  // Handle ugcPost format
  if (url.includes('ugcPost-')) {
    const match = url.match(/ugcPost-(\d+)/);
    if (match) {
      return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${match[1]}`;
    }
  }
  
  // Handle activity format (activity-XXXXX)
  if (url.includes('activity-')) {
    const match = url.match(/activity-(\d+)/);
    if (match) {
      return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${match[1]}`;
    }
  }
  
  // Handle /posts/ format - try to find activity or ugcPost ID in the slug
  if (url.includes('/posts/')) {
    const lastSeg = url.split('/posts/').pop()?.split('?')[0] || '';
    // Check for activity ID pattern
    const activityMatch = lastSeg.match(/activity-(\d+)/);
    if (activityMatch) {
      return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityMatch[1]}`;
    }
    // Check for ugcPost ID pattern
    const ugcMatch = lastSeg.match(/ugcPost-(\d+)/);
    if (ugcMatch) {
      return `https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:${ugcMatch[1]}`;
    }
  }
  
  return null;
};

const toSlidesEmbed = (url) => {
  // Convert Google Slides URL to embed format with auto-play and loop
  return url.replace('/edit', '/embed').replace(/\?.*$/, '') + '?start=true&loop=true&delayms=4000';
};

// MediaItem component for gallery
const MediaItem = ({ item, originalUrl, onOpenModal }) => {
  const type = item.type || getMediaType(item.url);
  
  const handleClick = (e) => {
    // Don't trigger modal for external link clicks
    if (e.target.tagName === 'A') return;
    if (onOpenModal) onOpenModal(item, type);
  };
  
  switch (type) {
    case 'image':
      return (
        <div className="timeline-media-item clickable" onClick={handleClick}>
          <div className="media-expand-hint">Click to expand</div>
          <img src={item.url} alt={item.title || 'Media'} className="timeline-media-thumb" />
          {item.title && <div className="timeline-media-title">{item.title}</div>}
        </div>
      );
    
    case 'youtube':
      return (
        <div className="timeline-media-item clickable">
          <div className="media-click-overlay" onClick={handleClick}>
            <div className="media-expand-hint">Click to expand</div>
          </div>
          <iframe
            src={toYouTubeEmbed(item.url)}
            title={item.title || 'YouTube Video'}
            className="timeline-media-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          {item.title && <div className="timeline-media-title">{item.title}</div>}
        </div>
      );
    
    case 'gdrive':
      return (
        <div className="timeline-media-item clickable">
          <div className="media-click-overlay" onClick={handleClick}>
            <div className="media-expand-hint">Click to expand</div>
          </div>
          <iframe
            src={toGoogleDriveEmbed(item.url)}
            title={item.title || 'Google Drive'}
            className="timeline-media-iframe"
            allow="autoplay"
            allowFullScreen
          />
          {item.title && <div className="timeline-media-title">{item.title}</div>}
        </div>
      );
    
    case 'onedrive':
      return (
        <div className="timeline-media-item clickable">
          <div className="media-click-overlay" onClick={handleClick}>
            <div className="media-expand-hint">Click to expand</div>
          </div>
          <iframe
            src={toOneDriveEmbed(item.url)}
            title={item.title || 'OneDrive'}
            className="timeline-media-iframe"
            allowFullScreen
          />
          {item.title && <div className="timeline-media-title">{item.title}</div>}
        </div>
      );
    
    case 'video':
      return (
        <div className="timeline-media-item clickable">
          <div className="media-click-overlay" onClick={handleClick}>
            <div className="media-expand-hint">Click to expand</div>
          </div>
          <video src={item.url} controls className="timeline-media-video">
            Your browser does not support the video tag.
          </video>
          {item.title && <div className="timeline-media-title">{item.title}</div>}
        </div>
      );
    
    case 'linkedin':
      return (
        <div className="timeline-media-item timeline-media-linkedin clickable">
          <div className="media-click-overlay" onClick={handleClick}>
            <div className="media-expand-hint">Click to expand</div>
          </div>
          <iframe
            src={toLinkedInEmbed(item.url)}
            title={item.title || 'LinkedIn Post'}
            className="timeline-media-iframe linkedin"
            allowFullScreen
          />
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="timeline-media-open-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            Open in LinkedIn
          </a>
          {item.title && <div className="timeline-media-title">{item.title}</div>}
        </div>
      );
    
    case 'slides':
      return (
        <div className="timeline-media-item timeline-media-slides clickable">
          <div className="media-click-overlay" onClick={handleClick}>
            <div className="media-expand-hint">Click to expand</div>
          </div>
          <iframe
            src={toSlidesEmbed(item.url)}
            title={item.title || 'Google Slides'}
            className="timeline-media-iframe slides"
            allowFullScreen
          />
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="timeline-media-open-overlay"
            onClick={(e) => e.stopPropagation()}
          >
            Open in Slides
          </a>
          {item.title && <div className="timeline-media-title">{item.title}</div>}
        </div>
      );
    
    case 'link':
    default:
      // Render a styled link card instead of iframe preview
      const getDomain = (url) => {
        try {
          return new URL(url).hostname.replace('www.', '');
        } catch {
          return 'External Link';
        }
      };
      
      const getFavicon = (url) => {
        try {
          const domain = new URL(url).hostname;
          return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
          return null;
        }
      };
      
      return (
        <div className="timeline-media-item">
          <div className="timeline-link-card">
            <div className="timeline-link-card-content">
              <div className="timeline-link-card-header">
                {getFavicon(item.url) && (
                  <img 
                    src={getFavicon(item.url)} 
                    alt="" 
                    className="timeline-link-card-favicon"
                  />
                )}
                <span className="timeline-link-card-domain">{getDomain(item.url)}</span>
              </div>
              <div className="timeline-link-card-title">{item.title || 'External Link'}</div>
              <div className="timeline-link-card-actions">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timeline-link-card-btn"
                >
                  Open Link →
                </a>
              </div>
            </div>
          </div>
        </div>
      );
  }
};

// Modal component for expanded media view with navigation
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
    if (e.target.classList.contains('media-modal-backdrop')) {
      onClose();
    }
  };

  const renderModalContent = () => {
    switch (type) {
      case 'image':
        return <img src={item.url} alt={item.title || 'Media'} className="modal-media-image" />;
      
      case 'youtube':
        return (
          <iframe
            src={toYouTubeEmbed(item.url)}
            title={item.title || 'YouTube Video'}
            className="modal-media-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      
      case 'gdrive':
        return (
          <iframe
            src={toGoogleDriveEmbed(item.url)}
            title={item.title || 'Google Drive'}
            className="modal-media-iframe"
            allow="autoplay"
            allowFullScreen
          />
        );
      
      case 'onedrive':
        return (
          <iframe
            src={toOneDriveEmbed(item.url)}
            title={item.title || 'OneDrive'}
            className="modal-media-iframe"
            allowFullScreen
          />
        );
      
      case 'video':
        return (
          <video src={item.url} controls autoPlay className="modal-media-video">
            Your browser does not support the video tag.
          </video>
        );
      
      case 'linkedin':
        return (
          <iframe
            src={toLinkedInEmbed(item.url)}
            title={item.title || 'LinkedIn Post'}
            className="modal-media-iframe linkedin"
            allowFullScreen
          />
        );
      
      case 'slides':
        return (
          <iframe
            src={toSlidesEmbed(item.url)}
            title={item.title || 'Google Slides'}
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
        
        {/* Left navigation arrow */}
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
        
        <div className="media-modal-content">
          {renderModalContent()}
        </div>
        
        {/* Right navigation arrow */}
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
        
        {/* Title and counter */}
        <div className="media-modal-footer">
          {item.title && <div className="media-modal-title">{item.title}</div>}
          {hasMultiple && (
            <div className="media-modal-counter">
              {currentIndex + 1} / {gallery.length}
            </div>
          )}
        </div>
        
        <div className="media-modal-actions">
          <a
            href={item.url}
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

const Timeline = () => {
  const [timelineData, setTimelineData] = useState([]);
  const [activeFilter, setActiveFilter] = useState('experience');
  const [filteredData, setFilteredData] = useState([]);
  const [sectionTitle, setSectionTitle] = useState('');
  const [expanded, setExpanded] = useState({});
  const [modalMedia, setModalMedia] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openModal = useCallback((item, type, gallery = [], index = 0) => {
    setModalMedia({ item, type, gallery, index });
  }, []);

  const closeModal = useCallback(() => {
    setModalMedia(null);
  }, []);

  const navigateModal = useCallback((direction) => {
    if (!modalMedia || !modalMedia.gallery || modalMedia.gallery.length <= 1) return;
    
    const { gallery, index } = modalMedia;
    let newIndex = index + direction;
    
    // Wrap around
    if (newIndex < 0) newIndex = gallery.length - 1;
    if (newIndex >= gallery.length) newIndex = 0;
    
    const newItem = gallery[newIndex];
    const newType = getMediaType(newItem.url);
    
    setModalMedia({ item: newItem, type: newType, gallery, index: newIndex });
  }, [modalMedia]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}portfolioData.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Combine education and experience data
        const educationData = (data.education || []).map((item, idx) => ({ ...item, id: `edu-${idx}`, category: 'education' }));
        const experienceData = (data.experience || []).map((item, idx) => ({ ...item, id: `exp-${idx}`, category: 'experience' }));
        const combined = [...educationData, ...experienceData];
        
        const sorted = combined.sort((a, b) => {
          const yearA = a.year.includes('Present') ? 9999 : parseInt(a.year.match(/\d{4}/g)?.[0] || '0');
          const yearB = b.year.includes('Present') ? 9999 : parseInt(b.year.match(/\d{4}/g)?.[0] || '0');
          return yearB - yearA;
        });
        
        setTimelineData(sorted);
        // Default to showing only experience
        setFilteredData(sorted.filter(item => item.category === 'experience'));
        setSectionTitle(data.sections.timeline.title);
      })
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredData(timelineData);
    } else {
      setFilteredData(timelineData.filter(item => item.category === activeFilter));
    }
  }, [activeFilter, timelineData]);

  const getCompanyLogo = (item) => {
    // Use logo from JSON data if available
    if (item.logo) {
      return `${import.meta.env.BASE_URL}${item.logo.replace(/^\//, '')}`;
    }
    return null;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'experience':
        return 'var(--experience-color, #2196F3)';
      case 'education':
        return 'var(--education-color, #4CAF50)';
      default:
        return 'var(--modern-accent)';
    }
  };

  const truncate = (text, maxLength = 200) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <section id="timeline" className="timeline-container">
      <div className="timeline-header">
        <h2>{sectionTitle}</h2>
        <p>My journey through time</p>
        <div className="timeline-filters">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <span className="filter-icon"></span>
            All
          </button>
          <button
            className={`filter-btn ${activeFilter === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveFilter('experience')}
            >
            <span className="filter-icon"></span>
            Experience
          </button>
          <button
            className={`filter-btn ${activeFilter === 'education' ? 'active' : ''}`}
            onClick={() => setActiveFilter('education')}
          >
            <span className="filter-icon"></span>
            Education
          </button>
        </div>
      </div>

      <div className="timeline-wrapper-modern">
        <div className="timeline-list-modern">
          {filteredData.map((item, idx) => {
            const hasGallery = item.gallery && item.gallery.length > 0;
            const galleryCount = item.gallery?.length || 0;
            const isExpanded = expanded[item.id];
            
            return (
              <div 
                key={item.id} 
                className={`timeline-row-modern ${hasGallery ? '' : 'no-gallery'}`}
                style={{ '--card-index': idx }}
              >
                {/* Content side */}
                <div className="timeline-content-modern">
                  {/* Logo and header */}
                  <div className="timeline-header-row">
                    <div 
                      className="timeline-logo-modern"
                      style={{ background: `linear-gradient(135deg, ${getCategoryColor(item.category)} 0%, var(--accent-secondary) 100%)` }}
                    >
                      {getCompanyLogo(item) ? (
                        <img 
                          src={getCompanyLogo(item)} 
                          alt={`${item.company} logo`}
                          className="timeline-company-logo"
                        />
                      ) : (
                        <span className="timeline-icon-text">{item.icon}</span>
                      )}
                    </div>
                    <div className="timeline-header-info">
                      <h3 className="timeline-title-modern">{item.title}</h3>
                      <div className="timeline-company-modern">
                        {item.website ? (
                          <a href={item.website} target="_blank" rel="noopener noreferrer" className="company-name">
                            {item.company}
                          </a>
                        ) : (
                          <span className="company-name">{item.company}</span>
                        )}
                        <span className="meta-separator">•</span>
                        <span className="location">
                          <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          {item.location}
                        </span>
                      </div>
                      <div className="timeline-year-modern">
                        <svg className="calendar-icon" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                        </svg>
                        {item.year}
                      </div>
                    </div>
                  </div>

                  {/* Technologies */}
                  {item.technologies && item.technologies.length > 0 && (
                    <div className="timeline-technologies-modern">
                      <span className="tech-label">{item.category === 'education' ? 'Focus:' : 'Technologies:'}</span>
                      <div className="tech-tags">
                        {item.technologies.map((tech, i) => (
                          <span key={i} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  {item.details && item.details.length > 0 && (
                    <div className="timeline-details-modern">
                      <ul className={`details-list ${isExpanded ? 'expanded' : ''}`}>
                        {(isExpanded ? item.details : item.details.slice(0, 2)).map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                      {item.details.length > 2 && (
                        <button 
                          className="view-toggle"
                          onClick={() => toggleExpand(item.id)}
                        >
                          {isExpanded ? 'View less' : `View ${item.details.length - 2} more...`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Key Highlights/Keywords */}
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="timeline-highlights-modern">
                      <span className="highlights-label">Highlights:</span>
                      <div className="highlights-tags">
                        {item.highlights.map((highlight, i) => (
                          <span key={i} className="highlight-badge-modern">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery side */}
                {hasGallery && (
                  <div className={`timeline-gallery-modern ${galleryCount === 1 ? 'single-item' : ''} ${galleryCount === 3 ? 'three-items' : ''} ${galleryCount >= 4 ? 'many-items' : ''}`}>
                    {item.gallery.map((media, i) => (
                      <MediaItem 
                        key={i} 
                        item={media} 
                        originalUrl={media.url} 
                        onOpenModal={(mediaItem, type) => openModal(mediaItem, type, item.gallery, i)} 
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Media Modal */}
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

export default Timeline;
