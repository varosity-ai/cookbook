# Contributing to Varosity Cookbook

Thank you for your interest in Varosity! We welcome contributions from agents, developers, and the community.

## What We're Looking For

✅ **New Examples** — Agent-first use cases (product videos, music videos, avatar, etc.)  
✅ **Bug Fixes** — Issues in existing examples  
✅ **Documentation** — Better READMEs, guides, troubleshooting  
✅ **Performance** — Faster rendering, cost optimization  
✅ **Tests** — Test coverage for examples  

## How to Contribute

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR-USERNAME/cookbook.git
cd cookbook
npm install
```

### 2. Create a Branch

```bash
git checkout -b feature/my-new-example
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes

**For new examples:**
- Create directory: `examples/[your-example]/`
- Include: `src/index.ts`, `README.md`, `package.json`, `tsconfig.json`, `.env.example`
- Follow the [Example Template](#example-template) below
- Comprehensive README (8+ KB) with 5+ usage examples

**For bug fixes:**
- Update the broken example
- Test with `npm run build` and `npm run type-check`
- Update README if behavior changes

**For docs:**
- Edit the relevant README
- Keep language clear and examples runnable

### 4. Test Your Code

```bash
# Lint
npm run lint

# Type check
npm run type-check

# Build
npm run build

# Test with your VAROSITY_API_KEY (optional)
export VAROSITY_API_KEY=vsk_live_YOUR_KEY
npm run example-name
```

### 5. Commit and Push

```bash
git add .
git commit -m "✨ Add: [What you added/fixed]

Description of your changes.

Fixes #123 (if applicable)
"
git push origin feature/my-new-example
```

### 6. Create a Pull Request

- Title: `✨ Add: [Example Name]` or `🐛 Fix: [Bug]`
- Description: Link the GitHub issue, explain what you added, any trade-offs
- Checklist items (see template)

**Our team reviews PRs within 24 hours.**

---

## Example Template

When adding a new example, use this structure:

```
examples/[your-example]/
├── src/
│   └── index.ts          # Main implementation
├── .env.example          # Template for API key
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── README.md             # Comprehensive guide
```

### README Structure

```markdown
# [Example Name]

One-line description.

## What It Does

2-3 paragraphs explaining the use case + motivation.

## Prerequisites

- Node.js 18+
- npm
- Varosity API key

## Getting Started

```bash
cd [example]/
cp .env.example .env
# Edit .env
npm install
npm run example
```

## Usage Examples

5+ different scenarios with CLI commands.

## How to Use in Your Agent

Show how to use this example in Hermes/Claude/etc.

## Troubleshooting

Common issues + solutions.

## Resources

- Link to API docs
- Link to related examples
- Links to discussions
```

### Example Code Style

```typescript
import "dotenv/config";

// Descriptive function names
async function myFeature(input: string): Promise<string> {
  // Explicit error handling
  if (!process.env.VAROSITY_API_KEY) {
    throw new Error("VAROSITY_API_KEY is required");
  }

  // Clear logic with comments for complex sections
  const result = await doSomething(input);
  return result;
}

// CLI-friendly main()
async function main() {
  try {
    const result = await myFeature("test");
    console.log("✅ Success:", result);
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
```

---

## Code Standards

### TypeScript
- Strict mode enabled (`strict: true` in tsconfig.json)
- All functions typed
- No `any` types without comment explaining why

### Naming
- Functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case` (index.ts is ok)

### Errors
- Always throw descriptive errors: `throw new Error("Cannot find API key. Get one at ...")`
- CLI tools exit with `process.exit(1)` on error
- Never silently fail

### Dependencies
- Prefer standard library (fs, path, etc.)
- Use `node-fetch` for HTTP (included in Node 18+)
- Avoid large dependencies (keep examples small)
- Explain why each dependency is needed

### Comments
- Explain *why*, not *what* (code shows what)
- Mark complex sections: `// Complex: Explain the algorithm here`
- Keep comments up-to-date with code

---

## Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

### Type
- `✨ Add` — New example or feature
- `🐛 Fix` — Bug fix
- `📖 Docs` — Documentation
- `🎨 Style` — Code style/formatting
- `♻️ Refactor` — Code refactoring
- `⚡ Perf` — Performance improvements
- `🧪 Test` — Adding tests

### Subject
- Imperative mood ("Add" not "Added")
- Don't capitalize
- No period at end
- Max 50 characters

### Body
- Explain what and why, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer
- Reference issues: `Fixes #123`
- Breaking changes: `BREAKING CHANGE: ...`

### Examples
```
✨ Add: Multi-model comparison tool

Generate same prompt with 3 models to compare quality/speed/cost.
Useful for agents deciding which model to use.

Fixes #42

---

🐛 Fix: Instagram carousel duration validation

Previously accepted invalid durations. Now validates 1-60 seconds.

Closes #128

---

📖 Docs: Add prompting guide

Comprehensive guide for writing effective prompts for video generation.
Includes tips for each model (Kling, Veo, Runway).
```

---

## Review Process

### What We Check

1. **Functionality** — Does it work as described?
2. **Code Quality** — Is it well-written, maintainable?
3. **Documentation** — Is it clear? Can someone learn from it?
4. **Testing** — Does it run without errors?
5. **Examples** — Are there 5+ working examples?

### Before Merging

- ✅ All CI checks pass
- ✅ At least one reviewer approves
- ✅ No merge conflicts
- ✅ Examples run successfully
- ✅ READMEs are accurate

---

## Community Guidelines

### Be Respectful
- Treat all contributors with respect
- We're here to help each other
- Welcome feedback and suggestions

### Stay On Topic
- Keep issues and discussions focused
- Use appropriate categories

### Report Security Issues Privately
- **Do NOT** open public issues for security vulnerabilities
- Email: security@varosity.ai
- We'll handle it with priority and credit you

---

## Questions?

- 📖 **[API Reference](https://github.com/varosity-ai/api)** — API docs
- 💬 **[GitHub Discussions](https://github.com/varosity-ai/issues-public/discussions)** — Ask questions
- 🐛 **[GitHub Issues](https://github.com/varosity-ai/cookbook/issues)** — Report bugs

---

## Contributor License Agreement

By submitting a pull request, you agree that:
- Your contribution is original
- You grant Varosity Inc. a license to use your contribution under the MIT License
- You have the authority to make the grant

---

**Thank you for contributing to Varosity! 🚀**

*Last updated: May 15, 2026*
