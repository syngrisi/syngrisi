// Generated from: ../../features/CHECKS_HANDLING/low_diff.feature
import { test } from "../../../fixtures/index.ts";

test.describe('Low images difference', () => {

  test('Low images difference', { tag: ['@fast-server'] }, async ({ Given, When, Then, appServer, testData }) => { 
    await Given('I create "1" tests with:', {"docString":{"content":"testName: TestName\nchecks:\n  - checkName: CheckName\n    filePath: files/low_diff_0.png"}}, { appServer, testData }); 
    await When('I accept via http the 1st check with name "CheckName"', null, { appServer, testData }); 
    await Given('I create "1" tests with:', {"docString":{"content":"testName: TestName\nchecks:\n  - checkName: CheckName\n    filePath: files/low_diff_1.png"}}, { appServer, testData }); 
    await Then('I expect via http 2st check filtered as "name=CheckName" matched:', {"docString":{"content":"name: CheckName\nstatus: [new]"}}, { appServer, testData }); 
    await Then('I expect via http 1st check filtered as "name=CheckName" matched:', {"docString":{"content":"name: CheckName\nstatus: [failed]\nmarkedAs: accepted\nfailReasons: [different_images]"}}, { appServer, testData }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/CHECKS_HANDLING/low_diff.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":9,"tags":["@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":10,"keywordType":"Context","textWithKeyword":"Given I create \"1\" tests with:","stepMatchArguments":[{"group":{"start":9,"value":"\"1\"","children":[{"start":10,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I accept via http the 1st check with name \"CheckName\"","stepMatchArguments":[{"group":{"start":22,"value":"1st","children":[]},"parameterTypeName":"ordinal"},{"group":{"start":42,"value":"\"CheckName\"","children":[{"start":43,"value":"CheckName","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Given I create \"1\" tests with:","stepMatchArguments":[{"group":{"start":9,"value":"\"1\"","children":[{"start":10,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"Then I expect via http 2st check filtered as \"name=CheckName\" matched:","stepMatchArguments":[{"group":{"start":18,"value":"2st","children":[]},"parameterTypeName":"ordinal"},{"group":{"start":40,"value":"\"name=CheckName\"","children":[{"start":41,"value":"name=CheckName","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"Then I expect via http 1st check filtered as \"name=CheckName\" matched:","stepMatchArguments":[{"group":{"start":18,"value":"1st","children":[]},"parameterTypeName":"ordinal"},{"group":{"start":40,"value":"\"name=CheckName\"","children":[{"start":41,"value":"name=CheckName","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end