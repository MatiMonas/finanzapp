export default class Validator<T = unknown> {
  next: Validator<T> | null;
  constructor() {
    this.next = null;
  }
  setNext(nextValidator: Validator<T>) {
    this.next = nextValidator;
  }
  validate(body: T): T {
    if (this.next != null) {
      return this.next.validate(body);
    }
    return body;
  }

  static createValidatorChain<T>(
    arrayValidators: Validator<T>[]
  ): Validator<T> {
    const mainValidator = arrayValidators[0];
    for (let i = 0; i < arrayValidators.length - 1; i++) {
      const element = arrayValidators[i];
      const element_next = arrayValidators[i + 1];
      element.setNext(element_next);
    }
    return mainValidator;
  }
}
