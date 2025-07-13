declare module 'bun:test' {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function expect(val: any): any;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;
  export function mock(fn: (...args: any[]) => any): any;
  export function spyOn(obj: any, method: string): any;
  export const jest: {
    fn(): any;
    mock(path: string): any;
    spyOn(obj: any, method: string): any;
  };
}
