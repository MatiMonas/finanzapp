import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'FinanzApp API',
      version: '1.0.0',
      description: 'API Documentation for FinanzApp',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: [
    './src/domain/users/http/router.ts',
    './src/domain/budgets/http/router.ts',
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
