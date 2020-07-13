function add(...addends) {
  return addends.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  );
}

module.exports = add;
