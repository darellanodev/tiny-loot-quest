---
name: clean-implementation
description: Implement new features and code with readability and maintainability in mind. Use when asked to build, create, add, or implement something from scratch.
license: MIT
compatibility: opencode
---

# Clean Implementation Skill

## What this means

Writing clean code from the start is cheaper than cleaning it up later. These rules apply when building something new — a feature, a function, a module, or a class.

Priority order:

1. **Readability** — code is read much more than it is written
2. **Simplicity** — the simplest solution that works is usually the right one
3. **Consistency** — match the style already in the codebase
4. **DRY** — avoid duplication, but don't create abstractions before you need them

## Hard rules

- **Never add comments.** Code should explain itself through good naming and structure. No docstrings, no inline notes, no TODOs.
- **Don't over-engineer.** Build what is needed now. If a use case doesn't exist yet, don't build for it.
- **Output code only.** No explanation unless the user asks.
- **Design the interface first.** Think about how the code will be called before writing the implementation.

---

## What to do

### Design the interface first

Before writing the implementation, think about how it will be used:

- What does the caller need to pass in?
- What does the caller get back?
- What can go wrong, and how will the caller know?

A clean interface hides complexity inside and exposes only what is needed.

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

- Start simple. Add complexity only when the problem requires it
- Replace magic numbers and strings with named constants from the start
- Use separate functions or option objects instead of `true/false` flags in arguments
- Keep ternaries short; if they don't fit on one line, use an `if`

### SOLID (use judgment, not religion)

- **Single Responsibility**: one reason to change per function, class, or module
- **Open/Closed**: design so new behavior can be added without editing existing code
- **Liskov**: subtypes should work anywhere their parent type is expected
- **Interface Segregation**: don't make callers depend on things they don't use
- **Dependency Inversion**: depend on abstractions at module boundaries, not on concrete classes

### YAGNI — don't build what you don't need yet

Only build what the current use case requires. Don't add parameters, options, or abstractions for future cases that may never come.

If a need is not real today, leave it out. It's easier to add something later than to remove something that turned out to be wrong.

### Error handling

Think about errors from the start, not as an afterthought:

- Make errors explicit in the return type when failure is a normal case
- Use exceptions only for truly unexpected situations
- Error messages should say what went wrong and where, not just "error" or "invalid input"
- Don't swallow errors silently

### Value Objects over primitives

When a value has its own rules — like an email, a price, or an ID — give it its own type from the start. Don't wait until the validation is duplicated in three places.

Signs that a primitive needs its own type:

- It needs to be validated before use
- A function takes several arguments of the same type — easy to pass them in the wrong order
- It always travels with a check or transformation

Note: if the concept has its own identity and life cycle (like a `User` or an `Order`), it's an Entity. That's a bigger design conversation — bring it up before implementing.

**Before** — both arguments are `string`; passing them in the wrong order compiles fine:

```typescript
function createUser(userId: string, email: string) {
  if (!email.includes("@")) throw new Error("Invalid email");
}

createUser("alice@example.com", "usr_123");
```

**Prefer** — one type that holds its own validation; you can't pass a plain string where an `Email` is expected:

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
```

### Pure functions

Write pure functions by default — functions that only depend on their inputs and have no side effects. Add side effects only where needed.

- Keep business logic in pure functions
- DB calls, I/O, timers, and network calls should wrap pure logic, not be mixed into it
- Pure functions are easy to test without mocks or setup

**Prefer** — the discount logic is a pure function; the DB part just calls it:

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

### DTOs

Use DTOs only at the edges of the system — what comes in from HTTP, what goes out to the client, what comes from the database. Don't create DTOs between internal layers.

- If a DTO looks exactly like the domain model, remove it — it adds noise without value
- In TypeScript, `Pick<>` and `Omit<>` often replace a DTO class with no downside

```typescript
type CreateUserRequest = Pick<User, "email" | "name">;
```

---

## What NOT to do

- Don't add abstractions before you have two or more real use cases for them
- Don't add parameters or options for future needs that don't exist yet
- Don't mix business logic with side effects in the same function
- Don't use `any` as a shortcut — it hides problems that will appear later
- Don't leave error handling for later — it's harder to add cleanly after the fact

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

Output the code directly. No explanation unless asked.

If a design decision is not obvious, propose options and wait for confirmation before implementing.

If the scope is large, describe the structure first and wait for confirmation.
