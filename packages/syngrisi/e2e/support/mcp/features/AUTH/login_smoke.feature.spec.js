// Generated from: ../../features/AUTH/login_smoke.feature
import { test } from "../../../fixtures/index.ts";

test.describe('Login - Smoke', () => {

  test.beforeEach('Background', async ({ Given, When, appServer, page, testData }, testInfo) => { if (testInfo.error) return;
    await When('I set env variables:', {"docString":{"content":"     SYNGRISI_TEST_MODE: \"true\"\n     SYNGRISI_AUTH: \"false\""}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await When('I create via http test user', null, { appServer }); 
    await When('I stop Server', null, { appServer, testData }); 
    await When('I set env variables:', {"docString":{"content":"      SYNGRISI_TEST_MODE: \"false\"\n      SYNGRISI_AUTH: \"true\""}}, { appServer }); 
    await When('I reload session', null, { page, testData }); 
  });
  
  test('Login - default Test user', { tag: ['@fast-server'] }, async ({ When, appServer, page, testData }) => { 
    await When('I login with user:"Test" password "123456aA-"', null, { appServer, page, testData }); 
    await When('I wait 30 seconds for the element with locator "span*=TA" to be visible', null, { page, testData }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/AUTH/login_smoke.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":15,"pickleLine":24,"tags":["@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":12,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I create via http test user","isBg":true,"stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When I stop Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I reload session","isBg":true,"stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"When I login with user:\"Test\" password \"123456aA-\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Test\"","children":[{"start":19,"value":"Test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":34,"value":"\"123456aA-\"","children":[{"start":35,"value":"123456aA-","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"When I wait 30 seconds for the element with locator \"span*=TA\" to be visible","stepMatchArguments":[{"group":{"start":7,"value":"30","children":[]},"parameterTypeName":"int"},{"group":{"start":26,"value":"element","children":[]},"parameterTypeName":"role"},{"group":{"start":39,"value":"locator","children":[]},"parameterTypeName":"attribute"},{"group":{"start":47,"value":"\"span*=TA\"","children":[{"start":48,"value":"span*=TA","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":64,"value":"visible","children":[]},"parameterTypeName":"condition"}]}]},
]; // bdd-data-end