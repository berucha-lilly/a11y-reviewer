// AccessibilityViolations.jsx
// This file demonstrates various accessibility violations in React/JSX

import React, { useState, useEffect, useRef } from 'react';

/**
 * VIOLATION 1: Div used as button without proper ARIA
 */
export const InaccessibleButton = () => {
  return (
    <div onClick={() => alert('Clicked!')}>
      Click me
      {/* Missing: role="button", tabIndex="0", onKeyDown handler */}
    </div>
  );
};

/**
 * VIOLATION 2: Image without alt text
 */
export const ImageWithoutAlt = () => {
  return (
    <div>
      <img src="/logo.png" />
      <img src="/banner.jpg" alt="" />
      {/* Missing: meaningful alt text */}
    </div>
  );
};

/**
 * VIOLATION 3: Form inputs without labels
 */
export const FormWithoutLabels = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  return (
    <form>
      {/* Using placeholder as label - violation */}
      <input 
        type="text" 
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Submit</button>
      {/* Missing: <label> elements or aria-label */}
    </form>
  );
};

/**
 * VIOLATION 4: Modal without focus trap or proper ARIA
 */
export const InaccessibleModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px'
      }}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
      {/* Missing: focus trap, aria-modal, aria-labelledby, escape key handler */}
      {/* Missing: focus management (focus first element on open, return focus on close) */}
    </div>
  );
};

/**
 * VIOLATION 5: Dynamic content updates without announcements
 */
export const SilentContentUpdate = () => {
  const [status, setStatus] = useState('');

  const updateStatus = () => {
    setStatus('Content updated!');
    // Missing: aria-live region for screen reader announcement
  };

  return (
    <div>
      <button onClick={updateStatus}>Update</button>
      <div>{status}</div>
      {/* Should be: <div role="status" aria-live="polite">{status}</div> */}
    </div>
  );
};

/**
 * VIOLATION 6: Custom dropdown without keyboard navigation
 */
export const InaccessibleDropdown = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div onClick={() => setIsOpen(!isOpen)}>
        {selected || 'Select an option'}
      </div>
      {isOpen && (
        <div>
          {options.map((option, index) => (
            <div 
              key={index}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      {/* Missing: ARIA attributes (role, aria-expanded, aria-haspopup) */}
      {/* Missing: keyboard navigation (arrow keys, Enter, Escape) */}
      {/* Missing: focus management */}
    </div>
  );
};

/**
 * VIOLATION 7: Tabs without proper ARIA
 */
export const InaccessibleTabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div>
        {tabs.map((tab, index) => (
          <div 
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              fontWeight: activeTab === index ? 'bold' : 'normal'
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div>
        {tabs[activeTab].content}
      </div>
      {/* Missing: role="tablist", role="tab", role="tabpanel" */}
      {/* Missing: aria-selected, aria-controls, aria-labelledby */}
      {/* Missing: keyboard navigation (arrow keys, Home, End) */}
    </div>
  );
};

/**
 * VIOLATION 8: Auto-playing video without controls
 */
export const AutoPlayVideo = () => {
  return (
    <video 
      src="/video.mp4" 
      autoPlay 
      loop
      // Missing: controls attribute
      // Missing: muted attribute (if autoplay is necessary)
    />
  );
};

/**
 * VIOLATION 9: Tooltip without proper ARIA
 */
export const InaccessibleTooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div style={{
          position: 'absolute',
          backgroundColor: 'black',
          color: 'white',
          padding: '5px'
        }}>
          {text}
        </div>
      )}
      {/* Missing: aria-describedby linking to tooltip */}
      {/* Missing: keyboard access (focus/blur events) */}
      {/* Missing: role="tooltip" on tooltip element */}
    </div>
  );
};

/**
 * VIOLATION 10: Custom checkbox without ARIA
 */
export const InaccessibleCheckbox = ({ label, onChange }) => {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked(!checked);
    onChange?.(!checked);
  };

  return (
    <div onClick={handleClick}>
      <div style={{
        width: '20px',
        height: '20px',
        border: '1px solid black',
        backgroundColor: checked ? 'blue' : 'white'
      }} />
      <span>{label}</span>
      {/* Missing: role="checkbox" */}
      {/* Missing: aria-checked */}
      {/* Missing: tabIndex="0" */}
      {/* Missing: keyboard support (Space key) */}
      {/* Missing: proper label association */}
    </div>
  );
};

/**
 * VIOLATION 11: Alert without ARIA live region
 */
