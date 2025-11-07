// accessibility-violations.ts
// This file demonstrates various accessibility violations in TypeScript

/**
 * VIOLATION 1: Creating elements without accessibility attributes
 */
function createInaccessibleButton(): void {
    const button: HTMLDivElement = document.createElement('div');
    button.onclick = (): void => alert('Clicked!');
    button.textContent = 'Click me';
    // Missing: role="button", tabindex="0", keyboard handlers
    document.body.appendChild(button);
}

/**
 * VIOLATION 2: Removing focus indicators programmatically
 */
function removeFocusIndicators(): void {
    const elements: NodeListOf<Element> = document.querySelectorAll('*');
    elements.forEach((el: Element): void => {
        (el as HTMLElement).style.outline = 'none';
    });
}

/**
 * VIOLATION 3: Creating modal without focus trap or proper ARIA
 */
interface ModalOptions {
    title: string;
    content: string;
}

function showInaccessibleModal(options: ModalOptions): void {
    const modal: HTMLDivElement = document.createElement('div');
    modal.innerHTML = `
        <h2>${options.title}</h2>
        <p>${options.content}</p>
        <button>Close</button>
    `;
    modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;';
    document.body.appendChild(modal);
    // Missing: focus trap, aria-modal="true", aria-labelledby, escape key handler, focus management
}

/**
 * VIOLATION 4: Manipulating DOM without announcing changes
 */
function updateContentSilently(elementId: string, message: string): void {
    const element: HTMLElement | null = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        // Missing: aria-live region or programmatic announcement
    }
}

/**
 * VIOLATION 5: Creating form without proper labels
 */
interface FormField {
    type: string;
    name: string;
    placeholder: string;
}

function createInaccessibleForm(fields: FormField[]): void {
    const form: HTMLFormElement = document.createElement('form');

    fields.forEach((field: FormField): void => {
        const input: HTMLInputElement = document.createElement('input');
        input.type = field.type;
        input.name = field.name;
        input.placeholder = field.placeholder; // Placeholder is NOT a label
        form.appendChild(input);
        // Missing: <label> elements, aria-label, or aria-labelledby
    });

    document.body.appendChild(form);
}

/**
 * VIOLATION 6: Disabling elements without proper feedback
 */
function disableWithoutFeedback(selector: string): void {
    const button: HTMLButtonElement | null = document.querySelector(selector);
    if (button) {
        button.disabled = true;
        // Missing: aria-disabled, visual indication, screen reader announcement
    }
}

/**
 * VIOLATION 7: Infinite scroll without keyboard access
 */
class InaccessibleInfiniteScroll {
    private loading: boolean = false;

    constructor() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        // Missing: keyboard alternative, focus management, skip link
    }

    private handleScroll(): void {
        if (this.loading) return;

        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            this.loadMoreContent();
        }
    }

    private loadMoreContent(): void {
        this.loading = true;
        // Load content without announcement
        // Missing: aria-live announcement, focus management
    }
}

/**
 * VIOLATION 8: Auto-playing media without controls
 */
function autoPlayMedia(src: string): void {
    const video: HTMLVideoElement = document.createElement('video');
    video.src = src;
    video.autoplay = true;
    video.muted = false; // Autoplays with sound - WCAG violation
    // Missing: controls attribute, user consent
    document.body.appendChild(video);
}

/**
 * VIOLATION 9: Creating dropdown without keyboard navigation
 */
class InaccessibleDropdown {
    private container: HTMLDivElement;
    private trigger: HTMLDivElement;
    private menu: HTMLDivElement;

    constructor(options: string[]) {
        this.container = document.createElement('div');
        this.trigger = document.createElement('div');
        this.menu = document.createElement('div');

        this.trigger.textContent = 'Select Option';
        this.trigger.onclick = (): void => this.toggle();

        this.menu.style.display = 'none';
        options.forEach((option: string, index: number): void => {
            const item: HTMLDivElement = document.createElement('div');
            item.textContent = option;
            item.onclick = (): void => this.selectOption(index);
            this.menu.appendChild(item);
        });

        this.container.appendChild(this.trigger);
        this.container.appendChild(this.menu);

        // Missing: ARIA attributes (role, aria-expanded, aria-haspopup)
        // Missing: keyboard navigation (arrow keys, Enter, Escape)
        // Missing: focus management
    }

    private toggle(): void {
        this.menu.style.display = this.menu.style.display === 'none' ? 'block' : 'none';
    }

    private selectOption(index: number): void {
        console.log(`Selected option ${index}`);
    }

    public render(): HTMLDivElement {
        return this.container;
    }
}

/**
 * VIOLATION 10: Timeout without warning or extension option
 */
class InaccessibleTimeout {
    private timeoutId: number | null = null;

    start(duration: number): void {
        this.timeoutId = window.setTimeout((): void => {
            alert('Session expired!');
            window.location.href = '/login';
        }, duration);
        // Missing: warning before timeout, option to extend, accessible countdown
    }
}

/**
 * VIOLATION 11: Creating tooltip without proper ARIA
 */
