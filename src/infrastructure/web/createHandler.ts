import { NextFunction, Request, Response } from 'express';

export default function createHandler(
  handler: (arg0: Request<any, any, any, any>) => any,
  successStatus = 200
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await handler(req);

      if (response.hasOwnProperty('data')) {
        return res
          .status(successStatus)
          .json({ status: 'success', ...processResponse(response) });
      }
      return res
        .status(successStatus)
        .json({ status: 'success', data: processResponse(response) });
    } catch (error) {
      next(error);
    }
  };
}

function replacer(key: string, value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

function processResponse(response: any): any {
  return JSON.parse(JSON.stringify(response, replacer));
}
