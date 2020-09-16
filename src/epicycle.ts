export { };

class Epicycle {
  keys: any[];
  values: any[];

  constructor() {
    this.keys = [];
    this.values = [];
  }

  get(key) {
    let index = this.keys.indexOf(key);
    return this.values[index];
  }

  has(key) {
    return this.keys.indexOf(key) >= 0;
  }

  set(key, value) {
    let index = this.keys.indexOf(key);
    if (index >= 0) {
      this.values[index] = value;
    } else {
      this.keys.push(key);
      this.values.push(value);
    }
    return this;
  }
}

export default Epicycle;