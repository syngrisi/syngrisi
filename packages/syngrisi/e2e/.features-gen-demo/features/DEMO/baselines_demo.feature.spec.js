// Generated from: features/DEMO/baselines_demo.feature
import { test } from "../../../support/fixtures/index.ts";

test.describe('Baselines View Demo', () => {

  test.beforeEach('Background', async ({ Given, When, And, appServer, testData }, testInfo) => { if (testInfo.error) return;
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_AUTH: \"false\"\nSYNGRISI_TEST_MODE: \"true\""}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await And('I seed via http baselines with usage:', {"docString":{"content":"      baselines:\n        - name: api-baseline-usage\n          checkName: api-baseline-usage\n          usageCount: 2\n          filePath: files/A.png\n        - name: api-baseline-unused\n          checkName: api-baseline-unused\n          usageCount: 0\n          filePath: files/B.png"}}, { appServer, testData }); 
    await And('I seed via http orphan baselines data:', {"docString":{"content":"      orphanBaseline:\n        name: orphan-baseline-deleteme\n        filePath: files/A.png\n      usedBaseline:\n        name: orphan-baseline-keep\n        filePath: files/B.png"}}, { appServer, testData }); 
  });
  
  test('Demo Baselines View - Table, Filtering and Navigation', { tag: ['@fast-server', '@demo'] }, async ({ When, Then, And, appServer, page, testData, testEngine }) => { 
    await When('I go to "baselines" page', null, { appServer, page }); 
    await Then('the element with locator "[data-test=\'table-header-Name\']" should be visible', null, { page }); 
    await When('I pause with phrase: "Посмотрите на таблицу. Обратите внимание на использование бейслайнов."', null, { page, testEngine }); 
    await When('I click element with locator "[data-test=\'table-filtering\']"', null, { page, testData }); 
    await And('I wait 1 seconds', null, { page, testData }); 
    await When('I pause with phrase: "Открыта панель фильтров. Вы можете изучить опции фильтрации."', null, { page, testEngine }); 
    await When('I click element with locator "[data-test=\'table-row-Name\']"', null, { page, testData }); 
    await When('I pause with phrase: "Произошло перенаправление на тесты. Обратите внимание на URL с фильтром."', null, { page, testEngine }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features/DEMO/baselines_demo.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":13,"pickleLine":39,"tags":["@fast-server","@demo"],"steps":[{"pwStepLine":7,"gherkinStepLine":5,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"And I seed via http baselines with usage:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":29,"keywordType":"Context","textWithKeyword":"And I seed via http orphan baselines data:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"When I go to \"baselines\" page","stepMatchArguments":[{"group":{"start":8,"value":"\"baselines\"","children":[{"start":9,"value":"baselines","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Then the element with locator \"[data-test='table-header-Name']\" should be visible","stepMatchArguments":[{"group":{"start":17,"value":"locator","children":[]},"parameterTypeName":"target"},{"group":{"start":25,"value":"\"[data-test='table-header-Name']\"","children":[{"start":26,"value":"[data-test='table-header-Name']","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":69,"value":"visible","children":[]},"parameterTypeName":"condition"}]},{"pwStepLine":16,"gherkinStepLine":50,"keywordType":"Action","textWithKeyword":"When I pause with phrase: \"Посмотрите на таблицу. Обратите внимание на использование бейслайнов.\"","stepMatchArguments":[{"group":{"start":21,"value":"\"Посмотрите на таблицу. Обратите внимание на использование бейслайнов.\"","children":[{"start":22,"value":"Посмотрите на таблицу. Обратите внимание на использование бейслайнов.","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":53,"keywordType":"Action","textWithKeyword":"When I click element with locator \"[data-test='table-filtering']\"","stepMatchArguments":[{"group":{"start":21,"value":"locator","children":[]},"parameterTypeName":"target"},{"group":{"start":29,"value":"\"[data-test='table-filtering']\"","children":[{"start":30,"value":"[data-test='table-filtering']","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":54,"keywordType":"Action","textWithKeyword":"And I wait 1 seconds","stepMatchArguments":[{"group":{"start":7,"value":"1","children":[]}}]},{"pwStepLine":19,"gherkinStepLine":58,"keywordType":"Action","textWithKeyword":"When I pause with phrase: \"Открыта панель фильтров. Вы можете изучить опции фильтрации.\"","stepMatchArguments":[{"group":{"start":21,"value":"\"Открыта панель фильтров. Вы можете изучить опции фильтрации.\"","children":[{"start":22,"value":"Открыта панель фильтров. Вы можете изучить опции фильтрации.","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":65,"keywordType":"Action","textWithKeyword":"When I click element with locator \"[data-test='table-row-Name']\"","stepMatchArguments":[{"group":{"start":21,"value":"locator","children":[]},"parameterTypeName":"target"},{"group":{"start":29,"value":"\"[data-test='table-row-Name']\"","children":[{"start":30,"value":"[data-test='table-row-Name']","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":70,"keywordType":"Action","textWithKeyword":"When I pause with phrase: \"Произошло перенаправление на тесты. Обратите внимание на URL с фильтром.\"","stepMatchArguments":[{"group":{"start":21,"value":"\"Произошло перенаправление на тесты. Обратите внимание на URL с фильтром.\"","children":[{"start":22,"value":"Произошло перенаправление на тесты. Обратите внимание на URL с фильтром.","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end