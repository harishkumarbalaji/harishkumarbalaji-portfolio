import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import SocialLinks from './SocialLinks';
import '../styles/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactData, setContactData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  useEffect(() => {
    fetch('/portfolioData.json')
      .then((res) => res.json())
      .then((data) => {
        setContactData(data.contact);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const result = await emailjs.send(
        'service_5xf2rfu',
        'template_9ou4pad',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          subject: `[PORTFOLIO] New message from ${formData.name}`,
          to_name: 'Harish Kumar Balaji',
        },
        '4O35J-M4xAcLgDqIv'
      );

      console.log('SUCCESS!', result.status, result.text);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.log('FAILED...', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailClick = (email) => {
    // Open email client
    window.open(`mailto:${email}`, '_blank');
    
    // Copy to clipboard
    navigator.clipboard.writeText(email).then(() => {
      // You could add a toast notification here
      console.log('Email copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy email: ', err);
    });
  };

  const handlePhoneClick = (phone) => {
    // Copy to clipboard
    navigator.clipboard.writeText(phone).then(() => {
      // You could add a toast notification here
      console.log('Phone number copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy phone number: ', err);
    });
  };

  const getIconSvg = (iconType) => {
    switch (iconType) {
      case 'email':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        );
      case 'phone':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'github':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (!contactData) return null;

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">{contactData.title}</h2>
        <div className="contact-content">
          <div className="contact-info">
            <h3>{contactData.subtitle}</h3>
            <p>{contactData.description}</p>
            
            <div className="contact-details">
              {contactData.details.map((detail, index) => (
                <div key={index} className="contact-item">
                  <span className={`contact-icon ${detail.icon}-icon`}>
                    {getIconSvg(detail.icon)}
                  </span>
                  <div>
                    <h4>{detail.label}</h4>
                    {detail.icon === 'email' ? (
                      <p>
                        <button 
                          className="contact-link"
                          onClick={() => handleEmailClick(detail.value)}
                          title="Click to open email client and copy email"
                        >
                          {detail.value}
                        </button>
                      </p>
                    ) : detail.icon === 'phone' ? (
                      <p>
                        <button 
                          className="contact-link"
                          onClick={() => handlePhoneClick(detail.value)}
                          title="Click to copy phone number"
                        >
                          {detail.value}
                        </button>
                      </p>
                    ) : detail.url ? (
                      <p><a href={detail.url} target="_blank" rel="noopener noreferrer">{detail.value}</a></p>
                    ) : (
                      <p>{detail.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {contactData.form.fields.map((field, index) => (
              <div key={index} className="form-group">
                <label htmlFor={field.name}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    rows={field.rows}
                    required={field.required}
                  ></textarea>
                ) : (
                  <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  />
                )}
              </div>
            ))}
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : contactData.form.submitText}
            </button>
            
            {submitStatus === 'success' && (
              <div className="success-message">
                <p>Thank you! Your message has been sent successfully.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="error-message">
                <p>Sorry, there was an error sending your message. Please try again.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact; 