export const InaccessibleAlert = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '10px',
      backgroundColor: type === 'error' ? 'red' : 'blue',
      color: 'white'
    }}>
      {message}
      {/* Missing: role="alert" or aria-live="assertive" */}
      {/* Missing: aria-atomic="true" */}
    </div>
  );
};

/**
 * VIOLATION 12: Accordion without proper ARIA
 */
export const InaccessibleAccordion = ({ sections }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {sections.map((section, index) => (
        <div key={index}>
          <div onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            {section.title}
          </div>
          {openIndex === index && (
            <div>{section.content}</div>
          )}
        </div>
      ))}
      {/* Missing: role="button" on headers */}
      {/* Missing: aria-expanded */}
      {/* Missing: aria-controls */}
      {/* Missing: keyboard support */}
    </div>
  );
};

/**
 * VIOLATION 13: Carousel without accessibility features
 */
export const InaccessibleCarousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div>
      <div>{slides[currentSlide]}</div>
      {/* Missing: pause button */}
      {/* Missing: keyboard controls */}
      {/* Missing: aria-live for announcements */}
      {/* Missing: slide indicators */}
      {/* Missing: focus management */}
    </div>
  );
};

/**
 * VIOLATION 14: Loading spinner without announcement
 */
export const InaccessibleSpinner = () => {
  return (
    <div style={{ animation: 'spin 1s linear infinite' }}>
      ⟳
      {/* Missing: role="status" or aria-live */}
      {/* Missing: text alternative like "Loading..." */}
      {/* Missing: aria-label */}
    </div>
  );
};

/**
 * VIOLATION 15: Progress bar without ARIA
 */
export const InaccessibleProgressBar = ({ percent }) => {
  return (
    <div style={{ width: '100%', backgroundColor: '#ddd' }}>
      <div style={{ 
        width: `${percent}%`, 
        backgroundColor: 'blue',
        height: '20px'
      }} />
      {/* Missing: role="progressbar" */}
      {/* Missing: aria-valuenow, aria-valuemin, aria-valuemax */}
      {/* Missing: aria-label */}
    </div>
  );
};

/**
 * VIOLATION 16: Click handler without keyboard support
 */
export const ClickOnlyElement = ({ onClick, children }) => {
  return (
    <div onClick={onClick}>
      {children}
      {/* Missing: onKeyDown handler for Enter/Space */}
      {/* Missing: tabIndex="0" */}
      {/* Missing: role attribute */}
    </div>
  );
};

/**
 * VIOLATION 17: Removing focus outline
 */
export const NoFocusOutline = () => {
  return (
    <div>
      <button style={{ outline: 'none' }}>Button 1</button>
      <a href="#" style={{ outline: 'none' }}>Link</a>
      {/* Removing focus indicators is a major accessibility violation */}
    </div>
  );
};

/**
 * VIOLATION 18: Positive tabIndex
 */
export const ConfusingTabOrder = () => {
  return (
    <div>
      <button tabIndex={5}>Button 1</button>
      <button tabIndex={3}>Button 2</button>
      <button tabIndex={1}>Button 3</button>
      {/* Positive tabIndex disrupts natural tab order */}
    </div>
  );
};

/**
 * VIOLATION 19: Color-only information
 */
export const ColorOnlyInfo = () => {
  return (
    <form>
      <p>Fields in <span style={{ color: 'red' }}>red</span> are required</p>
      <input type="text" style={{ borderColor: 'red' }} />
      <input type="text" />
      {/* Missing: non-color indicators like asterisks or "required" text */}
    </form>
  );
};

/**
 * VIOLATION 20: Low contrast text
 */
export const LowContrastText = () => {
  return (
    <div>
      <p style={{ color: '#aaa', backgroundColor: '#fff' }}>
        This text has poor contrast
      </p>
      <p style={{ color: '#777', backgroundColor: '#999' }}>
        This also fails WCAG contrast requirements
      </p>
    </div>
  );
};

/**
 * VIOLATION 21: Drag and drop without keyboard alternative
 */
export const InaccessibleDragDrop = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = parseInt(e.dataTransfer.getData('index'));
    const newItems = [...items];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, removed);
    setItems(newItems);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={index}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={(e) => e.preventDefault()}
        >
          {item}
        </div>
      ))}
      {/* Missing: keyboard alternative (arrow keys + modifier) */}
      {/* Missing: ARIA attributes (aria-grabbed, aria-dropeffect) */}
      {/* Missing: instructions for screen reader users */}
    </div>
  );
};

/**
 * VIOLATION 22: Infinite scroll without keyboard access
 */
