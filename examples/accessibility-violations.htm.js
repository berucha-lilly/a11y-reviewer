// accessibility-violations.htm.js
// This file demonstrates various accessibility violations using HTM (Hyperscript Tagged Markup)
// HTM allows you to write JSX-like syntax without a build step

import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.module.js';

/**
 * VIOLATION 1: Div used as button without proper ARIA
 */
export const InaccessibleButton = () => {
  const handleClick = () => {
    alert('Clicked!');
  };

  return html`
    <div onClick=${handleClick}>
      Click me
      <!-- Missing: role="button", tabIndex="0", onKeyDown handler -->
    </div>
  `;
};

/**
 * VIOLATION 2: Image without alt text
 */
export const ImageWithoutAlt = () => {
  return html`
    <div>
      <img src="/logo.png" />
      <img src="/banner.jpg" alt="" />
      <img src="/icon.png" />
      <!-- Missing: meaningful alt text -->
    </div>
  `;
};

/**
 * VIOLATION 3: Form inputs without labels
 */
export class FormWithoutLabels extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      email: '',
      password: ''
    };
  }

  handleChange = (field) => (e) => {
    this.setState({ [field]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
  };

  render() {
    return html`
      <form onSubmit=${this.handleSubmit}>
        <!-- Using placeholder as label - violation -->
        <input 
          type="text" 
          placeholder="Username"
          value=${this.state.username}
          onInput=${this.handleChange('username')}
        />
        <input 
          type="email" 
          placeholder="Email"
          value=${this.state.email}
          onInput=${this.handleChange('email')}
        />
        <input 
          type="password" 
          placeholder="Password"
          value=${this.state.password}
          onInput=${this.handleChange('password')}
        />
        <button type="submit">Submit</button>
        <!-- Missing: <label> elements or aria-label -->
      </form>
    `;
  }
}

/**
 * VIOLATION 4: Modal without focus trap or proper ARIA
 */
export class InaccessibleModal extends Component {
  render({ isOpen, onClose, children, title }) {
    if (!isOpen) return null;

    return html`
      <div style=${{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000
      }}>
        <div style=${{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px'
        }}>
          ${title && html`<h2>${title}</h2>`}
          ${children}
          <button onClick=${onClose}>Close</button>
        </div>
        <!-- Missing: focus trap, aria-modal="true", aria-labelledby -->
        <!-- Missing: escape key handler, focus management -->
      </div>
    `;
  }
}

/**
 * VIOLATION 5: Dynamic content updates without announcements
 */
export class SilentContentUpdate extends Component {
  constructor() {
    super();
    this.state = {
      status: '',
      count: 0
    };
  }

  updateStatus = () => {
    const newCount = this.state.count + 1;
    this.setState({
      status: `Content updated ${newCount} times!`,
      count: newCount
    });
    // Missing: aria-live region for screen reader announcement
  };

  render() {
    return html`
      <div>
        <button onClick=${this.updateStatus}>Update Status</button>
        <div>${this.state.status}</div>
        <!-- Should be: <div role="status" aria-live="polite">${status}</div> -->
      </div>
    `;
  }
}

/**
 * VIOLATION 6: Custom dropdown without keyboard navigation
 */
export class InaccessibleDropdown extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      selected: null
    };
  }

  toggleDropdown = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  selectOption = (option) => {
    this.setState({ selected: option, isOpen: false });
    if (this.props.onChange) {
      this.props.onChange(option);
    }
  };

  render({ options, placeholder = 'Select an option' }) {
    const { isOpen, selected } = this.state;

    return html`
      <div style=${{ position: 'relative' }}>
        <div 
          onClick=${this.toggleDropdown}
          style=${{ 
            padding: '8px', 
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          ${selected || placeholder}
        </div>
        ${isOpen && html`
          <div style=${{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            border: '1px solid #ccc',
            backgroundColor: 'white',
            zIndex: 10
          }}>
            ${options.map((option) => html`
              <div 
                key=${option}
                onClick=${() => this.selectOption(option)}
                style=${{ 
                  padding: '8px',
                  cursor: 'pointer'
                }}
              >
                ${option}
              </div>
            `)}
          </div>
        `}
        <!-- Missing: ARIA attributes (role, aria-expanded, aria-haspopup) -->
        <!-- Missing: keyboard navigation (arrow keys, Enter, Escape) -->
      </div>
    `;
  }
}

