/**
 * Adds beginning of input (^) and end of input ($) assertions if needed into a regex string
 * @param {string} matcher the string to match
 * @returns {string}
 */
export function makeExactMatcher(matcher) {
  const matcherWithBeginningOfInput = matcher.startsWith('^')
    ? matcher
    : `^${matcher}`;

  const matcherWithBeginningAndEndOfInput =
    matcherWithBeginningOfInput.endsWith('$')
      ? matcherWithBeginningOfInput
      : `${matcherWithBeginningOfInput}$`;

  return matcherWithBeginningAndEndOfInput;
}
