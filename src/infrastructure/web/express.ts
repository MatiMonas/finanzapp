import express, {
  Application,
  Handler,
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import env from 'utils/env';
import { ExceptionError } from 'errors/exceptionErrors';
const { PORT } = env;

type NormalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;
type ErrorMiddleware = (
  error: ExceptionError,
  req: Request,
  res: Response,
  next: NextFunction
) => any;

type Middleware = NormalMiddleware | ErrorMiddleware;

export default class Express {
  app: Application;
  port: number;
  constructor() {
    this.app = express();
    this.port = Number(PORT);
    this.middlewares();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  addRoute = (path: string, module: Router) => {
    this.app.use(path, module);
  };

  addRoutes = (pathPrefix: string, routers: Router[]) => {
    routers.forEach((router) => {
      this.app.use(pathPrefix, router);
    });
  };

  addEndpoint = (method: string, path: string, handler: Handler) => {
    this.app[method as keyof Application](path, handler);
  };

  addMiddleware = (middleware: Middleware) => {
    this.app.use(middleware);
  };

  listen(callback?: (err?: Error) => void) {
    this.app.listen(this.port, (err?: Error) => {
      if (err) {
        console.error('Failed to start server:', err);
        if (callback) callback(err);
      } else {
        console.log(`Finanzapp listening at http://localhost:${this.port}`);
        console.log(
          `API-DOCS Running at  http://localhost:${this.port}/api-docs`
        );
        if (callback) callback();
      }
    });
  }

  getServer() {
    return this.app;
  }
}