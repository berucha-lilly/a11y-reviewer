// AccessibilityViolations.tsx
// This file demonstrates various accessibility violations in React with TypeScript

import React, { 
  useState, 
  useEffect, 
  useRef, 
  ReactNode, 
  MouseEvent, 
  KeyboardEvent,
  ChangeEvent,
  FormEvent,
  DragEvent
} from 'react';

/**
 * VIOLATION 1: Div used as button without proper ARIA
 */
export const InaccessibleButton: React.FC = () => {
  const handleClick = (): void => {
    alert('Clicked!');
  };

  return (
    <div onClick={handleClick}>
      Click me
      {/* Missing: role="button", tabIndex={0}, onKeyDown handler */}
    </div>
  );
};

/**
 * VIOLATION 2: Image without alt text
 */
interface ImageProps {
  src: string;
  decorative?: boolean;
}

export const ImageWithoutAlt: React.FC = () => {
  return (
    <div>
      <img src="/logo.png" />
      <img src="/banner.jpg" alt="" />
      <img src="/icon.png" />
      {/* Missing: meaningful alt text */}
    </div>
  );
};

/**
 * VIOLATION 3: Form inputs without labels
 */
interface FormData {
  username: string;
  email: string;
  password: string;
}

export const FormWithoutLabels: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Using placeholder as label - violation */}
      <input 
        type="text" 
        placeholder="Username"
        value={formData.username}
        onChange={handleChange('username')}
      />
      <input 
        type="email" 
        placeholder="Email"
        value={formData.email}
        onChange={handleChange('email')}
      />
      <input 
        type="password" 
        placeholder="Password"
        value={formData.password}
        onChange={handleChange('password')}
      />
      <button type="submit">Submit</button>
      {/* Missing: <label> elements or aria-label */}
    </form>
  );
};

/**
 * VIOLATION 4: Modal without focus trap or proper ARIA
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const InaccessibleModal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children,
  title 
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px'
      }}>
        {title && <h2>{title}</h2>}
        {children}
        <button onClick={onClose}>Close</button>
      </div>
      {/* Missing: focus trap, aria-modal="true", aria-labelledby */}
      {/* Missing: escape key handler, focus management */}
      {/* Missing: return focus to trigger element on close */}
    </div>
  );
};

/**
 * VIOLATION 5: Dynamic content updates without announcements
 */
export const SilentContentUpdate: React.FC = () => {
  const [status, setStatus] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  const updateStatus = (): void => {
    setStatus(`Content updated ${++count} times!`);
    // Missing: aria-live region for screen reader announcement
  };

  return (
    <div>
      <button onClick={updateStatus}>Update Status</button>
      <div>{status}</div>
      {/* Should be: <div role="status" aria-live="polite">{status}</div> */}
    </div>
  );
};

/**
 * VIOLATION 6: Custom dropdown without keyboard navigation
 */
