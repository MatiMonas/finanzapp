import Validator from '../validator';

// Helpers for Bun tests

/**
 * Creates an async mock function that resolves to a specific value.
 */
export function mockResolved<T>(value: T): () => Promise<T> {
  return () => Promise.resolve(value);
}

/**
 * Creates an async mock function that rejects with a specific error.
 */
export function mockRejected(error: any): () => Promise<any> {
  return () => Promise.reject(error);
}

/**
 * Creates a simple mock function that can be reassigned in tests.
 */
export function createMockFn<R = any>(
  impl?: (...args: any[]) => R
): (...args: any[]) => R {
  let fn = impl || (() => undefined as any);
  const mock = (...args: any[]) => fn(...args);
  (mock as any).setImpl = (newImpl: (...args: any[]) => R) => {
    fn = newImpl;
  };
  return mock;
}

/**
 * Creates a mock validator that returns the specified data.
 */
export function createMockValidator<T>(returnData: T) {
  return function <U>(): Validator<U> {
    const mockValidator: Validator<U> = {
      next: null,
      validate: () => returnData as unknown as U,
      setNext: function (nextValidator: Validator<U>) {
        this.next = nextValidator;
        return this;
      },
    };
    return mockValidator;
  };
}