function createInaccessibleTooltip(element: HTMLElement, text: string): void {
    const tooltip: HTMLDivElement = document.createElement('div');
    tooltip.textContent = text;
    tooltip.style.cssText = 'position:absolute;background:black;color:white;padding:5px;';

    element.addEventListener('mouseenter', (): void => {
        document.body.appendChild(tooltip);
    });

    element.addEventListener('mouseleave', (): void => {
        tooltip.remove();
    });
    // Missing: aria-describedby, keyboard access (focus/blur), role="tooltip"
}

/**
 * VIOLATION 12: Changing content without managing focus
 */
async function navigateWithoutFocus(page: string): Promise<void> {
    try {
        const response: Response = await fetch(`/api/${page}`);
        const html: string = await response.text();
        const content: HTMLElement | null = document.getElementById('content');

        if (content) {
            content.innerHTML = html;
            // Missing: focus management, announcement to screen readers
        }
    } catch (error) {
        console.error('Navigation failed:', error);
    }
}

/**
 * VIOLATION 13: Creating tabs without proper ARIA
 */
class InaccessibleTabs {
    private container: HTMLDivElement;
    private currentTab: number = 0;

    constructor(tabs: Array<{ label: string; content: string }>) {
        this.container = document.createElement('div');

        const tabList: HTMLDivElement = document.createElement('div');
        const panels: HTMLDivElement = document.createElement('div');

        tabs.forEach((tab, index: number): void => {
            const tabButton: HTMLDivElement = document.createElement('div');
            tabButton.textContent = tab.label;
            tabButton.onclick = (): void => this.showTab(index);
            tabList.appendChild(tabButton);

            const panel: HTMLDivElement = document.createElement('div');
            panel.innerHTML = tab.content;
            panel.style.display = index === 0 ? 'block' : 'none';
            panels.appendChild(panel);
        });

        this.container.appendChild(tabList);
        this.container.appendChild(panels);

        // Missing: role="tablist", role="tab", role="tabpanel"
        // Missing: aria-selected, aria-controls, aria-labelledby
        // Missing: keyboard navigation (arrow keys, Home, End)
    }

    private showTab(index: number): void {
        this.currentTab = index;
        // Show/hide logic without proper ARIA updates
    }

    public render(): HTMLDivElement {
        return this.container;
    }
}

/**
 * VIOLATION 14: Using positive tabindex
 */
function setConfusingTabOrder(): void {
    const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('button');
    buttons.forEach((btn: HTMLButtonElement, index: number): void => {
        btn.tabIndex = index + 10; // Positive tabindex disrupts natural tab order
    });
}

/**
 * VIOLATION 15: Creating alert without ARIA live region
 */
interface AlertOptions {
    message: string;
    type: 'info' | 'warning' | 'error';
    duration?: number;
}

function showInaccessibleAlert(options: AlertOptions): void {
    const alert: HTMLDivElement = document.createElement('div');
    alert.textContent = options.message;
    alert.className = `alert-${options.type}`;
    alert.style.cssText = 'position:fixed;top:20px;right:20px;padding:10px;';

    document.body.appendChild(alert);

    setTimeout((): void => {
        alert.remove();
    }, options.duration || 3000);

    // Missing: role="alert" or aria-live="assertive"
    // Missing: aria-atomic="true"
}

/**
 * VIOLATION 16: Preventing default keyboard behavior
 */
function breakKeyboardNavigation(): void {
    document.addEventListener('keydown', (e: KeyboardEvent): void => {
        if (e.key === 'Tab') {
            e.preventDefault(); // Breaks tab navigation - major violation
        }
    });
}

/**
 * VIOLATION 17: Creating carousel without accessibility
 */
class InaccessibleCarousel {
    private currentSlide: number = 0;
    private slides: HTMLElement[];
    private intervalId: number | null = null;

    constructor(slideSelector: string) {
        this.slides = Array.from(document.querySelectorAll(slideSelector));
        this.startAutoPlay();

        // Missing: pause button, keyboard controls (arrow keys)
        // Missing: aria-live for announcements
        // Missing: focus management
        // Missing: indication of current slide
    }

    private startAutoPlay(): void {
        this.intervalId = window.setInterval((): void => {
            this.nextSlide();
        }, 3000);
    }

    private nextSlide(): void {
        this.slides[this.currentSlide].style.display = 'none';
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.slides[this.currentSlide].style.display = 'block';
    }
}

/**
 * VIOLATION 18: Creating custom checkbox without ARIA
 */
class InaccessibleCheckbox {
    private element: HTMLDivElement;
    private checked: boolean = false;

    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'custom-checkbox';
        this.element.onclick = (): void => this.toggle();

        // Missing: role="checkbox"
        // Missing: aria-checked
        // Missing: tabindex="0"
        // Missing: keyboard support (Space key)
        // Missing: label association
    }

    private toggle(): void {
        this.checked = !this.checked;
        this.element.classList.toggle('checked');
    }

    public render(): HTMLDivElement {
        return this.element;
    }
}

/**
 * VIOLATION 19: Injecting HTML without sanitization or structure
 */