/**
 * VIOLATION 7: Tabs without proper ARIA
 */
export class InaccessibleTabs extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: 0
    };
  }

  setActiveTab = (index) => {
    this.setState({ activeTab: index });
  };

  render({ tabs }) {
    const { activeTab } = this.state;

    return html`
      <div>
        <div style=${{ display: 'flex', gap: '10px', borderBottom: '1px solid #ccc' }}>
          ${tabs.map((tab, index) => html`
            <div 
              key=${index}
              onClick=${() => this.setActiveTab(index)}
              style=${{
                padding: '10px',
                cursor: 'pointer',
                fontWeight: activeTab === index ? 'bold' : 'normal',
                borderBottom: activeTab === index ? '2px solid blue' : 'none'
              }}
            >
              ${tab.label}
            </div>
          `)}
        </div>
        <div style=${{ padding: '20px' }}>
          ${tabs[activeTab].content}
        </div>
        <!-- Missing: role="tablist", role="tab", role="tabpanel" -->
        <!-- Missing: aria-selected, aria-controls, aria-labelledby -->
      </div>
    `;
  }
}

/**
 * VIOLATION 8: Auto-playing video without controls
 */
export const AutoPlayVideo = ({ src, poster }) => {
  return html`
    <video 
      src=${src}
      poster=${poster}
      autoplay 
      loop
      style=${{ width: '100%' }}
    />
    <!-- Missing: controls attribute -->
    <!-- Missing: muted attribute (if autoplay is necessary) -->
  `;
};

/**
 * VIOLATION 9: Tooltip without proper ARIA
 */
export class InaccessibleTooltip extends Component {
  constructor() {
    super();
    this.state = {
      isVisible: false
    };
  }

  showTooltip = () => {
    this.setState({ isVisible: true });
  };

  hideTooltip = () => {
    this.setState({ isVisible: false });
  };

