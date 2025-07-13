declare module 'moment' {
  interface Moment {
    format(format?: string): string;
    isValid(): boolean;
  }

  interface MomentConstructor {
    (input?: string | Date | number, format?: string): Moment;
    (input?: string | Date | number, format?: string, strict?: boolean): Moment;
    (input?: string | Date | number, format?: string, locale?: string): Moment;
    (
      input?: string | Date | number,
      format?: string,
      locale?: string,
      strict?: boolean
    ): Moment;
  }

  const moment: MomentConstructor;
  export = moment;
}
