import express, { Request, Response, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateOpenAPIDocument } from './openAPIDocumentGenerator';

export const openAPIRouter: Router = (() => {
  const router = express.Router();
  const openAPIDocument = generateOpenAPIDocument();

  // eslint-disable-next-line custom/validate-request-rule, custom/check-route-registration
  router.get('/json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openAPIDocument);
  });

  router.use('/', swaggerUi.serve, swaggerUi.setup(openAPIDocument));

  return router;
})();
