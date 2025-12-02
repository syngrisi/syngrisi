// Generated from: ../../features/CHECKS_HANDLING/accept_by_user.feature
import { test } from "../../../fixtures/index.ts";

test.describe('Accept by user', () => {

  test.beforeEach('Background', async ({ Given, When, appServer, testData }, testInfo) => { if (testInfo.error) return;
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_TEST_MODE: true\nSYNGRISI_AUTH: false"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await When('I create via http test user', null, { appServer }); 
    await When('I stop the Syngrisi server', null, { appServer, testData }); 
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_TEST_MODE: false\nSYNGRISI_AUTH: true"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await When('I login via http with user:"Test" password "123456aA-"', null, { appServer, testData }); 
    await When('I generate via http API key for the User', null, { appServer, testData }); 
    await When('I set the API key in config', null, { testData }); 
    await When('I start Driver', null, { appServer, testData }); 
  });
  
  test('Accept by user', { tag: ['@fast-server'] }, async ({ Given, When, Then, appServer, page, testData }) => { 
    await Given('I create "1" tests with:', {"docString":{"content":"testName: TestName\nchecks:\n  - checkName: CheckName\n    filePath: files/B.png"}}, { appServer, testData }); 
    await When('I accept via http the 1st check with name "CheckName"', null, { appServer, testData }); 
    await Then('I expect via http 1st check filtered as "name=CheckName" matched:', {"docString":{"content":"name: CheckName\nstatus: [new]\nmarkedAs: accepted\nmarkedByUsername: Test"}}, { appServer, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await When('I login with user:"Test" password "123456aA-"', null, { appServer, page, testData }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/CHECKS_HANDLING/accept_by_user.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":19,"pickleLine":28,"tags":["@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I create via http test user","isBg":true,"stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When I stop the Syngrisi server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"When I login via http with user:\"Test\" password \"123456aA-\"","isBg":true,"stepMatchArguments":[{"group":{"start":27,"value":"\"Test\"","children":[{"start":28,"value":"Test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":43,"value":"\"123456aA-\"","children":[{"start":44,"value":"123456aA-","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When I generate via http API key for the User","isBg":true,"stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"When I set the API key in config","isBg":true,"stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"When I start Driver","isBg":true,"stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":29,"keywordType":"Context","textWithKeyword":"Given I create \"1\" tests with:","stepMatchArguments":[{"group":{"start":9,"value":"\"1\"","children":[{"start":10,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":36,"keywordType":"Action","textWithKeyword":"When I accept via http the 1st check with name \"CheckName\"","stepMatchArguments":[{"group":{"start":22,"value":"1st","children":[]},"parameterTypeName":"ordinal"},{"group":{"start":42,"value":"\"CheckName\"","children":[{"start":43,"value":"CheckName","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":38,"keywordType":"Outcome","textWithKeyword":"Then I expect via http 1st check filtered as \"name=CheckName\" matched:","stepMatchArguments":[{"group":{"start":18,"value":"1st","children":[]},"parameterTypeName":"ordinal"},{"group":{"start":40,"value":"\"name=CheckName\"","children":[{"start":41,"value":"name=CheckName","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":47,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":48,"keywordType":"Action","textWithKeyword":"When I login with user:\"Test\" password \"123456aA-\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Test\"","children":[{"start":19,"value":"Test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":34,"value":"\"123456aA-\"","children":[{"start":35,"value":"123456aA-","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end