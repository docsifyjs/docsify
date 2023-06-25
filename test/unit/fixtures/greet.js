import { getTimeOfDay } from './get-time-of-day.js';

export function greet(name = 'friend') {
  const timeOfDay = getTimeOfDay();

  return `Good ${timeOfDay}, ${name}!`;
}
