export class Person {
  // Private class fields
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
  #minAge = 1;
  #maxAge = 100;

  // Public class fields
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields
  age = (
    Math.random() * (this.#maxAge - this.#minAge) +
    this.#minAge
  ).toFixed();

  constructor(name) {
    this.name = name;
  }

  eat(food) {
    return `${this.name} ate ${food}`;
  }

  greet() {
    const date = new Date();
    const hours = date.getHours();
    const timeOfDay =
      hours < 12 ? 'morning' : hours < 17 ? 'afternoon' : 'evening';

    return `${this.name} said, "Good ${timeOfDay}!"`;
  }

  sleep(hours) {
    return `${this.name} slept for ${hours} hours`;
  }

  static help() {
    const methods = Object.getOwnPropertyNames(this.prototype)
      .filter(prop => prop !== 'constructor')
      .sort();
    const methodText = [
      ...methods.slice(0, -1),
      `and ${methods.slice(-1)}`,
    ].join(', ');

    return `People can ${methodText}`;
  }
}
