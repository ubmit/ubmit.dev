---
title: "Introduction to Functional Programming in JavaScript"
description: "A friendly introduction to the functional world through JS."
pubDate: "Jan 08 2022"
---

The motivation behind this blog post is to challenge the myth that functional programming, FP for short, is hard to learn and isn't possible to be used with JavaScript.

## Origins of Functional Programming in JavaScript

The functional paradigm has noticeably grown in the past years. Currently, there are interesting functional languages with good JavaScript intertop. Some of those languages included PureScript, ClojureScript, Elm and ReScript. They help us creating solutions to real-world problems. FP, however, is not all that new and in fact it's quite old! It started with LISP at 1968 and came from a project led by John McCarthy at MIT.

## Why Should I Care?

Now, you may be asking yourself whether or not you should care about FP. To help answer this question, let's take a look at a problem being solved in different ways, starting with a typical procedural approach and gradually improving it using functional programming concepts.

### The Procedural Way

Imagine we're building a feature to validate and process user input for a registration form. Here's how many developers might approach it:

```js
// Procedural approach
function processUserRegistration(userInput) {
  let username = userInput.username;
  let errors = [];

  // Validation logic mixed with processing
  if (username) {
    username = username.trim();

    if (username.length > 0) {
      username = username.toLowerCase();

      // Check database
      const existingUser = database.users[username];
      if (existingUser) {
        errors.push("Username already exists");
        return { success: false, errors: errors };
      } else {
        // More validation
        if (username.length < 3) {
          errors.push("Username too short");
          return { success: false, errors: errors };
        }

        if (!/^[a-z0-9]+$/.test(username)) {
          errors.push("Username contains invalid characters");
          return { success: false, errors: errors };
        }

        // Success case buried at the bottom
        return { success: true, username: username };
      }
    } else {
      errors.push("Username cannot be empty");
      return { success: false, errors: errors };
    }
  } else {
    errors.push("Username is required");
    return { success: false, errors: errors };
  }
}
```

This code works, but it has several problems:

