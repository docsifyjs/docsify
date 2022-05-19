/**
 * Adds beginning of input (^) and end of input ($) assertions if needed into a regex string
 * @param {string} matcher the string to match
 * @returns {string}
 */
export function makeExactMatcher(matcher) {
  const matcherWithBeginningOfInput =
    matcher.slice(0, 1) === '^' ? matcher : `^${matcher}`;

  const matcherWithBeginningAndEndOfInput =
    matcherWithBeginningOfInput.slice(-1) === '$'
      ? matcherWithBeginningOfInput
      : `${matcherWithBeginningOfInput}$`;

  return matcherWithBeginningAndEndOfInput;
}
