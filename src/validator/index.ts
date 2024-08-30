export default class Validator {
  next: Validator | null;
  constructor() {
    this.next = null;
  }
  setNext(nextValidator: Validator) {
    this.next = nextValidator;
  }
  validate(body: any): any {
    if (this.next != null) {
      return this.next.validate(body);
    }
    return body;
  }

  static createValidatorChain(arrayValidators: Validator[]) {
    let mainValidator = arrayValidators[0];
    for (let i = 0; i < arrayValidators.length - 1; i++) {
      const element = arrayValidators[i];
      const element_next = arrayValidators[i + 1];
      element.setNext(element_next);
    }
    return mainValidator;
  }
}
