import { test } from './fixtures';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scenariosDir = path.resolve(__dirname, '../scenarios');
const scenarioFiles = fs.readdirSync(scenariosDir).filter(f => f.endsWith('.json'));

for (const file of scenarioFiles) {
  const content = fs.readFileSync(path.join(scenariosDir, file), 'utf-8');
  const scenario = JSON.parse(content);

  test(scenario.id, async ({ mcp }) => {
    test.setTimeout(10 * 60 * 1000); // 10 min per scenario

    console.log(`Running Scenario: ${scenario.id}`);
    await mcp.start(scenario.prompt);

    const logs = mcp.getLogs();
    const logContent = logs.join('\n');

    // Validation based on expectations
    if (scenario.expectations.final_url_contains) {
      if (!logContent.includes(scenario.expectations.final_url_contains)) {
        throw new Error(`Expected URL to contain '${scenario.expectations.final_url_contains}' but not found in agent logs.`);
      }
    }

    if (scenario.expectations.final_locator) {
       if (!logContent.includes(scenario.expectations.final_locator)) {
        throw new Error(`Expected locator/text '${scenario.expectations.final_locator}' but not found in agent logs.`);
      }
    }

    if (scenario.expectations.prohibited_actions) {
      for (const action of scenario.expectations.prohibited_actions) {
        if (logContent.includes(action)) {
          throw new Error(`Prohibited action '${action}' found in logs.`);
        }
      }
    }
  });
}