- **Nested conditionals** make it hard to follow the logic
- **Multiple return points** scattered throughout
- **Mutations** (`let` variables being reassigned)
- **Mixed concerns** (validation, transformation, and database checks all in one function)
- **Hard to test** (you'd need to mock the database for every test)
- **Hard to reuse** (can't use individual validation rules elsewhere)

### The Functional Way (Pure Functions)

Let's refactor this using pure functions. First, we'll break down the problem into small, testable pieces:

```js
// Small, pure functions that do one thing each
const trim = (str) => str.trim();
const toLowerCase = (str) => str.toLowerCase();
const isNotEmpty = (str) => str.length > 0;
const isMinLength = (min) => (str) => str.length >= min;
const isAlphanumeric = (str) => /^[a-z0-9]+$/.test(str);

// Validation functions that return error messages or null
const validateNotEmpty = (username) =>
  isNotEmpty(username) ? null : "Username cannot be empty";

const validateMinLength = (username) =>
  isMinLength(3)(username) ? null : "Username too short";

const validateAlphanumeric = (username) =>
  isAlphanumeric(username) ? null : "Username contains invalid characters";

const checkUserExists = (database) => (username) =>
  database.users[username] ? "Username already exists" : null;

// Compose them together
function processUserRegistration(userInput, database) {
  if (!userInput.username) {
    return { success: false, errors: ["Username is required"] };
  }

  // Transform the input
  const username = toLowerCase(trim(userInput.username));

  // Run all validations
  const validations = [
    validateNotEmpty,
    validateMinLength,
    validateAlphanumeric,
    checkUserExists(database),
  ];

  const errors = validations
    .map((validate) => validate(username))
    .filter((error) => error !== null);

  // Return result
  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, username };
}
```

Notice the improvements:

- **Single responsibility**: Each function does exactly one thing
- **Easy to test**: You can test `isMinLength` without touching a database
- **Reusable**: These validation functions can be used anywhere
- **Composable**: Easy to add or remove validations
- **Readable**: The main function reads like a story

But we can make this even better! Let's introduce function composition.

### Function Composition with Pipe

One powerful concept in FP is **function composition** - combining simple functions to build complex behavior. Let's look at two ways to do this:

```js
// compose: applies functions right to left (like math notation)
const compose =
  (...fns) =>
  (arg) =>
    fns.reduceRight((prev, fn) => fn(prev), arg);

// pipe: applies functions left to right (more intuitive for reading)
const pipe =
  (...fns) =>
  (arg) =>
    fns.reduce((prev, fn) => fn(prev), arg);
```

Now we can transform data in a clear, linear way:

```js
// Transform the username: trim, then lowercase
const prepareUsername = pipe(trim, toLowerCase);

// Or with compose (reads right to left)
const prepareUsername = compose(toLowerCase, trim);

// Usage
prepareUsername("  JohnDoe  "); // "johndoe"
```

The difference is just ordering:

- **`pipe`**: calls functions left to right (trim → toLowerCase)
- **`compose`**: calls functions right to left, matching math notation `f∘g` where `g` is applied first

Most people find `pipe` more intuitive, so we'll use that from now on.

Here's our registration function using `pipe`:

```js
// Now our transformation is crystal clear
const prepareUsername = pipe(trim, toLowerCase);

function processUserRegistration(userInput, database) {
  if (!userInput.username) {
    return { success: false, errors: ["Username is required"] };
  }

  const username = prepareUsername(userInput.username);

  const validations = [
    validateNotEmpty,
    validateMinLength,
    validateAlphanumeric,
    checkUserExists(database),
  ];

  const errors = validations
    .map((validate) => validate(username))
    .filter((error) => error !== null);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, username };
}
```

### Why This Matters

By using pure functions and composition, we've gained several benefits:

**Predictability**: Pure functions always return the same output for the same input. No surprises, no hidden behavior. This makes debugging significantly easier.

**Testability**: Each function can be tested in isolation. Want to test username validation? Just call `validateMinLength("ab")` - no setup required.

**Reusability**: Need to validate usernames in multiple places? Just import the functions you need.

**Refactoring confidence**: Since functions don't depend on external state, you can refactor fearlessly. Change the implementation without worrying about breaking distant parts of your code.

**Readability**: The code reads top-to-bottom like a recipe. No mental juggling of state or jumping around to follow the logic.

In the next sections, we'll explore the core concepts that make this possible, and then introduce some powerful patterns for handling common scenarios like null values and error handling.

## Cornerstones of Functional Programming

### Pure Functions

The concept of a pure function comes from mathematics. To fully understand it, let's take a step back and discuss the mathematical definition of a function.

> "A function is a relation between two sets (A and B), where A is a set of inputs and B is a set of possible outputs. However, each input must be related to exactly one output."

The definition brings up some interesting things:

- An input cannot be related to multiple outputs, it must be related to a single one
- A function doesn't care about its context, it only cares about returning an output for a given input
- A function not only doesn't care about its context, it also doesn't bother affecting it

A pure function holds all of these properties. Let's see what this means in practice:

```js
// ❌ Impure: depends on external state
let maxPrice = 2.0;
const checkPrice = (price) => price <= maxPrice;

checkPrice(1.5); // true
maxPrice = 1.0; // Someone changed it!
checkPrice(1.5); // false - same input, different output!

// ✅ Pure: all inputs are explicit
const checkPrice = (price, maxPrice) => price <= maxPrice;

checkPrice(1.5, 2.0); // true
checkPrice(1.5, 2.0); // true - always the same!
```

The impure version is unpredictable because it depends on external state. The pure version always returns the same output for the same inputs.

Here's another example showing **side effects**:

```js
// ❌ Impure: has side effects
const users = [];
const registerUser = (username) => {
  users.push(username); // Modifies external state!
  console.log(`Registered: ${username}`); // Side effect!
  return username;
};

// ✅ Pure: no side effects, returns new state
const registerUser = (users, username) => {
  return [...users, username]; // Returns new array
};

// The caller handles side effects
const newUsers = registerUser([], "alice");
console.log(`Registered: ${newUsers[0]}`);
```

**Common side effects to avoid in pure functions:**

- Modifying variables outside the function scope
- Mutating input parameters
- Making API calls or database queries
- Writing to files or console
- Getting the current time or random numbers

Pure functions make your code more predictable, testable, and easier to reason about. When you see a pure function, you know exactly what it does just by looking at its inputs and outputs.

## First-Class Functions

A programming language is said to have first-class functions if it holds the following conditions:

✅ A function can be assigned to a variable

```js
function foo(x, y) {
  return x + y;
}

const add = foo;

add(1, 2); // 3
```

✅ A function can be an argument of another function

```js
const fibonacci = [0, 1, 1, 2, 3, 5, 8];

fibonacci.map(checkPrice);
// [ true, true, true, true, false, false, false ]

fibonacci.filter(checkPrice);
// [ 0, 1, 1, 2 ]

fibonacci.reduce(add);
// 20
```

✅ A function can be returned from another function

```js
const checkPrice = (max) => (price) => price <= max;

const checkPriceBelowOrEqualTwo = checkPrice(2);

checkPriceBelowOrEqualTwo(5); // false
```

## Immutability

> "...the true constant is change. Mutation hides change. Hidden change creates chaos." — Eric Elliott

Immutable data structures cannot be modified after they are defined. Instead of changing existing data, you create new versions with the desired changes. This might sound wasteful, but it brings huge benefits for debugging and reasoning about your code.

In JavaScript, only primitive values (strings, numbers, booleans) are immutable by default. When working with objects and arrays, you need to be deliberate about avoiding mutations.

**Why immutability matters:**

- **Predictability**: If data can't change, you always know what you're working with
- **Time-travel debugging**: You can keep old versions of state and replay changes
- **Easier testing**: No need to worry about test pollution from mutations
- **Safe concurrency**: Multiple functions can work with the same data without conflicts

Let's see what mutation looks like and why it's problematic:

```js
// ❌ Mutation can cause bugs
const settings = { theme: "dark", fontSize: 14 };

function updateTheme(settings) {
  settings.theme = "light"; // Mutates the original!
  return settings;
}

const newSettings = updateTheme(settings);
console.log(settings.theme); // "light" - Oops! Original was changed
```

Now let's see the immutable approach:

```js
// ✅ Immutable update using spread operator
const settings = { theme: "dark", fontSize: 14 };

function updateTheme(settings) {
  return { ...settings, theme: "light" }; // Creates new object
}

const newSettings = updateTheme(settings);
console.log(settings.theme); // "dark" - Original unchanged!
console.log(newSettings.theme); // "light" - New version
```

**Important note about `const`**: Using `const` doesn't make objects immutable! It only prevents reassignment of the variable:

```js
const user = { name: "Alice" };
user.name = "Bob"; // This works! const doesn't prevent mutation
user = { name: "Charlie" }; // This fails! const prevents reassignment
```

**Working with nested objects:**

```js
const order = {
  customer: "Alice",
  items: {
    drinks: ["coffee", "tea"],
    food: ["sandwich"],
  },
};

// Update nested data immutably
const updatedOrder = {
  ...order,
  items: {
    ...order.items,
    drinks: [...order.items.drinks, "juice"], // Add new drink
  },
};

// Original is unchanged
console.log(order.items.drinks); // ["coffee", "tea"]
console.log(updatedOrder.items.drinks); // ["coffee", "tea", "juice"]
```

**Working with arrays:**

```js
const fruits = ["apple", "banana", "orange"];

// ✅ Adding items (immutable)
const moreFruits = [...fruits, "mango"];

// ✅ Removing items (immutable)
const lessFruits = fruits.filter((fruit) => fruit !== "banana");

// ✅ Updating items (immutable)
const updatedFruits = fruits.map((fruit) =>
  fruit === "apple" ? "green apple" : fruit,
);

// ❌ Mutating operations to avoid
fruits.push("grape"); // Mutates original
fruits.pop(); // Mutates original
fruits.sort(); // Mutates original
```

As you can see in these examples, the spread operator (`...`) along with array methods like `map` and `filter` help us avoid mutations while working with arrays and objects.

For complex nested updates, there are libraries such as [Immer](https://github.com/immerjs/immer) and [Immutable.js](https://github.com/immutable-js/immutable-js) that make working with immutable data much easier.

## Practical Functional Patterns

Now that we understand the fundamentals—pure functions, first-class functions, and immutability—let's explore some practical patterns that functional programmers use to handle real-world scenarios. Specifically, we'll look at how to safely work with values that might be `null` or `undefined`.

### The Problem with Null

One of the most common bugs in JavaScript comes from trying to access properties on `null` or `undefined`:

```js
const getUserEmail = (userId) => {
  const user = database.findUser(userId); // Might return null
  return user.email; // 💥 Cannot read property 'email' of null
};
```

The traditional solution is defensive checks everywhere:

```js
const getUserEmail = (userId) => {
  const user = database.findUser(userId);
  if (user !== null && user !== undefined) {
    return user.email;
  } else {
    return null;
  }
};
```

This works, but it's verbose and error-prone. Forget one check and your app crashes. There's a better way!

### Introducing the Box Pattern

The **Box** (also called Identity functor) is a simple wrapper that lets us chain operations on a value:

```js
const Box = (x) => ({
  // map: transform the value inside the box
  map: (f) => Box(f(x)),

  // fold: extract the final value
  fold: (f) => f(x),

  // inspect: for debugging
  inspect: () => `Box(${x})`,
});
```

Here's how it works:

```js
const result = Box(5)
  .map((x) => x * 2) // Box(10)
  .map((x) => x + 3) // Box(13)
  .fold((x) => x); // 13

console.log(result); // 13
```

**Why is this useful?** It lets us chain transformations without manually passing values between functions. Think of it like a pipeline where data flows through.

Let's see a more practical example:

```js
// Without Box: manual passing
const formatPrice = (price) => {
  const doubled = price * 2;
  const withTax = doubled * 1.1;
  const rounded = Math.round(withTax);
  const formatted = `$${rounded}`;
  return formatted;
};

// With Box: clear pipeline
const formatPrice = (price) =>
  Box(price)
    .map((x) => x * 2) // Double it
    .map((x) => x * 1.1) // Add tax
    .map(Math.round) // Round
    .map((x) => `$${x}`) // Format
    .fold((x) => x); // Extract

formatPrice(5); // "$11"
```

The `Box` version reads like a recipe: "take the price, double it, add tax, round it, format it." No temporary variables needed!

### Understanding map and fold

Let's break down these two key methods:

**`map(f)`**: Applies a function to the value inside the `Box`, and returns a new `Box` with the transformed value.

```js
Box(10)
  .map((x) => x * 2) // Returns Box(20)
  .map((x) => x + 5); // Returns Box(25)
```

Think of `map` like Array's `map`, but for a single value. It keeps the value "boxed" so you can keep chaining.

**`fold(f)`**: Extracts the value from the `Box` by applying a function to it.

```js
const result = Box(10)
  .map((x) => x * 2)
  .fold((x) => x); // Extracts 20
```

You can think of `fold` as "unboxing" the value to get back to regular JavaScript.

### Extending Box to Handle Null: The Maybe Pattern

Now let's make `Box` smarter so it can handle `null` and `undefined` safely. We'll call this **Maybe** (also known as Option in some languages):

```js
const Maybe = (x) => ({
  // Check if the value is null or undefined
  isNothing: x === null || x === undefined,

  // map: only transform if we have a value
  map(f) {
    return this.isNothing ? Maybe(null) : Maybe(f(x));
  },

  // chain: for functions that return another Maybe
  // prevents Maybe(Maybe(value))
  chain(f) {
    return this.isNothing ? Maybe(null) : f(x);
  },

  // fold: handle both cases (null and value)
  fold(onNothing, onValue) {
    return this.isNothing ? onNothing() : onValue(x);
  },

  // inspect: for debugging
  inspect() {
    return this.isNothing ? "Maybe(Nothing)" : `Maybe(${x})`;
  },
});

// Helper function to create a Maybe from a nullable value
const fromNullable = (x) => Maybe(x);
```

Now we can safely chain operations without checking for null at each step:

```js
const getStreetName = (user) =>
  Maybe(user)
    .map((u) => u.address) // Might be null
    .map((a) => a.street) // Might be null
    .map((s) => s.name) // Might be null
    .fold(
      () => "Unknown street", // Handle null case
      (name) => name, // Handle success case
    );

// Test it
const user1 = { address: { street: { name: "Main St" } } };
const user2 = { address: null };
const user3 = null;

getStreetName(user1); // "Main St"
getStreetName(user2); // "Unknown street"
getStreetName(user3); // "Unknown street"
```

No null checks, no crashes! If any step returns null, the rest of the chain is skipped, and we go straight to the `onNothing` function in `fold`.

### Understanding chain vs map

You might be wondering: when do I use `chain` instead of `map`? Let's clarify:

**Use `map`** when your function returns a regular value:

```js
Maybe(5)
  .map((x) => x * 2) // Returns Maybe(10) ✅
  .fold(
    () => 0,
    (x) => x,
  );
```

**Use `chain`** when your function returns another Maybe:

```js
const safeDivide = (a, b) => (b === 0 ? Maybe(null) : Maybe(a / b));

// ❌ Using map creates Maybe(Maybe(5))
Maybe(10).map((x) => safeDivide(x, 2)); // Maybe(Maybe(5)) - nested!

// ✅ Using chain flattens it to Maybe(5)
Maybe(10).chain((x) => safeDivide(x, 2)); // Maybe(5) - flat!
```

`chain` "flattens" the result, preventing nested Maybes.

### A Complete Example: Safe Data Access

Let's revisit our juice store example from earlier, now using Maybe:

```js
const juices = {
  passionfruit: "$2.50",
  orange: "$2.00",
  apple: "$1.50",
};

// Helper functions (pure!)
const trim = (str) => str.trim();
const toLowerCase = (str) => str.toLowerCase();
const removeAccents = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Process juice name and look up price safely
const getJuicePrice = (inputValue) =>
  Maybe(inputValue)
    .map(trim) // Remove whitespace
    .map(toLowerCase) // Normalize case
    .map(removeAccents) // Remove accents
    .chain((juiceName) => fromNullable(juices[juiceName])) // Lookup (might be null)
    .fold(
      () => "error", // If any step failed or juice not found
      (price) => price, // Success! Return the price
    );

// Test it
getJuicePrice("  Passionfruit  "); // "$2.50"
getJuicePrice("ORANGE"); // "$2.00"
getJuicePrice("banana"); // "error" - not in our list
getJuicePrice(null); // "error" - null input
```

Notice how clean this is compared to nested if-statements! Each transformation is clearly stated, and null handling is automatic.

### Comparing to Traditional Error Handling

You might be wondering: how does this compare to try/catch? Let's see:

```js
// Traditional try/catch approach
function getUserDiscount(userId) {
  try {
    const user = database.findUser(userId);
    if (!user) throw new Error("User not found");

    const membership = user.membership;
    if (!membership) throw new Error("No membership");

    const discount = membership.discount;
    if (!discount) throw new Error("No discount");

    return discount;
  } catch (error) {
    console.error(error.message);
    return 0;
  }
}

// Functional approach with Maybe
const getUserDiscount = (userId) =>
  Maybe(database.findUser(userId))
    .map((user) => user.membership)
    .map((membership) => membership.discount)
    .fold(
      () => 0, // Default if anything is null
      (discount) => discount,
    );
```

The `Maybe` version is shorter, doesn't need try/catch, and makes the "happy path" obvious. Plus, it's composable—you can easily chain more operations.

### When to Use These Patterns

Here's a quick guide for beginners:

**Use pure functions + pipe/compose** for:

- Transforming data
- Simple validations
- Business logic
- Most day-to-day programming

**Use Maybe/Box** when:

- Dealing with nullable values (API responses, database queries, user input)
- You want to chain operations that might fail
- You want to avoid nested if-statements
- You're working with optional data

**Use traditional try/catch** when:

- Dealing with actual exceptions (network errors, file system errors)
- Using libraries that throw errors
- You need to log detailed error information

These patterns aren't about replacing all your code—they're tools in your toolbox. Use them when they make your code clearer and safer.

## Dive Deeper

Fortunately, as it has been shown in this article, it’s definitely possible to use functional programming with plain JavaScript. However, if you really want to dive deeper into this paradigm while using JavaScript, you’ll probably want to use some already existing functional libraries such as [Sanctuary](https://github.com/sanctuary-js/sanctuary), [Fluture](https://github.com/fluture-js/Fluture), [Ramda](https://github.com/ramda/ramda) and others.
