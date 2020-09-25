export function getTimeOfDay(hours = new Date().getHours()) {
  const timeOfDay =
    hours < 12 ? 'morning' : hours < 17 ? 'afternoon' : 'evening';

  return timeOfDay;
}
