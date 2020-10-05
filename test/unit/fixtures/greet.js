import { getTimeOfDay } from './get-time-of-day';

export function greet(name = 'friend') {
  const timeOfDay = getTimeOfDay();

  return `Good ${timeOfDay}, ${name}!`;
}