  render({ text, children }) {
    const { isVisible } = this.state;

    return html`
      <div 
        style=${{ position: 'relative', display: 'inline-block' }}
        onMouseEnter=${this.showTooltip}
        onMouseLeave=${this.hideTooltip}
      >
        ${children}
        ${isVisible && html`
          <div style=${{
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
            ${text}
          </div>
        `}
        <!-- Missing: aria-describedby, keyboard access, role="tooltip" -->
      </div>
    `;
  }
}

/**
 * VIOLATION 10: Custom checkbox without ARIA
 */
export class InaccessibleCheckbox extends Component {
  constructor() {
    super();
    this.state = {
      checked: false
    };
  }

  handleClick = () => {
    const newChecked = !this.state.checked;
    this.setState({ checked: newChecked });
    if (this.props.onChange) {
      this.props.onChange(newChecked);
    }
  };

  render({ label }) {
    const { checked } = this.state;

    return html`
      <div 
        onClick=${this.handleClick}
        style=${{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
      >
        <div style=${{
          width: '20px',
          height: '20px',
          border: '2px solid #333',
          backgroundColor: checked ? 'blue' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          ${checked && '✓'}
        </div>
        <span>${label}</span>
        <!-- Missing: role="checkbox", aria-checked, tabIndex -->
      </div>
    `;
  }
}

/**
 * VIOLATION 11: Alert without ARIA live region
 */
export class InaccessibleAlert extends Component {
  constructor() {
    super();
    this.state = {
      visible: true
    };
  }

  componentDidMount() {
    const duration = this.props.duration || 3000;
    this.timer = setTimeout(() => {
      this.setState({ visible: false });
    }, duration);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render({ message, type = 'info' }) {
    if (!this.state.visible) return null;

    const colors = {
      info: { bg: '#2196F3', text: 'white' },
      warning: { bg: '#FF9800', text: 'white' },
      error: { bg: '#F44336', text: 'white' },
      success: { bg: '#4CAF50', text: 'white' }
    };

    return html`
      <div style=${{
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
        ${message}
        <!-- Missing: role="alert" or aria-live="assertive" -->
      </div>
    `;
  }
}

/**
 * VIOLATION 12: Accordion without proper ARIA
 */
export class InaccessibleAccordion extends Component {
  constructor() {
    super();
    this.state = {
      openIndices: new Set()
    };
  }

  toggleSection = (index) => {
    const newOpenIndices = new Set(this.state.openIndices);
    if (newOpenIndices.has(index)) {
      newOpenIndices.delete(index);
    } else {
      if (!this.props.allowMultiple) {
        newOpenIndices.clear();
      }
      newOpenIndices.add(index);
    }
    this.setState({ openIndices: newOpenIndices });
  };

  render({ sections, allowMultiple = false }) {
    const { openIndices } = this.state;

    return html`
      <div>
        ${sections.map((section, index) => html`
          <div key=${index} style=${{ borderBottom: '1px solid #ccc' }}>
            <div 
              onClick=${() => this.toggleSection(index)}
              style=${{
                padding: '15px',
                cursor: 'pointer',
                fontWeight: 'bold',
                backgroundColor: openIndices.has(index) ? '#f0f0f0' : 'white'
              }}
            >
              ${section.title}
              <span style=${{ float: 'right' }}>
                ${openIndices.has(index) ? '−' : '+'}
              </span>
            </div>
            ${openIndices.has(index) && html`
              <div style=${{ padding: '15px' }}>
                ${section.content}
              </div>
            `}
          </div>
        `)}
        <!-- Missing: role="button", aria-expanded, aria-controls -->
      </div>
    `;
  }
}

/**
 * VIOLATION 13: Carousel without accessibility features
 */
export class InaccessibleCarousel extends Component {
  constructor() {
    super();
    this.state = {
      currentSlide: 0
    };
  }

  componentDidMount() {
    if (this.props.autoPlay !== false) {
      this.startAutoPlay();
    }
  }

  componentWillUnmount() {
    this.stopAutoPlay();
  }

  startAutoPlay = () => {
    const interval = this.props.interval || 3000;
    this.timer = setInterval(() => {
      this.nextSlide();
    }, interval);
  };

  stopAutoPlay = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  };

  nextSlide = () => {
    const { slides } = this.props;
    this.setState({
      currentSlide: (this.state.currentSlide + 1) % slides.length
    });
  };

  goToSlide = (index) => {
    this.setState({ currentSlide: index });
  };

  render({ slides }) {
    const { currentSlide } = this.state;

    return html`
      <div style=${{ position: 'relative' }}>
        <div>${slides[currentSlide]}</div>
        <div style=${{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '5px',
          marginTop: '10px' 
        }}>
          ${slides.map((_, index) => html`
            <div
              key=${index}
              onClick=${() => this.goToSlide(index)}
              style=${{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: currentSlide === index ? 'blue' : '#ccc',
                cursor: 'pointer'
              }}
            />
          `)}
        </div>
        <!-- Missing: pause button, keyboard controls, aria-live -->
      </div>
    `;
  }
}

/**
 * VIOLATION 14: Loading spinner without announcement
 */
export const InaccessibleSpinner = ({ size = 40, color = '#333' }) => {
  return html`
    <div style=${{
      width: `${size}px`,
      height: `${size}px`,
      border: `4px solid ${color}`,
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}>
      <!-- Missing: role="status", aria-label, text alternative -->
    </div>
  `;
};

/**
 * VIOLATION 15: Progress bar without ARIA
 */
export const InaccessibleProgressBar = ({ percent, label, showLabel = false }) => {
  return html`
    <div>
      ${showLabel && label && html`<div>${label}</div>`}
      <div style=${{ 
        width: '100%', 
        height: '20px',
        backgroundColor: '#e0e0e0',
        borderRadius: '10px',
        overflow: 'hidden'
      }}>
        <div style=${{ 
          width: `${Math.min(100, Math.max(0, percent))}%`,
          height: '100%',
          backgroundColor: '#2196F3',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <!-- Missing: role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax -->
    </div>
  `;
};

/**
 * VIOLATION 16: Click handler without keyboard support
 */
export const ClickOnlyElement = ({ onClick, children }) => {
  return html`
    <div 
      onClick=${onClick}
      style=${{ cursor: 'pointer', padding: '10px' }}
    >
      ${children}
      <!-- Missing: onKeyDown handler, tabIndex, role -->
    </div>
  `;
};

/**
 * VIOLATION 17: Removing focus outline
 */
export const NoFocusOutline = () => {
  return html`
    <div>
      <button style=${{ outline: 'none' }}>Button 1</button>
      <a href="#" style=${{ outline: 'none' }}>Link</a>
      <input type="text" style=${{ outline: 'none' }} />
      <!-- Removing focus indicators is a major violation -->
    </div>
  `;
};

/**
 * VIOLATION 18: Positive tabIndex
 */
export const ConfusingTabOrder = () => {
  return html`
    <div>
      <button tabIndex="5">Button 1</button>
      <button tabIndex="3">Button 2</button>
      <button tabIndex="1">Button 3</button>
      <button>Button 4 (natural order)</button>
      <!-- Positive tabIndex disrupts natural tab order -->
    </div>
  `;
};

/**
 * VIOLATION 19: Color-only information
 */
export class ColorOnlyInfo extends Component {
  constructor() {
    super();
    this.state = {
      errors: ['email', 'password']
    };
  }

  render() {
    const { errors } = this.state;

    return html`
      <form>
        <p>Fields in <span style=${{ color: 'red' }}>red</span> are required</p>
        <div>
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username"
            style=${{ borderColor: 'black' }} 
          />
        </div>
        <div>
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email"
            style=${{ borderColor: errors.includes('email') ? 'red' : 'black' }} 
          />
        </div>
        <div>
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password"
            style=${{ borderColor: errors.includes('password') ? 'red' : 'black' }} 
          />
        </div>
        <!-- Missing: non-color indicators like asterisks -->
      </form>
    `;
  }
}

/**
 * VIOLATION 20: Low contrast text
 */
export const LowContrastText = () => {
  return html`
    <div>
      <p style=${{ color: '#aaa', backgroundColor: '#fff' }}>
        This text has poor contrast (2.32:1 ratio)
      </p>
      <p style=${{ color: '#777', backgroundColor: '#999' }}>
        This also fails WCAG contrast requirements (1.85:1 ratio)
      </p>
      <button style=${{ 
        color: '#ccc', 
        backgroundColor: '#ddd',
        border: 'none',
        padding: '10px'
      }}>
        Low contrast button
      </button>
      <!-- WCAG AA requires 4.5:1 for normal text -->
    </div>
  `;
};

/**
 * VIOLATION 21: Drag and drop without keyboard alternative
 */
export class InaccessibleDragDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: props.items || []
    };
  }

  handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index.toString());
  };

  handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('index'));
    const newItems = [...this.state.items];
    const [removed] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, removed);
    this.setState({ items: newItems });
  };

  handleDragOver = (e) => {
    e.preventDefault();
  };

  render() {
    const { items } = this.state;

    return html`
      <div>
        ${items.map((item, index) => html`
          <div
            key=${item.id}
            draggable="true"
            onDragStart=${(e) => this.handleDragStart(e, index)}
            onDrop=${(e) => this.handleDrop(e, index)}
            onDragOver=${this.handleDragOver}
            style=${{
              padding: '15px',
              margin: '5px 0',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              cursor: 'move'
            }}
          >
            ${item.content}
          </div>
        `)}
        <!-- Missing: keyboard alternative, ARIA attributes -->
      </div>
    `;
  }
}