function injectUnsafeContent(userContent: string): void {
    const container: HTMLElement | null = document.getElementById('content');
    if (container) {
        container.innerHTML = userContent; // XSS vulnerability + accessibility issues
        // Missing: sanitization, semantic structure, accessibility attributes
    }
}

/**
 * VIOLATION 20: Creating drag-and-drop without keyboard alternative
 */
class InaccessibleDragDrop {
    constructor() {
        this.setupDragDrop();
        // Missing: keyboard alternative
        // Missing: ARIA attributes (aria-grabbed, aria-dropeffect)
        // Missing: instructions for screen reader users
    }

    private setupDragDrop(): void {
        const draggables: NodeListOf<HTMLElement> = document.querySelectorAll('.draggable');

        draggables.forEach((draggable: HTMLElement): void => {
            draggable.addEventListener('dragstart', (e: DragEvent): void => {
                if (e.dataTransfer) {
                    e.dataTransfer.setData('text', draggable.id);
                }
            });
        });

        const dropzones: NodeListOf<HTMLElement> = document.querySelectorAll('.dropzone');

        dropzones.forEach((dropzone: HTMLElement): void => {
            dropzone.addEventListener('drop', (e: DragEvent): void => {
                e.preventDefault();
                if (e.dataTransfer) {
                    const data: string = e.dataTransfer.getData('text');
                    const element: HTMLElement | null = document.getElementById(data);
                    if (element) {
                        dropzone.appendChild(element);
                    }
                }
            });
        });
    }
}

/**
 * VIOLATION 21: Creating loading spinner without announcement
 */
function showLoadingSpinner(): HTMLDivElement {
    const spinner: HTMLDivElement = document.createElement('div');
    spinner.className = 'spinner';
    spinner.innerHTML = '⟳';
    document.body.appendChild(spinner);

    // Missing: aria-live="polite" or role="status"
    // Missing: text alternative like "Loading..."
    // Missing: aria-busy="true" on container

    return spinner;
}

/**
 * VIOLATION 22: Hiding content incorrectly
 */
function hideContentWrong(element: HTMLElement): void {
    element.style.display = 'none'; // Hides from everyone including screen readers
    // Should consider: aria-hidden="true" if content should remain in DOM
    // Or use visibility: hidden with proper ARIA
    // Or remove from DOM entirely if truly not needed
}

/**
 * VIOLATION 23: Creating accordion without proper ARIA
 */
class InaccessibleAccordion {
    private container: HTMLDivElement;

    constructor(sections: Array<{ header: string; content: string }>) {
        this.container = document.createElement('div');

        sections.forEach((section, index: number): void => {
            const header: HTMLDivElement = document.createElement('div');
            header.textContent = section.header;
            header.onclick = (): void => this.togglePanel(index);

            const panel: HTMLDivElement = document.createElement('div');
            panel.innerHTML = section.content;
            panel.style.display = 'none';

            this.container.appendChild(header);
            this.container.appendChild(panel);
        });

        // Missing: role="button" on headers
        // Missing: aria-expanded
        // Missing: aria-controls
        // Missing: keyboard support (Enter, Space)
        // Missing: unique IDs for aria-controls relationship
    }

    private togglePanel(index: number): void {
        // Toggle logic without ARIA updates
    }

    public render(): HTMLDivElement {
        return this.container;
    }
}

/**
 * VIOLATION 24: Using click events only (no keyboard support)
 */
function addClickOnlyHandler(selector: string, callback: () => void): void {
    const elements: NodeListOf<Element> = document.querySelectorAll(selector);
    elements.forEach((el: Element): void => {
        (el as HTMLElement).onclick = callback;
        // Missing: onkeydown/onkeyup for Enter/Space keys
        // Missing: tabindex if not naturally focusable
    });
}

/**
 * VIOLATION 25: Creating progress indicator without ARIA
 */
function updateProgressSilently(percent: number): void {
    const bar: HTMLElement | null = document.querySelector('.progress-bar');
    if (bar) {
        bar.style.width = `${percent}%`;
        // Missing: role="progressbar"
        // Missing: aria-valuenow
        // Missing: aria-valuemin
        // Missing: aria-valuemax
        // Missing: aria-label or aria-labelledby
    }
}

// Export for testing
export {
    createInaccessibleButton,
    removeFocusIndicators,
    showInaccessibleModal,
    updateContentSilently,
    createInaccessibleForm,
    disableWithoutFeedback,
    InaccessibleInfiniteScroll,
    autoPlayMedia,
    InaccessibleDropdown,
    InaccessibleTimeout,
    createInaccessibleTooltip,
    navigateWithoutFocus,
    InaccessibleTabs,
    setConfusingTabOrder,
    showInaccessibleAlert,
    breakKeyboardNavigation,
    InaccessibleCarousel,
    InaccessibleCheckbox,
    injectUnsafeContent,
    InaccessibleDragDrop,
    showLoadingSpinner,
    hideContentWrong,
    InaccessibleAccordion,
    addClickOnlyHandler,
    updateProgressSilently
};