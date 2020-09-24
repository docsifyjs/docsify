export function greet(name = 'friend') {
  const timeOfDay = getTimeOfDay();

  return `Good ${timeOfDay}, ${name}!`;
}

export function getTimeOfDay(hours = new Date().getHours()) {
  const timeOfDay =
    hours < 12 ? 'morning' : hours < 17 ? 'afternoon' : 'evening';

  return timeOfDay;
}
