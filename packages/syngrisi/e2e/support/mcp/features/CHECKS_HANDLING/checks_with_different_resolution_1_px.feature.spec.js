// Generated from: ../../features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature
import { test } from "../../../fixtures/index.ts";

test.describe('Checks with different resolutions 1px', () => {

  test('Two checks with identical image parts but different resolutions [1px, bottom]', { tag: ['@fast-server'] }, async ({ Given, When, Then, appServer, page, testData }) => { 
    await Given('I create "1" tests with:', {"docString":{"content":"testName: Checks with different resolutions 1px - 1\nchecks:\n  - checkName: CheckName\n    filePath: files/A_cropped_bottom_1_px.png"}}, { appServer, testData }); 
    await When('I accept via http the 1st check with name "CheckName"', null, { appServer, testData }); 
    await Given('I create "1" tests with:', {"docString":{"content":"testName: Checks with different resolutions 1px - 2\nchecks:\n  - checkName: CheckName\n    filePath: files/A.png"}}, { appServer, testData }); 
    await When('I expect via http 1st test filtered as "name=Checks with different resolutions 1px - 2" matched:', {"docString":{"content":"status: Passed"}}, { appServer, testData }); 
    await Then('I expect via http 1st check filtered as "name=CheckName" matched:', {"docString":{"content":"status: [passed]"}}, { appServer, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/CHECKS_HANDLING/checks_with_different_resolution_1_px.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":17,"tags":["@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":18,"keywordType":"Context","textWithKeyword":"Given I create \"1\" tests with:","stepMatchArguments":[{"group":{"start":9,"value":"\"1\"","children":[{"start":10,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"When I accept via http the 1st check with name \"CheckName\"","stepMatchArguments":[{"group":{"start":22,"value":"1st","children":[]},"parameterTypeName":"ordinal"},{"group":{"start":42,"value":"\"CheckName\"","children":[{"start":43,"value":"CheckName","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":9,"gherkinStepLine":27,"keywordType":"Context","textWithKeyword":"Given I create \"1\" tests with:","stepMatchArguments":[{"group":{"start":9,"value":"\"1\"","children":[{"start":10,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":35,"keywordType":"Action","textWithKeyword":"When I expect via http 1st test filtered as \"name=Checks with different resolutions 1px - 2\" matched:","stepMatchArguments":[{"group":{"start":18,"value":"1st","children":[]},"parameterTypeName":"ordinal"},{"group":{"start":39,"value":"\"name=Checks with different resolutions 1px - 2\"","children":[{"start":40,"value":"name=Checks with different resolutions 1px - 2","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"Then I expect via http 1st check filtered as \"name=CheckName\" matched:","stepMatchArguments":[{"group":{"start":18,"value":"1st","children":[]},"parameterTypeName":"ordinal"},{"group":{"start":40,"value":"\"name=CheckName\"","children":[{"start":41,"value":"name=CheckName","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":44,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]}]},
]; // bdd-data-end