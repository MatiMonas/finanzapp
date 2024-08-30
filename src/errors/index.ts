interface IError {
  [error: string]: string[];
}

export class ValidationError extends Error {
  errors: IError;
  statusCode: number;
  constructor(message: string, errors: IError) {
    super(message);
    this.statusCode = 400;
    this.errors = errors;
  }
}

type ErrorParams = {
  statusCode: number;
  cause: Error;
};

type HttpErrorParams = ErrorParams & {
  request: object;
  response: object;
};

export class HttpError extends Error {
  statusCode: number;
  request: object;
  response: object;
  constructor(message: string, params: HttpErrorParams) {
    super(message, { cause: params.cause });
    this.statusCode = params.statusCode;
    this.name = 'HttpError';
    this.request = params.request;
    this.response = params.response;
  }
}

type DatabaseErrorParams = ErrorParams & {
  query: string;
};

export class DatabaseError extends Error {
  statusCode: number;
  query: string;
  constructor(message: string, params: DatabaseErrorParams) {
    super(message, { cause: params.cause });
    this.statusCode = params.statusCode;
    this.name = 'DatabaseError';
    this.query = params.query;
  }
}
