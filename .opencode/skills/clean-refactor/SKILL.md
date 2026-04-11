---
name: clean-refactor
description: Refactor code for readability and maintainability without changing behavior. Use when asked to clean up, simplify, restructure, or improve existing code.
license: MIT
compatibility: opencode
---

# Clean Refactor Skill

## Core philosophy

Refactoring means improving code structure without changing behavior. Priority order:

1. **Readability** — code is read far more than it is written
2. **Minimal changes** — only change what's needed to improve structure
3. **Consistency** — match the style already present in the codebase
4. **DRY** — remove duplication only when the abstraction is clearly better

## Hard rules

- **Never add comments.** The user's comments are intentional. Keep every existing comment exactly as-is. Never add new ones — no docstrings, no inline notes, no TODOs.
- **Be conservative.** Only refactor what's clearly improvable. When in doubt, leave it.
- **Output code directly.** No preamble, no explanation unless the user asks.
- **Don't change behavior.** If a change could alter behavior — even in edge cases — don't make it without flagging it.

---

## What to improve

### Naming

- Names should reveal intent without needing a comment to explain them
- Avoid abbreviations unless universally understood in context (`i`, `id`, `url`, `db`)
- Booleans: use `is`, `has`, `can`, `should` prefixes
- Functions: verb phrases describing what they do (`getUserById`, not `fetchUserFromDbById`)
- Avoid noise words: `data`, `info`, `manager`, `helper`, `utils` are red flags
- TypeScript/JS: `camelCase` for variables/functions, `PascalCase` for types/classes, `SCREAMING_SNAKE_CASE` for true constants

### Functions

- One level of abstraction per function
- If describing a function requires a mental "and", it does two things — split it
- Use early returns instead of deeply nested conditionals
- Guard clauses at the top to reduce nesting
- ~20 lines is a soft signal to reconsider, not a hard rule

### Structure

- Related code lives together; unrelated code lives apart
- Group by feature/domain, not by type (avoid `utils/`, `helpers/` dumping grounds)
- In TypeScript: explicit types on public API boundaries; let inference work internally

### Complexity

- Flatten nested conditionals with early returns or extracted predicates
- Replace magic numbers/strings with named constants
- Replace boolean flags in function signatures with separate functions or option objects
- Simplify ternaries: if it doesn't fit on one readable line, use an `if`

### SOLID (pragmatic, not dogmatic)

- **Single Responsibility**: one reason to change per module/class/function
- **Open/Closed**: prefer extension over modification where the pattern is established
- **Liskov**: don't surprise callers — subtypes should honor their parent's contract
- **Interface Segregation**: don't force consumers to depend on what they don't use
- **Dependency Inversion**: depend on abstractions at module boundaries, not concrete implementations

---

## What NOT to touch

- Code that's already readable and follows these principles
- Comments the user placed — treat them as intentional decisions
- Anything where the correct behavior is unclear without more context
- Performance optimizations that trade readability (unless asked)
- Style preferences with no clear winner

---

## TypeScript/JavaScript specifics

- Prefer `const` over `let`; never use `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`) instead of manual null checks
- Prefer `array.find()`, `filter()`, `map()` over imperative loops when it reads more clearly
- Avoid `any`; use `unknown` + narrowing or proper generics
- Destructure in function parameters when using 2+ fields from an object
- Use `as const` for literal objects that shouldn't be widened
- Prefer discriminated unions over boolean flags for state modeling

---

## Output format

Deliver refactored code directly. No explanation unless asked.

If a change could affect behavior, add a single inline note: `// ⚠️ behavioral change: <why>` — the one exception to the no-comments rule.

If the scope is large, list the planned changes first and wait for confirmation.

---

## Examples

Examples of before/after refactors are added here as the user provides them.
They act as the ground truth for style decisions when rules above are ambiguous.
