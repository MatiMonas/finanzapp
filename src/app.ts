import Server from 'infrastructure/web/express';

import { RegisterRoutes } from './components/routes';

function setupRoutes(server: Server) {
  // Register TSOA auto-generated routes
  RegisterRoutes(server.getServer());

  // Health check endpoint
  server.addEndpoint('get', '/health', async (req, res) => {
    console.log('Health check');
    res.json({ status: 'OK' });
  });
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
