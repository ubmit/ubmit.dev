---
title: "Introduction to Functional Programming in JavaScript"
description: "A friendly introduction to the functional world through JS."
pubDate: "Jan 08 2022"
---

The motivation behind this blog post is to challenge the myth that functional programming, FP for short, is hard to learn and isn't possible to be used with JavaScript.

## Origins of Functional Programming in JavaScript

The functional paradigm has noticeably grown in the past years. Currently, there are interesting functional languages with good JavaScript intertop. Some of those languages included PureScript, ClojureScript, Elm and ReScript. They help us creating solutions to real-world problems. FP, however, is not all that new and in fact it's quite old! It started with LISP at 1968 and came from a project led by John McCarthy at MIT.

## Why Should I Care?

Now, you may be asking yourself whether or not you should care about FP. To help answer this question, let’s take a look at a problem being solved in a “more standard way” (imperative programming) and compare it to the “functional way”.

```js
const juices = {
  passionfruit: "$2.50",
  orange: "$2.00",
  apple: "$1.50",
};

// standard
const getJuicePrice = (inputValue) => {
  const trimmed = trim(inputValue);
  const lowered = toLowerCase(trimmed);
  const withoutAccents = removeAccents(lowered);
  return juices[withoutAccents] ?? "error";
};

// functional
const getJuicePrice = (inputValue) =>
  Box(inputValue)
    .map(trim)
    .map(toLowerCase)
    .map(removeAccents)
    .chain((juiceName) => fromNullable(juices[juiceName]))
    .fold(
      (e) => "error",
      (price) => price,
    );

getJuicePrice("   passionfruit     "); // "$2.50"
```

Notice how much easier it's to understand the functional code. It feels like the data is "floating down the river". You don’t need to scroll up and down multiple times, as you do most of the time when trying to understand an imperative code. Don't worry about the elements in the functional code that look strange to you, the goal here is to point out the structural differences between those two paradigms.

Another beneficial aspect is how easy it is to compose functions together, either using `compose` itself or `pipe`. Both functions are easy to define and achieve the same final result.

```js
const compose =
  (...fns) =>
  (arg) =>
    fns.reduceRight((prev, fn) => fn(prev), arg);

const pipe =
  (...fns) =>
  (arg) =>
    fns.reduce((prev, fn) => fn(prev), arg);

const prepareInput = compose(removeAccents, toLowerCase, trim);

const prepareInput = pipe(trim, toLowerCase, removeAccents);

const getJuicePrice = (inputValue) =>
  Box(inputValue)
    .map(prepareInput)
    .chain((juiceName) => fromNullable(juices[juiceName]))
    .fold(
      (e) => "error",
      (price) => price,
    );
```

The difference here is the ordering: when using `compose`, the functions are called from right to left; when using `pipe`, from left to right. The `prepareInput` function in the given example calls `trim` first, then `toLowerCase` and finally `removeAccents`. `compose` is closer to the mathematical definition of composite functions, though.

In math, a composite function can be described as `f(g(x))` or `f∘g`, where `g`, the one that is most to the right, is applied first and `f` is applied directly after.

Predictability is another thing you gain by using FP. This is because the functions are written in such a way that they will always return the same output for any given input, without side-effects. Those functions are called pure functions and we will talk more about them later in this article.

When bundled with predictability, you will have an easier to refactor code, simply because you always know what is needed to receive or return.

## Cornerstones of Functional Programming

### Pure Functions

The concept of a pure function comes from mathematics. To fully understand it, let’s take a step back and discuss the mathematical definition of a function.

> "A function is a relation between two sets (A and B), where A is a set of inputs and B is a set of possible outputs. However, each input must be related to exactly one output."

The definition brings up some interesting things:

- An input cannot be related to multiple outputs, it must be related to a single one;
- A function doesn't care about its context, it only cares about returning an output for a given input;
- A function not only doesn't care about its context, it also doesn't bother affecting it.

A pure function holds all of these properties.

```js
// impure
let max = 2.0;
const checkPriceImpure = (price) => price <= max;

// pure
const checkPrice = (price) => {
  let max = 2.0;
  return price <= max;
};
```

Note that the impure version of `checkPrice` function depends on the context, because it's using a variable that is defined outside of its scope, which is `max`. If either someone or a side-effect changes `max` value, the `checkPrice` function won't work as expected anymore.

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

> “...the true constant is change. Mutation hides change. Hidden change creates chaos.” Eric Elliot

Immutable data structures cannot be modified after they are defined. In JavaScript, however, only primitive values are immutable by default. When working with objects (note that in JavaScript arrays are objects), some workaround has to be done.

`Object.freeze()` and `const` aren't really useful for objects. `Object.freeze()` won't avoid the mutation of nested objects and `const`, well, it will only avoid reassigning the variable, but properties can be added, deleted or edited.

Avoiding mutation using plain JavaScript:

```js
const juice = {
  fruit: "passionfruit",
  ordered: {
    friday: 12,
  },
};

const updatedJuice = {
  ...juice,
  ordered: {
    friday: {
      withSugar: 10,
      withoutSugar: 2,
    },
  },
};

/* {
  fruit: 'passionfruit',
  ordered: {
    friday: {
      withSugar: 10,
      withoutSugar: 2,
    },
  },
} */

const juices = ["passionfruit", "orange", "apple"];

const newJuices = [...juices, "guava"];
// ['passionfruit', 'orange', 'apple', 'guava']
```

As you can see in those examples, the `spread` operator helps us to avoid mutating data structures such as arrays and objects.

There are also libraries such as [Immer](https://github.com/immerjs/immer) and [Immutable](https://github.com/immutable-js/immutable-js) that were created to make our lives easier while dealing with immutability in JavaScript.

## Dive Deeper

Fortunately, as it has been shown in this article, it’s definitely possible to use functional programming with plain JavaScript. However, if you really want to dive deeper into this paradigm while using JavaScript, you’ll probably want to use some already existing functional libraries such as [Sanctuary](https://github.com/sanctuary-js/sanctuary), [Fluture](https://github.com/fluture-js/Fluture), [Ramda](https://github.com/ramda/ramda) and others.