/**
 * VIOLATION 22: Infinite scroll without keyboard access
 */
export class InaccessibleInfiniteScroll extends Component {
  constructor() {
    super();
    this.state = {
      items: Array.from({ length: 20 }, (_, i) => i),
      loading: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = async () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !this.state.loading &&
      this.props.hasMore
    ) {
      this.setState({ loading: true });
      if (this.props.loadMore) {
        await this.props.loadMore();
      }
      const newItems = Array.from({ length: 20 }, (_, i) => this.state.items.length + i);
      this.setState({
        items: [...this.state.items, ...newItems],
        loading: false
      });
    }
  };

  render() {
    const { items, loading } = this.state;

    return html`
      <div>
        ${items.map(item => html`
          <div key=${item} style=${{ padding: '20px', borderBottom: '1px solid #ccc' }}>
            Item ${item}
          </div>
        `)}
        ${loading && html`<div>Loading more items...</div>`}
        <!-- Missing: keyboard alternative, focus management -->
      </div>
    `;
  }
}

/**
 * VIOLATION 23: Skip link missing
 */
export const PageWithoutSkipLink = () => {
  return html`
    <div>
      <nav style=${{ padding: '20px', backgroundColor: '#333' }}>
        <a href="#home" style=${{ color: 'white', margin: '0 10px' }}>Home</a>
        <a href="#about" style=${{ color: 'white', margin: '0 10px' }}>About</a>
        <a href="#services" style=${{ color: 'white', margin: '0 10px' }}>Services</a>
        <a href="#contact" style=${{ color: 'white', margin: '0 10px' }}>Contact</a>
      </nav>
      <main style=${{ padding: '20px' }}>
        <h1>Main Content</h1>
        <p>Content here...</p>
      </main>
      <!-- Missing: skip to main content link -->
    </div>
  `;
};

