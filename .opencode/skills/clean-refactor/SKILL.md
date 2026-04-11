---
name: clean-refactor
description: Refactor code for readability and maintainability without changing behavior. Use when asked to clean up, simplify, restructure, or improve existing code.
license: MIT
compatibility: opencode
---

# Clean Refactor Skill

## What refactoring means

Improve how code is structured without changing what it does. Priority order:

1. **Readability** — code is read much more than it is written
2. **Minimal changes** — only change what needs to change
3. **Consistency** — match the style already in the codebase
4. **DRY** — remove duplication only when the result is clearly simpler

## Hard rules

- **Never add comments.** The user's comments are there on purpose. Keep them as-is. Never add new ones — no docstrings, no inline notes, no TODOs.
- **Be conservative.** Only change what is clearly better. When not sure, leave it.
- **Output code only.** No explanation unless the user asks.
- **Don't change behavior.** If a change could affect behavior — even in rare cases — don't do it without flagging it.

---

## What to improve

### Naming

- Names should say what something is or does, without needing a comment
- Avoid short forms unless everyone knows them (`i`, `id`, `url`, `db`)
- Booleans: use `is`, `has`, `can`, `should` prefixes
- Functions: use verb phrases that say what they do (`getUserById`, not `fetchUserFromDbById`)
- Avoid empty words: `data`, `info`, `manager`, `helper`, `utils` say nothing
- TypeScript/JS: `camelCase` for variables and functions, `PascalCase` for types and classes, `SCREAMING_SNAKE_CASE` for true constants

### Functions

- One level of detail per function
- If you need "and" to describe what a function does, split it into two
- Use early returns instead of deep nesting
- Put guard clauses at the top to keep the happy path clean
- Around 20 lines is a sign to reconsider, not a hard limit

### Structure

- Code that belongs together should live together
- Group by feature, not by type (avoid dumping grounds like `utils/` or `helpers/`)
- In TypeScript: write explicit types on public APIs; let inference work inside

### Complexity

- Replace nested `if` blocks with early returns or small named functions
- Replace magic numbers and strings with named constants
- Replace `true/false` flags in function arguments with separate functions or option objects
- Keep ternaries short; if they don't fit on one line, use an `if`

### SOLID (use judgment, not religion)

- **Single Responsibility**: one reason to change per function, class, or module
- **Open/Closed**: add new behavior by extending, not by editing existing code
- **Liskov**: subtypes should work anywhere their parent type is expected
- **Interface Segregation**: don't make callers depend on things they don't use
- **Dependency Inversion**: depend on abstractions at module boundaries, not on concrete classes

### Primitive Obsession and Value Objects

When a primitive (`string`, `number`) is validated or checked in more than one place, it probably needs its own type.

Signs to look for:

- The same validation appears in more than one function
- A function takes several arguments of the same type — easy to pass them in the wrong order
- A primitive always travels with a check or transformation

The right approach: **point out the problem, suggest a Value Object, but don't apply it without confirmation.** Adding a Value Object changes constructors, serialization, and tests — it's a design decision, not a small fix.

Note: if the concept has its own identity and life cycle (like a `User` or an `Order`), it's an Entity, not a Value Object. That's a bigger design conversation, outside the scope of this skill.

**Before** — the same validation in two places; both arguments are `string` so passing them in the wrong order compiles fine:

```typescript
function createUser(userId: string, email: string) {
  if (!email.includes("@")) throw new Error("Invalid email");
}

function updateEmail(userId: string, email: string) {
  if (!email.includes("@")) throw new Error("Invalid email");
}

createUser("alice@example.com", "usr_123");
```

**Proposed refactor** — one type that holds its own validation; you can't pass a plain string where an `Email` is expected:

```typescript
class Email {
  private constructor(readonly value: string) {}

  static parse(raw: string): Email {
    if (!raw.includes("@")) throw new Error(`Invalid email: ${raw}`);
    return new Email(raw);
  }

  toString() {
    return this.value;
  }
}

function createUser(userId: string, email: Email) {
  /* ... */
}
function updateEmail(userId: string, email: Email) {
  /* ... */
}
```

### Pure functions

A pure function only depends on its inputs and has no side effects. It's easy to test and easy to reason about.

The goal is not to remove side effects — they are needed. The goal is to **keep them separate**. Put logic in pure functions; put side effects at the edges.

- Extract logic that doesn't need outside state into its own function
- If a function reads from `this`, a closure, or a global just to do a calculation, consider passing that value as a parameter instead
- DB calls, I/O, timers, and network calls should wrap pure logic, not be mixed into it
- Only do this when the change is small and clean; if it's a big structural change, propose it first

**Before** — logic and DB call are mixed; you can't test the discount rules without hitting the database:

```typescript
class OrderService {
  async applyDiscount(orderId: string, userType: string) {
    const order = await this.db.orders.findById(orderId);
    if (userType === "premium") {
      order.total = order.total * 0.9;
    } else if (order.total > 100) {
      order.total = order.total * 0.95;
    }
    await this.db.orders.save(order);
  }
}
```

**After** — the discount logic is a pure function; the DB part just calls it:

```typescript
function calculateDiscount(total: number, userType: string): number {
  if (userType === "premium") return total * 0.9;
  if (total > 100) return total * 0.95;
  return total;
}

class OrderService {
  async applyDiscount(orderId: string, userType: string) {
    const order = await this.db.orders.findById(orderId);
    order.total = calculateDiscount(order.total, userType);
    await this.db.orders.save(order);
  }
}
```

---

## What NOT to touch

- Code that is already clear and follows these rules
- Comments the user wrote — treat them as intentional
- Code where the correct behavior is not clear without more context
- Performance optimizations that make code harder to read (unless asked)
- Style choices with no clear winner

---

## TypeScript/JavaScript specifics

- Use `const` over `let`; never use `var`
- Use `?.` and `??` instead of manual null checks
- Use `array.find()`, `filter()`, `map()` when they read more clearly than a loop
- Avoid `any`; use `unknown` with a type check, or use generics
- Destructure function parameters when you use 2 or more fields from an object
- Use `as const` for objects that should not change
- Use discriminated unions instead of boolean flags to model state

---

## Output format

Output the refactored code directly. No explanation unless asked.

If a change could affect behavior, add one inline note: `// ⚠️ behavioral change: <why>` — the only exception to the no-comments rule.

If the changes are large, list what you plan to do first and wait for confirmation.

After completing a refactor, propose a commit message in conventional commits format (e.g., `refactor: description`). Do not create the commit — just show the suggested message so the user can commit manually.

Always verify the refactored code passes tests by running `pnpm test`.
