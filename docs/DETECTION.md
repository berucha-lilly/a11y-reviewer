# Detection Capabilities

This document lists the accessibility issues the analyzers detect. Each violation in the report includes a mapped WCAG reference and suggested fixes.

Summary: analyzers run in a pipeline — regex fast-pass → hybrid routing → specific analyzers (ESLint/Babel/html/css). See the "Example violation output" section below for the normalized JSON schema. Note: the report file `.github/a11y-mcp/a11y-results.json` is overwritten on each run.

## Regex-based fast-path checks
The `regex-analyzer.js` implements a fast pattern-matching pass that catches a number of common issues across HTML/JSX/JS and CSS files. This pass runs first and is deliberately conservative: findings are quick to compute, may have less-precise locations, and can be re-evaluated by the deeper analyzers that run later.

- `button-missing-accessible-name` — buttons with no visible text or `aria-label`
- `link-non-descriptive` — links with non-descriptive text like "click here" or "read more"
- `missing-h1` and `heading-level-skip` — missing top-level heading or skipped heading levels
- `aria-labelledby-invalid` — `aria-labelledby` references a non-existent ID
- `input-missing-label` — form inputs without labels (regex fast-path)
- `duplicate-id` — duplicate `id` attributes found
- `iframe-missing-title` — iframes without a `title` attribute

CSS-specific fast-path checks:

- `outline-none-no-alternative` — `outline: none` or `outline: 0` without an alternative focus indicator
- `font-size-too-small` / `font-size-small` — very small font sizes detected in CSS
- `touch-target-too-small` — width/height values below WCAG touch target minimums
- `display-none-on-interactive` — `display:none` used on likely interactive classes
- `text-transparent` — `color: transparent` found
- `pointer-events-none` — `pointer-events: none` on interactive selectors

## Routing
The `hybrid-analyzer.js` file is responsible for routing files to the appropriate analyzer (regex fast-path, ESLint + jsx-a11y, Babel AST JS analyzer, html-analyzer, or css-analyzer). See `src/core/hybrid-analyzer.js` for routing logic and override points.

## Analyzer details (workflow order)
### JSX/TSX Files (ESLint + jsx-a11y)
- Missing alt text on images in JSX
- Interactive elements without keyboard support
- Missing ARIA attributes on components
- Form inputs without labels
- Click handlers on non-interactive elements
- Improper ARIA roles and properties
- Autofocus usage
- Redundant roles

### JavaScript / TypeScript Files (Babel AST parser)
- Focus outline removal via style manipulation
- Div/span used as buttons without ARIA
- Missing keyboard event handlers
- Positive tabIndex values
- Autoplay media without controls
- Form inputs without labels (via createElement)
- Placeholder-only labels
- Missing focus management in modals
- Missing aria-live regions for dynamic content
- Click-only event handlers
- Drag-and-drop without keyboard alternatives
- Inaccessible custom components (dropdowns, tabs, carousels, accordions)
- Unsafe HTML injection / innerHTML without sanitization
- Loading spinners or progress not announced to assistive tech

### HTML / HTM Files (htmlparser2)
- Missing lang attribute on <html>
- Missing or empty <title> element
- Images missing alt attributes
- Form inputs without associated labels
- Empty buttons and links
- Iframes without titles
- Divs used as buttons without proper ARIA
- Positive tabindex values
- Tables without proper structure (th, caption, scope)
- Redundant or invalid ARIA roles
- Missing main landmark
- Deprecated marquee elements
- Media without captions track
- Links opening in new tabs without warning
- Navigation without nav element
- Placeholder-only form labels
- Missing autocomplete on auth fields
- Improper heading hierarchy (skipped levels)
- Fieldset without legend
- Duplicate ID attributes
- Focus outline removal via inline/styles

### CSS / SCSS (PostCSS)
- Missing focus styles on interactive elements
- Removed focus outlines without replacements
- Insufficient focus indicators (< 2px)
- Hover-only interactions without focus alternatives
- Low contrast text colors (< 4.5:1 ratio)
- Transparent text colors
- Animations without reduced-motion support
- Small font sizes (< 14px)
- Viewport units (vw/vh) for font sizing
- Insufficient touch targets (< 44x44px)
- Improper screen reader hiding techniques
- Text-indent hiding (-999px or less)
- Restrictive text spacing and line-height (< 1.4)
- Overflow hidden on text containers
- Horizontal scrolling (overflow-x)
- Large fixed widths without scaling (≥600px)
- Text justification (text-align: justify)
- All-caps text (text-transform: uppercase)
- Pointer-events disabled on interactive elements
- !important overuse on typography/color
- Forced-colors / high-contrast overrides missing

---

Each analyzer normalizes output to include:
- `ruleId` — internal rule identifier
- `severity` — `error` or `warning`
- `message` — human-readable description
- `line` / `column` — approximate location
- `wcag` — array of WCAG references
- `fix` / `suggestions` — remediation guidance

## Representative ruleId → analyzer mapping
This small table shows where a finding typically originates to help triage:

| ruleId | Primary analyzer |
|---|---|
| `img-missing-alt` | `html-analyzer.js` |
| `input-missing-label` | `regex-analyzer.js` / `html-analyzer.js` |
| `jsx-a11y/click-events-have-key-events` | ESLint + `jsx-a11y` |
| `outline-none-no-alternative` | `css-analyzer.js` / `regex-analyzer.js` |
| `duplicate-id` | `regex-analyzer.js` / `html-analyzer.js` |

## Example violation output
Below is an example of a normalized violation object as produced by the analyzers (JSON):

```json
{
	"ruleId": "img-missing-alt",
	"severity": "error",
	"message": "Image elements must have an alt attribute",
	"line": 12,
	"column": 5,
	"wcag": ["1.1.1"],
	"fix": ["Add alt attribute: <img src=\"logo.png\" alt=\"Company logo\">"],
	"suggestions": ["Provide meaningful alt text", "Use alt=\"\" for decorative images"]
}
```

For implementation details, see `src/core/html-analyzer.js`, `src/core/css-analyzer.js`, `src/core/js-analyzer.js`, `src/core/hybrid-analyzer.js`, and `src/core/regex-analyzer.js`.