interface DropdownProps {
  options: string[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

export const InaccessibleDropdown: React.FC<DropdownProps> = ({ 
  options, 
  placeholder = 'Select an option',
  onChange 
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string): void => {
    setSelected(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          padding: '8px', 
          border: '1px solid #ccc',
          cursor: 'pointer'
        }}
      >
        {selected || placeholder}
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          border: '1px solid #ccc',
          backgroundColor: 'white',
          zIndex: 10
        }}>
          {options.map((option, index) => (
            <div 
              key={index}
              onClick={() => handleSelect(option)}
              style={{ 
                padding: '8px',
                cursor: 'pointer'
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      {/* Missing: ARIA attributes (role, aria-expanded, aria-haspopup) */}
      {/* Missing: keyboard navigation (arrow keys, Enter, Escape) */}
      {/* Missing: focus management, tabIndex */}
    </div>
  );
};

/**
 * VIOLATION 7: Tabs without proper ARIA
 */
interface Tab {
  label: string;
  content: ReactNode;
  id?: string;
}

interface TabsProps {
  tabs: Tab[];
}

export const InaccessibleTabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #ccc' }}>
        {tabs.map((tab, index) => (
          <div 
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              fontWeight: activeTab === index ? 'bold' : 'normal',
              borderBottom: activeTab === index ? '2px solid blue' : 'none'
            }}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div style={{ padding: '20px' }}>
        {tabs[activeTab].content}
      </div>
      {/* Missing: role="tablist", role="tab", role="tabpanel" */}
      {/* Missing: aria-selected, aria-controls, aria-labelledby */}
      {/* Missing: keyboard navigation (arrow keys, Home, End) */}
      {/* Missing: tabIndex management */}
    </div>
  );
};

/**
 * VIOLATION 8: Auto-playing video without controls
 */
interface VideoProps {
  src: string;
  poster?: string;
}

export const AutoPlayVideo: React.FC<VideoProps> = ({ src, poster }) => {
  return (
    <video 
      src={src}
      poster={poster}
      autoPlay 
      loop
      style={{ width: '100%' }}
      // Missing: controls attribute
      // Missing: muted attribute (if autoplay is necessary)
      // Missing: captions/subtitles track
    />
  );
};

/**
 * VIOLATION 9: Tooltip without proper ARIA
 */
interface TooltipProps {
  text: string;
  children: ReactNode;
}

export const InaccessibleTooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'black',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          marginBottom: '5px'
        }}>
          {text}
        </div>
      )}
      {/* Missing: aria-describedby linking to tooltip */}
      {/* Missing: keyboard access (focus/blur events) */}
      {/* Missing: role="tooltip" on tooltip element */}
      {/* Missing: unique ID for aria-describedby reference */}
    </div>
  );
};

/**
 * VIOLATION 10: Custom checkbox without ARIA
 */
interface CheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const InaccessibleCheckbox: React.FC<CheckboxProps> = ({ 
  label, 
  checked: controlledChecked,
  onChange 
}) => {
  const [internalChecked, setInternalChecked] = useState<boolean>(false);
  const checked = controlledChecked ?? internalChecked;

  const handleClick = (): void => {
    const newChecked = !checked;
    setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div 
      onClick={handleClick}
      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
    >
      <div style={{
        width: '20px',
        height: '20px',
        border: '2px solid #333',
        backgroundColor: checked ? 'blue' : 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {checked && '✓'}
      </div>
      <span>{label}</span>
      {/* Missing: role="checkbox" */}
      {/* Missing: aria-checked */}
      {/* Missing: tabIndex={0} */}
      {/* Missing: keyboard support (Space key) */}
      {/* Missing: proper label association */}
    </div>
  );
};

/**
 * VIOLATION 11: Alert without ARIA live region
 */
interface AlertProps {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  duration?: number;
}

export const InaccessibleAlert: React.FC<AlertProps> = ({ 
  message, 
  type = 'info',
  duration = 3000 
}) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const colors: Record<string, { bg: string; text: string }> = {
    info: { bg: '#2196F3', text: 'white' },
    warning: { bg: '#FF9800', text: 'white' },
    error: { bg: '#F44336', text: 'white' },
    success: { bg: '#4CAF50', text: 'white' }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '15px 20px',
      backgroundColor: colors[type].bg,
      color: colors[type].text,
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 1000
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
interface AccordionSection {
  title: string;
  content: ReactNode;
  id?: string;
}

interface AccordionProps {
  sections: AccordionSection[];
  allowMultiple?: boolean;
}

export const InaccessibleAccordion: React.FC<AccordionProps> = ({ 
  sections,
  allowMultiple = false 
}) => {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggleSection = (index: number): void => {
    const newOpenIndices = new Set(openIndices);
    if (newOpenIndices.has(index)) {
      newOpenIndices.delete(index);
    } else {
      if (!allowMultiple) {
        newOpenIndices.clear();
      }
      newOpenIndices.add(index);
    }
    setOpenIndices(newOpenIndices);
  };

  return (
    <div>
      {sections.map((section, index) => (
        <div key={index} style={{ borderBottom: '1px solid #ccc' }}>
          <div 
            onClick={() => toggleSection(index)}
            style={{
              padding: '15px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: openIndices.has(index) ? '#f0f0f0' : 'white'
            }}
          >
            {section.title}
            <span style={{ float: 'right' }}>
              {openIndices.has(index) ? '−' : '+'}
            </span>
          </div>
          {openIndices.has(index) && (
            <div style={{ padding: '15px' }}>
              {section.content}
            </div>
          )}
        </div>
      ))}
      {/* Missing: role="button" on headers */}
      {/* Missing: aria-expanded */}
      {/* Missing: aria-controls */}
      {/* Missing: keyboard support (Enter, Space) */}
      {/* Missing: unique IDs for aria-controls relationship */}
    </div>
  );
};

/**
 * VIOLATION 13: Carousel without accessibility features
 */
interface CarouselProps {
  slides: ReactNode[];
  autoPlay?: boolean;
  interval?: number;
}

export const InaccessibleCarousel: React.FC<CarouselProps> = ({ 
  slides,
  autoPlay = true,
  interval = 3000 
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length, autoPlay, interval]);

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div>{slides[currentSlide]}</div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '5px',
        marginTop: '10px' 
      }}>
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? 'blue' : '#ccc',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
      {/* Missing: pause button */}
      {/* Missing: keyboard controls (arrow keys) */}
      {/* Missing: aria-live for announcements */}
      {/* Missing: aria-label on indicators */}
      {/* Missing: focus management */}
    </div>
  );
};

