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
const { PORT } = env;

type NormalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => any;
type ErrorMiddleware = (
  error: Error,
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
  addEndpoint = (method: string, path: string, handler: Handler) => {
    this.app[method as keyof Application](path, handler);
  };

  addMiddleware = (middleware: Middleware) => {
    this.app.use(middleware);
  };

  listen() {
    this.app.listen(this.port, () => {
      console.log(`FINANZAPP API Listening at http://localhost:${this.port}`);
    });
  }
  getServer() {
    return this.app;
  }
}
