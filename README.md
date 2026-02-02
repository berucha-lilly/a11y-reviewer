# GitHub Accessibility Reviewer MCP Server

[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA-green)](https://www.w3.org/WAI/WCAG22/quickref/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![MCP Server](https://img.shields.io/badge/MCP-Server-purple)](https://modelcontextprotocol.io/)

**GitHub-Based Accessibility Reviewer with MCP**: Automated accessibility checks for pull requests using a Model Context Protocol (MCP) server. It enforces WCAG 2.2 AA rules via a hybrid analyzer (fast regex + ESLint `jsx-a11y`) and posts results back to PRs.

## Table of Contents

- [What it does](#-what-it-does)
- [Quick Start](#-quick-start)
- [MCP Tools Reference](#-mcp-tools-reference)
- [GitHub Actions Integration](#-github-actions-integration)
  - [Developer Integration Steps](#developer-integration-steps-in-your-app-repo)
  - [What Happens on Each PR](#what-happens-on-each-pr)
  - [Making Checks Required](#making-checks-required)
  - [Configuration](#configuration-a11yconfigjson)
  - [Testing](#testing)
- [Reference](#-reference)
- [License](#-license)

## ✅ What it does

- Hybrid analysis (regex + ESLint `jsx-a11y`)
- Supports `.js`, `.jsx`, `.ts`, `.tsx`, `.html`, `.htm`, `.css`, `.scss`
- GitHub Actions integration with PR comments
- MCP tools for single-file, batch, and fix suggestions

### MCP Tools Available

The server provides **3 MCP tools** via JSON-RPC:

1. **`check_accessibility`**: Analyze a single file for violations
2. **`check_accessibility_batch`**: Analyze multiple files in one request
3. **`suggest_fix`**: Get detailed remediation guidance for violations

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **GitHub repository** with admin access (for GitHub Actions integration)

### Installation (in this repo)

1. **Install dependencies**
```bash
npm install
```

2. **Generate integration files**
```bash
node scripts/setup-integration.js
```

3. **Commit and push**
```bash
git add .github/ .a11y/
git commit -m "Add accessibility checks"
git push
```

## 🔧 MCP Tools Reference

The server implements the Model Context Protocol and provides 3 tools accessible via JSON-RPC:

### Tool 1: `check_accessibility`
Analyze a single file for accessibility violations.

**Input Schema:**
```json
{
  "filePath": "src/components/Button.jsx",
  "content": "<button></button>"
}
```

**Example Request:**
```bash
cat << 'EOF' | node src/mcp-server.js
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "check_accessibility",
    "arguments": {
      "filePath": "test.jsx",
      "content": "<img src='logo.png' />"
    }
  }
}
EOF
```

**Returns:**
- Violation count
- List of violations with line numbers
- Severity levels (error/warning)
- WCAG criteria references
- Fix suggestions

---

### Tool 2: `check_accessibility_batch`
Analyze multiple files in a single request.

**Input Schema:**
```json
{
  "files": [
    {
      "path": "src/App.jsx",
      "content": "..."
    },
    {
      "path": "src/styles.css",
      "content": "..."
    }
  ]
}
```

**Returns:**
- Per-file results
- Summary statistics
- Overall pass/fail status

---

### Tool 3: `suggest_fix`
Get detailed remediation guidance for specific violation types.

**Input Schema:**
```json
{
  "violationId": "img-missing-alt",
  "code": "<img src='logo.png' />"
}
```

**Returns:**
- Step-by-step fix instructions
- Code examples (before/after)
- WCAG documentation links
- Best practices

## 🔗 GitHub Actions Integration

Automatically check every pull request for accessibility violations.

### Developer Integration Steps (in your app repo)

1. From your app repo, clone the tool into a sibling folder (same parent directory):

```bash
git clone https://github.com/berucha-lilly/a11y-mcp.git ../a11y-mcp
```

2. Run the setup script from your app repo (using that sibling path):

```bash
node ../a11y-mcp/scripts/setup-integration.js
```

3. Commit the generated files in your app repo:

```bash
git add .github/ .a11y/ .gitignore
git commit -m "Add accessibility checks"
git push
```

This creates in your app repo:
- `.github/a11y-mcp/` (MCP server + PR analyzer + minimal dependencies)
- `.github/workflows/accessibility-review.yml` (GitHub Actions workflow)
- `.a11y/config.json` (config)

### What Happens on Each PR

1. **Trigger**: Workflow runs on every PR that changes `.js`, `.jsx`, `.html`, `.css`, or `.scss` files
2. **Analysis**: MCP server checks all changed files via JSON-RPC
3. **Reporting**: Bot comments on PR with:
   - Total violations found
   - Per-file breakdown
   - Line numbers and descriptions
   - Fix suggestions
   - WCAG criteria references
4. **Status Check**: Pass/fail check that can block merging

### Example PR Comment

```markdown
## 🔍 Accessibility Review Results (via MCP)

**Files Checked:** 3
**Total Violations:** 5 (4 errors, 1 warning)

### ❌ src/components/Button.jsx
- **Line 12**: [ERROR] Image missing alt attribute
  - Fix: Add alt="description" to image
  - WCAG: 1.1.1 (Level A)

- **Line 24**: [ERROR] Div used as button
  - Fix: Use <button> element instead
  - WCAG: 4.1.2 (Level A)
```

### Making Checks Required

To **block merging** when violations are found:

1. Go to **Repository Settings** → **Branches**
2. Add/edit branch protection rule for `main`
3. Enable "Require status checks to pass before merging"
4. Select "Check Accessibility via MCP"
5. Save changes

### Configuration (.a11y/config.json)

The setup script creates a default config file. Key options:

- `wcagLevel` and `wcagVersion` set the compliance target.
- `rules` can enable/disable checks and set severity.
- `failureThresholds` controls pass/fail behavior on PRs.
- `ignore` supports glob patterns for exclusions.

### Testing

#### Pre-PR Local Scan (changed files only)

Run the local analyzer against files changed versus `origin/main`:

```bash
node scripts/analyze-pr-mcp.js
```

Results are written to `scripts/a11y-results.json`.

#### Validation Suite

```bash
npm test
```

## 📚 Reference

- **[WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)** - Official WCAG documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.