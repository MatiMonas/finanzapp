import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { Application } from 'express';

const swaggerDocument = YAML.load(
  path.join(__dirname, '../../../swagger.yaml')
);

export default (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
