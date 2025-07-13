/**
 * Container class that holds all the dependencies for the application.
 * Inspired by [Magnus Tovslid's article](https://medium.com/@magnusjt/ioc-container-in-nodejs-e7aea8a89600)
 * @class Container
 */

export default class Container<T> {
  private services: T = {} as T;

  constructor() {}

  /**
   *
   * @param {string} name Name of the dependency to instantiate in the container
   * @param {(c) => unknown} cbCreator Function that builds the dependency
   * @returns {Container}
   */
  service(name: keyof T, cbCreator: (c: T) => unknown) {
    Object.defineProperty(this, name, {
      get: () => {
        const alreadyDeclared = Object.prototype.hasOwnProperty.call(
          this.services,
          name
        );

        if (!alreadyDeclared) {
          //@ts-expect-error this is a workaround to avoid type errors
          this.services[name] = cbCreator(this);
        }

        return this.services[name];
      },
      configurable: true, // True to allow this property to be redefined
    });

    return this;
  }
}
