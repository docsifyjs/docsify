import { startsWith, endsWith } from '../util/str';

/**
 * Adds beginning of input (^) and end of input ($) assertions if needed into a regex string
 * @param {string} matcher the string to match
 * @returns {string}
 */
export function makeExactMatcher(matcher) {
  const matcherWithBeginningOfInput = startsWith(matcher, '^')
    ? matcher
    : `^${matcher}`;

  const matcherWithBeginningAndEndOfInput = endsWith(
    matcherWithBeginningOfInput,
    '$'
  )
    ? matcherWithBeginningOfInput
    : `${matcherWithBeginningOfInput}$`;

  return matcherWithBeginningAndEndOfInput;
}
