import container from 'container';
import Server from 'infrastructure/http/express';
import createHandler from 'infrastructure/http/createHandler';
import errorHandler from 'infrastructure/http/errorHandler';

const API_PREFIX = '/api/v1';

function setupRoutes(server: Server) {
  server.addRoutes(API_PREFIX, [
    container.userRouter.getRouter(),
    container.budgetRouter.getRouter(),
  ]);

  server.addEndpoint(
    'get',
    '/health',
    createHandler(async () => {
      console.log('Health check');
      return 'OK';
    })
  );

  server.addMiddleware(errorHandler);
}

function startServer() {
  const server = new Server();
  setupRoutes(server);

  server.listen((err?: Error) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    console.log('Server started successfully.');
  });
}

startServer();