/**
 * VIOLATION 14: Loading spinner without announcement
 */
interface SpinnerProps {
  size?: number;
  color?: string;
}

export const InaccessibleSpinner: React.FC<SpinnerProps> = ({ 
  size = 40,
  color = '#333' 
}) => {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      border: `4px solid ${color}`,
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}>
      {/* Missing: role="status" or aria-live */}
      {/* Missing: text alternative like "Loading..." */}
      {/* Missing: aria-label */}
    </div>
  );
};

/**
 * VIOLATION 15: Progress bar without ARIA
 */
interface ProgressBarProps {
  percent: number;
  label?: string;
  showLabel?: boolean;
}

export const InaccessibleProgressBar: React.FC<ProgressBarProps> = ({ 
  percent,
  label,
  showLabel = false 
}) => {
  return (
    <div>
      {showLabel && label && <div>{label}</div>}
      <div style={{ 
        width: '100%', 
        height: '20px',
        backgroundColor: '#e0e0e0',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${Math.min(100, Math.max(0, percent))}%`,
          height: '100%',
          backgroundColor: '#2196F3',
          transition: 'width 0.3s ease'
        }} />
      </div>
      {/* Missing: role="progressbar" */}
      {/* Missing: aria-valuenow={percent} */}
      {/* Missing: aria-valuemin={0} */}
      {/* Missing: aria-valuemax={100} */}
      {/* Missing: aria-label or aria-labelledby */}
    </div>
  );
};

/**
 * VIOLATION 16: Click handler without keyboard support
 */
interface ClickOnlyElementProps {
  onClick: () => void;
  children: ReactNode;
}

export const ClickOnlyElement: React.FC<ClickOnlyElementProps> = ({ 
  onClick, 
  children 
}) => {
  return (
    <div 
      onClick={onClick}
      style={{ cursor: 'pointer', padding: '10px' }}
    >
      {children}
      {/* Missing: onKeyDown handler for Enter/Space */}
      {/* Missing: tabIndex={0} */}
      {/* Missing: role attribute */}
    </div>
  );
};

/**
 * VIOLATION 17: Removing focus outline
 */
export const NoFocusOutline: React.FC = () => {
  return (
    <div>
      <button style={{ outline: 'none' }}>Button 1</button>
      <a href="#" style={{ outline: 'none' }}>Link</a>
      <input type="text" style={{ outline: 'none' }} />
      {/* Removing focus indicators is a major accessibility violation */}
    </div>
  );
};

/**
 * VIOLATION 18: Positive tabIndex
 */
export const ConfusingTabOrder: React.FC = () => {
  return (
    <div>
      <button tabIndex={5}>Button 1</button>
      <button tabIndex={3}>Button 2</button>
      <button tabIndex={1}>Button 3</button>
      <button>Button 4 (natural order)</button>
      {/* Positive tabIndex disrupts natural tab order */}
    </div>
  );
};

/**
 * VIOLATION 19: Color-only information
 */
export const ColorOnlyInfo: React.FC = () => {
  const [errors, setErrors] = useState<string[]>(['email', 'password']);

  return (
    <form>
      <p>Fields in <span style={{ color: 'red' }}>red</span> are required</p>
      <div>
        <label htmlFor="username">Username</label>
        <input 
          type="text" 
          id="username"
          style={{ borderColor: 'black' }} 
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email"
          style={{ borderColor: errors.includes('email') ? 'red' : 'black' }} 
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password"
          style={{ borderColor: errors.includes('password') ? 'red' : 'black' }} 
        />
      </div>
      {/* Missing: non-color indicators like asterisks or "required" text */}
      {/* Missing: aria-required or required attribute */}
    </form>
  );
};

/**
 * VIOLATION 20: Low contrast text
 */
export const LowContrastText: React.FC = () => {
  return (
    <div>
      <p style={{ color: '#aaa', backgroundColor: '#fff' }}>
        This text has poor contrast (2.32:1 ratio)
      </p>
      <p style={{ color: '#777', backgroundColor: '#999' }}>
        This also fails WCAG contrast requirements (1.85:1 ratio)
      </p>
      <button style={{ 
        color: '#ccc', 
        backgroundColor: '#ddd',
        border: 'none',
        padding: '10px'
      }}>
        Low contrast button
      </button>
      {/* WCAG AA requires 4.5:1 for normal text, 3:1 for large text */}
    </div>
  );
};

/**
 * VIOLATION 21: Drag and drop without keyboard alternative
 */
interface DragItem {
  id: string;
  content: string;
}

interface DragDropProps {
  items: DragItem[];
}

export const InaccessibleDragDrop: React.FC<DragDropProps> = ({ items: initialItems }) => {
  const [items, setItems] = useState<DragItem[]>(initialItems);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number): void => {
    e.dataTransfer.setData('index', index.toString());
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number): void => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('index'));
    const newItems = [...items];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, removed);
    setItems(newItems);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={handleDragOver}
          style={{
            padding: '15px',
            margin: '5px 0',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            cursor: 'move'
          }}
        >
          {item.content}
        </div>
      ))}
      {/* Missing: keyboard alternative (arrow keys + modifier) */}
      {/* Missing: ARIA attributes (aria-grabbed, aria-dropeffect) */}
      {/* Missing: instructions for screen reader users */}
      {/* Missing: focus management */}
    </div>
  );
};

/**
 * VIOLATION 22: Infinite scroll without keyboard access
 */
interface InfiniteScrollProps {
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export const InaccessibleInfiniteScroll: React.FC<InfiniteScrollProps> = ({ 
  loadMore,
  hasMore 
}) => {
  const [items, setItems] = useState<number[]>(Array.from({ length: 20 }, (_, i) => i));
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = async (): Promise<void> => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setLoading(true);
        await loadMore();
        setItems(prev => [...prev, ...Array.from({ length: 20 }, (_, i) => prev.length + i)]);
        setLoading(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadMore]);

  return (
    <div>
      {items.map(item => (
        <div key={item} style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
          Item {item}
        </div>
      ))}
      {loading && <div>Loading more items...</div>}
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
export const PageWithoutSkipLink: React.FC = () => {
  return (
    <div>
      <nav style={{ padding: '20px', backgroundColor: '#333' }}>
        <a href="#home" style={{ color: 'white', margin: '0 10px' }}>Home</a>
        <a href="#about" style={{ color: 'white', margin: '0 10px' }}>About</a>
        <a href="#services" style={{ color: 'white', margin: '0 10px' }}>Services</a>
        <a href="#contact" style={{ color: 'white', margin: '0 10px' }}>Contact</a>
      </nav>
      <main style={{ padding: '20px' }}>
        <h1>Main Content</h1>
        <p>Content here...</p>
      </main>
      {/* Missing: skip to main content link at the top */}
      {/* Should have: <a href="#main" className="skip-link">Skip to main content</a> */}
    </div>
  );
};

/**
 * VIOLATION 24: Icon button without accessible name
 */
interface IconButtonProps {
  icon: string;
  onClick: () => void;
}

export const IconButtonWithoutLabel: React.FC = () => {
  const handleDelete = (): void => console.log('Delete');
  const handleEdit = (): void => console.log('Edit');
  const handleLike = (): void => console.log('Like');

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button onClick={handleDelete} style={{ fontSize: '20px' }}>🗑️</button>
      <button onClick={handleEdit} style={{ fontSize: '20px' }}>✏️</button>
      <button onClick={handleLike} style={{ fontSize: '20px' }}>❤️</button>
      {/* Missing: aria-label or visually hidden text */}
      {/* Should be: <button aria-label="Delete" onClick={handleDelete}>🗑️</button> */}
    </div>
  );
};

/**
 * VIOLATION 25: Time-based content without controls
 */
interface TimedContentProps {
  message: string;
  duration?: number;
}

export const DisappearingContent: React.FC<TimedContentProps> = ({ 
  message,
  duration = 5000 
}) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#fff3cd',
      border: '1px solid #ffc107',
      borderRadius: '4px'
    }}>
      <p>{message}</p>
      <small>This message will disappear in {duration / 1000} seconds</small>
      {/* Missing: way to pause, stop, or hide the time limit */}
      {/* Missing: warning about time limit */}
      {/* Missing: option to extend time */}
    </div>
  );
};

/**
 * VIOLATION 26: Table without proper headers
 */
interface TableData {
  name: string;
  age: number;
  city: string;
}

interface TableProps {
  data: TableData[];
}

export const TableWithoutHeaders: React.FC<TableProps> = ({ data }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>Name</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>Age</td>
          <td style={{ border: '1px solid #ccc', padding: '8px' }}>City</td>
        </tr>
        {data.map((row, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.name}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.age}</td>
            <td style={{ border: '1px solid #ccc', padding: '8px' }}>{row.city}</td>
          </tr>
        ))}
      </tbody>
      {/* Missing: <thead> and <th> elements */}
      {/* Missing: scope attribute on headers */}
      {/* Should use: <th scope="col">Name</th> */}
    </table>
  );
};

/**
 * VIOLATION 27: Required field without indication
 */
export const RequiredFieldWithoutIndication: React.FC = () => {
  const [email, setEmail] = useState<string>('');

  return (
    <form>
      <div>
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>
      <button type="submit">Submit</button>
      {/* Missing: visual indication of required field (asterisk) */}
      {/* Missing: aria-required="true" (though HTML5 required is present) */}
      {/* Should have: <label htmlFor="email">Email <span aria-hidden="true">*</span></label> */}
    </form>
  );
};

/**
 * VIOLATION 28: Error message not associated with input
 */
export const UnassociatedErrorMessage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
    } else {
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && (
          <div style={{ color: 'red', marginTop: '5px' }}>
            {error}
          </div>
        )}
      </div>
      <button type="submit">Submit</button>
      {/* Missing: aria-describedby linking input to error */}
      {/* Missing: aria-invalid on input when error exists */}
      {/* Missing: role="alert" on error message */}
      {/* Missing: unique ID on error message */}
    </form>
  );
};

/**
 * VIOLATION 29: Disabled button without explanation
 */
export const DisabledButtonWithoutExplanation: React.FC = () => {
  const [agreed, setAgreed] = useState<boolean>(false);

  return (
    <div>
      <div>
        <input 
          type="checkbox" 
          id="agree"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <label htmlFor="agree">I agree to the terms and conditions</label>
      </div>
      <button disabled={!agreed}>
        Submit
      </button>
      {/* Missing: explanation of why button is disabled */}
      {/* Missing: aria-describedby pointing to explanation */}
      {/* Should have: <p id="submit-help">You must agree to terms to submit</p> */}
      {/* And: <button disabled={!agreed} aria-describedby="submit-help">Submit</button> */}
    </div>
  );
};

/**
 * VIOLATION 30: Menu without proper ARIA
 */
interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface MenuProps {
  items: MenuItem[];
  trigger: ReactNode;
}

export const InaccessibleMenu: React.FC<MenuProps> = ({ items, trigger }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          minWidth: '150px',
          zIndex: 1000
        }}>
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  setIsOpen(false);
                }
              }}
              style={{
                padding: '10px 15px',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
                borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none'
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
      {/* Missing: role="menu" on container */}
      {/* Missing: role="menuitem" on items */}
      {/* Missing: aria-haspopup on trigger */}
      {/* Missing: aria-expanded on trigger */}
      {/* Missing: keyboard navigation (arrow keys, Escape, Enter) */}
      {/* Missing: focus management */}
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