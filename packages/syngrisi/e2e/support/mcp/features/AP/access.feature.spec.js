// Generated from: ../../features/AP/access.feature
import { test } from "../../../fixtures/index.ts";

test.describe('Access to admin Panel', () => {

  test.beforeEach('Background', async ({ When, appServer }, testInfo) => { if (testInfo.error) return;
    await When('I set env variables:', {"docString":{"content":"      SYNGRISI_TEST_MODE: true\n      SYNGRISI_AUTH: true"}}, { appServer }); 
  });
  
  test('Open Admin Panel as Anonymous User', { tag: ['@fast-server'] }, async ({ When, Then, appServer, page, testData }) => { 
    await When('I go to "admin2" page', null, { appServer, page }); 
    await Then('the current url contains "/auth"', null, { page, testData }); 
    await Then('the title is "Login Page"', null, { page }); 
  });

  test('Open Admin Panel behalf of User role', { tag: ['@fast-server'] }, async ({ When, Then, appServer, page, testData }) => { 
    await When('I login with user:"testuser@test.com" password "Test-123"', null, { appServer, page, testData }); 
    await When('I wait 30 seconds for the element with locator "span*=TU" to be visible', null, { page, testData }); 
    await When('I go to "admin2" page', null, { appServer, page }); 
    await Then('the HTML contains:', {"docString":{"content":"      Authorization Error - wrong Role"}}, { page }); 
  });

  test('Open Admin Panel behalf of Reviewer role', { tag: ['@fast-server'] }, async ({ When, Then, appServer, page, testData }) => { 
    await When('I login with user:"testreviewer@test.com" password "Test-123"', null, { appServer, page, testData }); 
    await When('I wait 30 seconds for the element with locator "span*=TR" to be visible', null, { page, testData }); 
    await When('I go to "admin2" page', null, { appServer, page }); 
    await Then('the HTML contains:', {"docString":{"content":"      Authorization Error - wrong Role"}}, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/AP/access.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":13,"tags":["@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When I go to \"admin2\" page","stepMatchArguments":[{"group":{"start":8,"value":"\"admin2\"","children":[{"start":9,"value":"admin2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then the current url contains \"/auth\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/auth\"","children":[{"start":26,"value":"/auth","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Then the title is \"Login Page\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Login Page\"","children":[{"start":14,"value":"Login Page","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":16,"pickleLine":18,"tags":["@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I login with user:\"testuser@test.com\" password \"Test-123\"","stepMatchArguments":[{"group":{"start":18,"value":"\"testuser@test.com\"","children":[{"start":19,"value":"testuser@test.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":47,"value":"\"Test-123\"","children":[{"start":48,"value":"Test-123","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"When I wait 30 seconds for the element with locator \"span*=TU\" to be visible","stepMatchArguments":[{"group":{"start":7,"value":"30","children":[]},"parameterTypeName":"int"},{"group":{"start":26,"value":"element","children":[]},"parameterTypeName":"role"},{"group":{"start":39,"value":"locator","children":[]},"parameterTypeName":"attribute"},{"group":{"start":47,"value":"\"span*=TU\"","children":[{"start":48,"value":"span*=TU","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":64,"value":"visible","children":[]},"parameterTypeName":"condition"}]},{"pwStepLine":19,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I go to \"admin2\" page","stepMatchArguments":[{"group":{"start":8,"value":"\"admin2\"","children":[{"start":9,"value":"admin2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Then the HTML contains:","stepMatchArguments":[]}]},
  {"pwTestLine":23,"pickleLine":27,"tags":["@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"When I login with user:\"testreviewer@test.com\" password \"Test-123\"","stepMatchArguments":[{"group":{"start":18,"value":"\"testreviewer@test.com\"","children":[{"start":19,"value":"testreviewer@test.com","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":51,"value":"\"Test-123\"","children":[{"start":52,"value":"Test-123","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":29,"keywordType":"Action","textWithKeyword":"When I wait 30 seconds for the element with locator \"span*=TR\" to be visible","stepMatchArguments":[{"group":{"start":7,"value":"30","children":[]},"parameterTypeName":"int"},{"group":{"start":26,"value":"element","children":[]},"parameterTypeName":"role"},{"group":{"start":39,"value":"locator","children":[]},"parameterTypeName":"attribute"},{"group":{"start":47,"value":"\"span*=TR\"","children":[{"start":48,"value":"span*=TR","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":64,"value":"visible","children":[]},"parameterTypeName":"condition"}]},{"pwStepLine":26,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I go to \"admin2\" page","stepMatchArguments":[{"group":{"start":8,"value":"\"admin2\"","children":[{"start":9,"value":"admin2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Then the HTML contains:","stepMatchArguments":[]}]},
]; // bdd-data-end