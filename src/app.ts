import container from 'container';
import Server from 'infrastructure/http/express';
import createHandler from 'infrastructure/http/createHandler';
import errorHandler from 'infrastructure/http/errorHandler';

const server = new Server();
server.addRoute('/api/v1', container.userRouter.getRouter());

server.addEndpoint(
  'get',
  '/health',
  createHandler(async () => {
    console.log('Health check');
    return 'OK';
  })
);

server.addMiddleware(errorHandler);

server.listen();