/**
 * VIOLATION 24: Icon button without accessible name
 */
export const IconButtonWithoutLabel = () => {
  const handleDelete = () => console.log('Delete');
  const handleEdit = () => console.log('Edit');
  const handleLike = () => console.log('Like');

  return html`
    <div style=${{ display: 'flex', gap: '10px' }}>
      <button onClick=${handleDelete} style=${{ fontSize: '20px' }}>🗑️</button>
      <button onClick=${handleEdit} style=${{ fontSize: '20px' }}>✏️</button>
      <button onClick=${handleLike} style=${{ fontSize: '20px' }}>❤️</button>
      <!-- Missing: aria-label or visually hidden text -->
    </div>
  `;
};

/**
 * VIOLATION 25: Time-based content without controls
 */
export class DisappearingContent extends Component {
  constructor() {
    super();
    this.state = {
      visible: true
    };
  }

  componentDidMount() {
    const duration = this.props.duration || 5000;
    this.timer = setTimeout(() => {
      this.setState({ visible: false });
    }, duration);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render({ message, duration = 5000 }) {
    if (!this.state.visible) return null;

    return html`
      <div style=${{
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px'
      }}>
        <p>${message}</p>
        <small>This message will disappear in ${duration / 1000} seconds</small>
        <!-- Missing: way to pause, stop, or extend time -->
      </div>
    `;
  }
}

/**
 * VIOLATION 26: Table without proper headers
 */
export const TableWithoutHeaders = ({ data }) => {
  return html`
    <table style=${{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          <td style=${{ border: '1px solid #ccc', padding: '8px' }}>Name</td>
          <td style=${{ border: '1px solid #ccc', padding: '8px' }}>Age</td>
          <td style=${{ border: '1px solid #ccc', padding: '8px' }}>City</td>
        </tr>
        ${data.map((row, index) => html`
          <tr key=${index}>
            <td style=${{ border: '1px solid #ccc', padding: '8px' }}>${row.name}</td>
            <td style=${{ border: '1px solid #ccc', padding: '8px' }}>${row.age}</td>
            <td style=${{ border: '1px solid #ccc', padding: '8px' }}>${row.city}</td>
          </tr>
        `)}
      </tbody>
      <!-- Missing: <thead> and <th> elements -->
    </table>
  `;
};

/**
 * VIOLATION 27: Required field without indication
 */
export class RequiredFieldWithoutIndication extends Component {
  constructor() {
    super();
    this.state = {
      email: ''
    };
  }

