// Generated from: ../../features/CP/check_details/heighlight.feature
import { test } from "../../../../fixtures/index.ts";

test.describe('Check Details Difference Highlight', () => {

  test.beforeEach('Background', async ({ When, appServer, page, testData }, testInfo) => { if (testInfo.error) return;
    await When('I open the app', null, { appServer, page, testData }); 
    await When('I clear local storage', null, { page }); 
  });
  
  test('Check Details Difference Highlight', { tag: ['@smoke', '@fast-server'] }, async ({ Given, When, Then, appServer, page, testData }) => { 
    await Given('I create "1" tests with:', {"docString":{"content":"      testName: \"TestName\"\n      checks:\n        - checkName: CheckName\n          filePath: files/A.png"}}, { appServer, testData }); 
    await When('I accept via http the 1st check with name "CheckName"', null, { appServer, testData }); 
    await Given('I create "1" tests with:', {"docString":{"content":"      testName: \"TestName\"\n      checks:\n        - checkName: CheckName\n          filePath: files/B.png"}}, { appServer, testData }); 
    await When('I go to "main" page', null, { appServer, page }); 
    await When('I unfold the test "TestName"', null, { page, testData }); 
    await When('I click element with locator "[data-test-preview-image=\'CheckName\']"', null, { page, testData }); 
    await When('I wait 30 seconds for the element with locator "[data-check-header-name=\'CheckName\']" to be visible', null, { page, testData }); 
    await When('I execute javascript code:', {"docString":{"content":"window.slowHighlight=1"}}, { page, testData }); 
    await When('I click element with locator "[data-check=\'highlight-icon\']"', null, { page, testData }); 
    await When('I execute javascript code:', {"docString":{"content":"return mainView.canvas.getObjects().filter(x=>x.name==\"highlight\").length.toString()"}}, { page, testData }); 
    await Then('I expect the stored "js" string is equal:', {"docString":{"content":"      151"}}, { testData }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/CP/check_details/heighlight.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":10,"tags":["@smoke","@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I open the app","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I clear local storage","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"Given I create \"1\" tests with:","stepMatchArguments":[{"group":{"start":9,"value":"\"1\"","children":[{"start":10,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When I accept via http the 1st check with name \"CheckName\"","stepMatchArguments":[{"group":{"start":22,"value":"1st","children":[]},"parameterTypeName":"ordinal"},{"group":{"start":42,"value":"\"CheckName\"","children":[{"start":43,"value":"CheckName","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Given I create \"1\" tests with:","stepMatchArguments":[{"group":{"start":9,"value":"\"1\"","children":[{"start":10,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"When I go to \"main\" page","stepMatchArguments":[{"group":{"start":8,"value":"\"main\"","children":[{"start":9,"value":"main","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":28,"keywordType":"Action","textWithKeyword":"When I unfold the test \"TestName\"","stepMatchArguments":[{"group":{"start":18,"value":"\"TestName\"","children":[{"start":19,"value":"TestName","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"When I click element with locator \"[data-test-preview-image='CheckName']\"","stepMatchArguments":[{"group":{"start":21,"value":"locator","children":[]},"parameterTypeName":"target"},{"group":{"start":29,"value":"\"[data-test-preview-image='CheckName']\"","children":[{"start":30,"value":"[data-test-preview-image='CheckName']","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":31,"keywordType":"Action","textWithKeyword":"When I wait 30 seconds for the element with locator \"[data-check-header-name='CheckName']\" to be visible","stepMatchArguments":[{"group":{"start":7,"value":"30","children":[]},"parameterTypeName":"int"},{"group":{"start":26,"value":"element","children":[]},"parameterTypeName":"role"},{"group":{"start":39,"value":"locator","children":[]},"parameterTypeName":"attribute"},{"group":{"start":47,"value":"\"[data-check-header-name='CheckName']\"","children":[{"start":48,"value":"[data-check-header-name='CheckName']","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":92,"value":"visible","children":[]},"parameterTypeName":"condition"}]},{"pwStepLine":19,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"When I execute javascript code:","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":37,"keywordType":"Action","textWithKeyword":"When I click element with locator \"[data-check='highlight-icon']\"","stepMatchArguments":[{"group":{"start":21,"value":"locator","children":[]},"parameterTypeName":"target"},{"group":{"start":29,"value":"\"[data-check='highlight-icon']\"","children":[{"start":30,"value":"[data-check='highlight-icon']","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When I execute javascript code:","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Then I expect the stored \"js\" string is equal:","stepMatchArguments":[{"group":{"start":20,"value":"\"js\"","children":[{"start":21,"value":"js","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end