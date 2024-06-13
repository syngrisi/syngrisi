import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { registry as users } from '../routes/v1/users.route';
import { registry as app } from '../routes/v1/app.route';

// import { registry as suites } from '../routes/v1/suites.route';
import { registry as auth } from '../routes/v1/auth.route';
// import { registry as logs } from '../routes/v1/logs.route';
// import { registry as tasks } from '../routes/v1/tasks.route';
import { registry as baselines } from '../routes/v1/baselines.route';
// import { registry as runs } from '../routes/v1/runs.route';
// import { registry as test } from '../routes/v1/test.route';
import { registry as checks } from '../routes/v1/checks.route';
// import { registry as settings } from '../routes/v1/settings.route';
// import { registry as testDistinct } from '../routes/v1/test_distinct.route';
// import { registry as client } from '../routes/v1/client.route';
// import { registry as snapshots } from '../routes/v1/snapshots.route';

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    users,
    app,
    auth,
    // logs,
    // tasks,
    baselines,
    // runs,
    // test,
    checks,
    // settings,
    // testDistinct,
    // client,
    // snapshots
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
    },
    externalDocs: {
      description: 'View the raw OpenAPI Specification in JSON format',
      url: '/swagger.json',
    },
  });
}
