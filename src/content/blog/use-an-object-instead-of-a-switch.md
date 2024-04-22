---
title: "Use an object instead of a switch"
description: "Sometimes we can do a simple refactor and achieve a lot of it!"
pubDate: "Jan 02 2022"
---

Sometimes we can do a simple refactor and achieve a lot with it! The example I'm gonna show was taken from a real project that has been working just fine for a long time. Still, that doesn't mean we shouldn't take the initiative to improve simply because it's already working. However, we also need to be pragmatic and not fall into [the perfectionism trap](https://www.youtube.com/watch?v=BY6bGhcnDDs). Basically, we should find the sweet spot where the effort necessary is paid by its own results.

I was working on a module that had a `getMonth` function which would return the translation key according to the given month:

```ts
const getMonth = (month: string) => {
  let translationKey = "";
  switch (month) {
    case "January":
      translationKey = "JANUARY_TRANSLATION_KEY";
      break;
    case "February":
      translationKey = "FEBRUARY_TRANSLATION_KEY";
      break;
    case "March":
      translationKey = "MARCH_TRANSLATION_KEY";
      break;
    case "April":
      translationKey = "APRIL_TRANSLATION_KEY";
      break;
    case "May":
      translationKey = "MAY_TRANSLATION_KEY";
      break;
    case "June":
      translationKey = "JUNE_TRANSLATION_KEY";
      break;
    case "July":
      translationKey = "JULY_TRANSLATION_KEY";
      break;
    case "August":
      translationKey = "AUGUST_TRANSLATION_KEY";
      break;
    case "September":
      translationKey = "SEPTEMBER_TRANSLATION_KEY";
      break;
    case "October":
      translationKey = "OCTOBER_TRANSLATION_KEY";
      break;
    case "November":
      translationKey = "NOVEMBER_TRANSLATION_KEY";
      break;
    case "December":
      translationKey = "DECEMBER_TRANSLATION_KEY";
  }
  return translationKey;
};
```

In this case, it was clear to me what I would accomplish using an object instead of a switch statement: readability and reduce the cognitive complexity (you can read more about it [here](https://www.sonarsource.com/resources/white-papers/cognitive-complexity/))

Why an object? Well, if you take a closer look at what the `getMonth` function is doing, you realize that it's doing nothing but mapping keys to values, which is exactly what an object does!

Therefore, a switch statement isn't needed at all. actually, it just makes the code less readable and increases its cognitive complexity. So, after refactoring:

```ts
const MONTH_TO_TRANSLATION_KEY = {
  January: "JANUARY_TRANSLATION_KEY",
  February: "FEBRUARY_TRANSLATION_KEY",
  March: "MARCH_TRANSLATION_KEY",
  April: "APRIL_TRANSLATION_KEY",
  May: "MAY_TRANSLATION_KEY",
  June: "JUNE_TRANSLATION_KEY",
  July: "JULY_TRANSLATION_KEY",
  August: "AUGUST_TRANSLATION_KEY",
  September: "SEPTEMBER_TRANSLATION_KEY",
  October: "OCTOBER_TRANSLATION_KEY",
  November: "NOVEMBER_TRANSLATION_KEY",
  December: "DECEMBER_TRANSLATION_KEY",
} as const;

type Month = keyof typeof MONTH_TO_TRANSLATION_KEY;

const getMonth = (month: Month) => MONTH_TO_TRANSLATION_KEY[month];
```

**tl;dr:** whenever we notice that the switch is doing nothing more than mapping keys to values, we could use an object instead.