  render() {
    return html`
      <form>
        <div>
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email"
            value=${this.state.email}
            onInput=${(e) => this.setState({ email: e.target.value })}
            required 
          />
        </div>
        <button type="submit">Submit</button>
        <!-- Missing: visual indication of required field -->
      </form>
    `;
  }
}

/**
 * VIOLATION 28: Error message not associated with input
 */
export class UnassociatedErrorMessage extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      error: ''
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.email.includes('@')) {
      this.setState({ error: 'Please enter a valid email address' });
    } else {
      this.setState({ error: '' });
    }
  };

  render() {
    const { email, error } = this.state;

    return html`
      <form onSubmit=${this.handleSubmit}>
        <div>
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email"
            value=${email}
            onInput=${(e) => this.setState({ email: e.target.value })}
          />
          ${error && html`
            <div style=${{ color: 'red', marginTop: '5px' }}>
              ${error}
            </div>
          `}
        </div>
        <button type="submit">Submit</button>
        <!-- Missing: aria-describedby, aria-invalid, role="alert" -->
      </form>
    `;
  }
}

/**
 * VIOLATION 29: Disabled button without explanation
 */
export class DisabledButtonWithoutExplanation extends Component {
  constructor() {
    super();
    this.state = {
      agreed: false
    };
  }

  render() {
    const { agreed } = this.state;

    return html`
      <div>
        <div>
          <input 
            type="checkbox" 
            id="agree"
            checked=${agreed}
            onChange=${(e) => this.setState({ agreed: e.target.checked })}
          />
          <label for="agree">I agree to the terms and conditions</label>
        </div>
        <button disabled=${!agreed}>
          Submit
        </button>
        <!-- Missing: explanation of why button is disabled -->
      </div>
    `;
  }
}

/**
 * VIOLATION 30: Menu without proper ARIA
 */
export class InaccessibleMenu extends Component {
  constructor() {
    super();
    this.state = {
      isOpen: false
    };
  }

  toggleMenu = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleItemClick = (item) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      this.setState({ isOpen: false });
    }
  };

  render({ items, trigger }) {
    const { isOpen } = this.state;

    return html`
      <div style=${{ position: 'relative' }}>
        <div onClick=${this.toggleMenu}>
          ${trigger}
        </div>
        ${isOpen && html`
          <div style=${{
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: '150px',
            zIndex: 1000
          }}>
            ${items.map((item, index) => html`
              <div
                key=${index}
                onClick=${() => this.handleItemClick(item)}
                style=${{
                  padding: '10px 15px',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  opacity: item.disabled ? 0.5 : 1,
                  borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none'
                }}
              >
                ${item.label}
              </div>
            `)}
          </div>
        `}
        <!-- Missing: role="menu", role="menuitem", aria-haspopup -->
      </div>
    `;
  }
}

// Example usage and rendering
export const renderExamples = () => {
  const container = document.getElementById('app');

  render(html`
    <div>
      <h1>Accessibility Violations Examples (HTM)</h1>

      <section>
        <h2>1. Inaccessible Button</h2>
        <${InaccessibleButton} />
      </section>

      <section>
        <h2>2. Images Without Alt</h2>
        <${ImageWithoutAlt} />
      </section>

      <section>
        <h2>3. Form Without Labels</h2>
        <${FormWithoutLabels} />
      </section>

      <!-- Add more examples as needed -->
    </div>
  `, container);
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
  InaccessibleMenu,
  renderExamples
};