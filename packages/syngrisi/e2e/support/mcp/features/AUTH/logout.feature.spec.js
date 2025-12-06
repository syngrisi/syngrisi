// Generated from: ../../features/AUTH/logout.feature
import { test } from "../../../fixtures/index.ts";

test.describe('Logout', () => {

  test.beforeEach('Background', async ({ Given, When, appServer, testData }, testInfo) => { if (testInfo.error) return;
    await When('I set env variables:', {"docString":{"content":"      SYNGRISI_TEST_MODE: true\n      SYNGRISI_AUTH: false"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await When('I create via http test user', null, { appServer }); 
    await When('I stop Server', null, { appServer, testData }); 
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_TEST_MODE: false\nSYNGRISI_AUTH: true"}}, { appServer }); 
  });
  
  test('Logout - default Test user', { tag: ['@fast-server'] }, async ({ When, Then, appServer, page, testData }) => { 
    await When('I login with user:"Test" password "123456aA-"', null, { appServer, page, testData }); 
    await When('I wait 30 seconds for the element with locator "span*=TA" to be visible', null, { page, testData }); 
    await When('I go to "logout" page', null, { appServer, page }); 
    await When('I go to "main" page', null, { appServer, page }); 
    await When('the current url contains "/auth"', null, { page, testData }); 
    await Then('the title is "Login Page"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/AUTH/logout.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":14,"pickleLine":22,"tags":["@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I create via http test user","isBg":true,"stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":13,"keywordType":"Action","textWithKeyword":"When I stop Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"When I login with user:\"Test\" password \"123456aA-\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Test\"","children":[{"start":19,"value":"Test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":34,"value":"\"123456aA-\"","children":[{"start":35,"value":"123456aA-","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When I wait 30 seconds for the element with locator \"span*=TA\" to be visible","stepMatchArguments":[{"group":{"start":7,"value":"30","children":[]},"parameterTypeName":"int"},{"group":{"start":26,"value":"element","children":[]},"parameterTypeName":"role"},{"group":{"start":39,"value":"locator","children":[]},"parameterTypeName":"attribute"},{"group":{"start":47,"value":"\"span*=TA\"","children":[{"start":48,"value":"span*=TA","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":64,"value":"visible","children":[]},"parameterTypeName":"condition"}]},{"pwStepLine":17,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"When I go to \"logout\" page","stepMatchArguments":[{"group":{"start":8,"value":"\"logout\"","children":[{"start":9,"value":"logout","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"When I go to \"main\" page","stepMatchArguments":[{"group":{"start":8,"value":"\"main\"","children":[{"start":9,"value":"main","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":29,"keywordType":"Action","textWithKeyword":"When the current url contains \"/auth\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/auth\"","children":[{"start":26,"value":"/auth","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"Then the title is \"Login Page\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Login Page\"","children":[{"start":14,"value":"Login Page","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end