export const InaccessibleInfiniteScroll = () => {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        if (!loading) {
          setLoading(true);
          setTimeout(() => {
            setItems(prev => [...prev, ...Array.from({ length: 20 }, (_, i) => prev.length + i)]);
            setLoading(false);
          }, 1000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  return (
    <div>
      {items.map(item => (
        <div key={item}>Item {item}</div>
      ))}
      {loading && <div>Loading...</div>}
      {/* Missing: keyboard alternative */}
      {/* Missing: "Load more" button option */}
      {/* Missing: focus management */}
      {/* Missing: announcement when new items load */}
    </div>
  );
};

/**
 * VIOLATION 23: Skip link missing
 */
export const PageWithoutSkipLink = () => {
  return (
    <div>
      <nav>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
      </nav>
      <main>
        <h1>Main Content</h1>
        <p>Content here...</p>
      </main>
      {/* Missing: skip to main content link */}
    </div>
  );
};

/**
 * VIOLATION 24: Icon button without accessible name
 */
export const IconButtonWithoutLabel = () => {
  return (
    <div>
      <button>🗑️</button>
      <button>✏️</button>
      <button>❤️</button>
      {/* Missing: aria-label or visually hidden text */}
    </div>
  );
};

/**
 * VIOLATION 25: Time-based content without controls
 */
export const DisappearingContent = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div>
      <p>This message will disappear in 5 seconds</p>
      {/* Missing: way to pause, stop, or hide the time limit */}
      {/* Missing: warning about time limit */}
    </div>
  );
};

/**
 * VIOLATION 26: Table without proper headers
 */
export const TableWithoutHeaders = ({ data }) => {
  return (
    <table>
      <tr>
        <td>Name</td>
        <td>Age</td>
        <td>City</td>
      </tr>
      {data.map((row, index) => (
        <tr key={index}>
          <td>{row.name}</td>
          <td>{row.age}</td>
          <td>{row.city}</td>
        </tr>
      ))}
      {/* Missing: <thead> and <th> elements */}
      {/* Missing: scope attribute on headers */}
    </table>
  );
};

/**
 * VIOLATION 27: Required field without indication
 */
export const RequiredFieldWithoutIndication = () => {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input type="email" id="email" required />
      {/* Missing: visual indication of required field */}
      {/* Missing: aria-required="true" (though HTML5 required is present) */}
      {/* Missing: asterisk or "(required)" text */}
    </form>
  );
};

/**
 * VIOLATION 28: Error message not associated with input
 */
export const UnassociatedErrorMessage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input 
        type="email" 
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Submit</button>
      {/* Missing: aria-describedby linking input to error */}
      {/* Missing: aria-invalid on input when error exists */}
      {/* Missing: role="alert" on error message */}
    </form>
  );
};

/**
 * VIOLATION 29: Disabled button without explanation
 */
export const DisabledButtonWithoutExplanation = () => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div>
      <input 
        type="checkbox" 
        id="agree"
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
      />
      <label htmlFor="agree">I agree to terms</label>
      <button disabled={!agreed}>Submit</button>
      {/* Missing: explanation of why button is disabled */}
      {/* Missing: aria-describedby pointing to explanation */}
    </div>
  );
};

/**
 * VIOLATION 30: Menu without proper ARIA
 */
export const InaccessibleMenu = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>
      {isOpen && (
        <div>
          {items.map((item, index) => (
            <div key={index} onClick={item.onClick}>
              {item.label}
            </div>
          ))}
        </div>
      )}
      {/* Missing: role="menu" on container */}
      {/* Missing: role="menuitem" on items */}
      {/* Missing: aria-haspopup on button */}
      {/* Missing: aria-expanded on button */}
      {/* Missing: keyboard navigation (arrow keys, Escape) */}
    </div>
  );
};

// Export all components
export default {
  InaccessibleButton,
  ImageWithoutAlt,
  FormWithoutLabels,
  InaccessibleModal,
  SilentContentUpdate,
  InaccessibleDropdown,
  InaccessibleTabs,
  AutoPlayVideo,
  InaccessibleTooltip,
  InaccessibleCheckbox,
  InaccessibleAlert,
  InaccessibleAccordion,
  InaccessibleCarousel,
  InaccessibleSpinner,
  InaccessibleProgressBar,
  ClickOnlyElement,
  NoFocusOutline,
  ConfusingTabOrder,
  ColorOnlyInfo,
  LowContrastText,
  InaccessibleDragDrop,
  InaccessibleInfiniteScroll,
  PageWithoutSkipLink,
  IconButtonWithoutLabel,
  DisappearingContent,
  TableWithoutHeaders,
  RequiredFieldWithoutIndication,
  UnassociatedErrorMessage,
  DisabledButtonWithoutExplanation,
  InaccessibleMenu
};