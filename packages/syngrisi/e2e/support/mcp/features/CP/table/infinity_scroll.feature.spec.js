// Generated from: ../../features/CP/table/infinity_scroll.feature
import { test } from "../../../../fixtures/index.ts";

test.describe('Infinity scroll', () => {

  test.beforeEach('Background', async ({ When, appServer, page, testData }, testInfo) => { if (testInfo.error) return;
    await When('I open the app', null, { appServer, page, testData }); 
    await When('I clear local storage', null, { page }); 
  });
  
  test('Infinity scroll', { tag: ['@smoke', '@fast-server'] }, async ({ When, Then, appServer, page, testData }) => { 
    await When('I create "30" tests with:', {"docString":{"content":"    testName: \"TestName-$\"\n    runName: \"RunName-$\"\n    runIdent: \"RunIdent-$\"\n    checks:\n      - filePath: files/A.png\n        checkName: Check - 1\n      - filePath: files/B.png\n        checkName: Check - 2"}}, { appServer, testData }); 
    await When('I go to "main" page', null, { appServer, page }); 
    await When('I wait 30 seconds for the element with locator "[data-table-test-name=TestName-29]" to be visible', null, { page, testData }); 
    await Then('the element "//*[@data-test=\'table-row-Name\']" does appear exactly "20" times', null, { page }); 
    await When('I scroll to element "[data-table-test-name=TestName-11]"', null, { page }); 
    await Then('the element "//*[@data-test=\'table-row-Name\']" does appear exactly "30" times', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/CP/table/infinity_scroll.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":10,"tags":["@smoke","@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I open the app","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I clear local storage","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I create \"30\" tests with:","stepMatchArguments":[{"group":{"start":9,"value":"\"30\"","children":[{"start":10,"value":"30","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":22,"keywordType":"Action","textWithKeyword":"When I go to \"main\" page","stepMatchArguments":[{"group":{"start":8,"value":"\"main\"","children":[{"start":9,"value":"main","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"When I wait 30 seconds for the element with locator \"[data-table-test-name=TestName-29]\" to be visible","stepMatchArguments":[{"group":{"start":7,"value":"30","children":[]},"parameterTypeName":"int"},{"group":{"start":26,"value":"element","children":[]},"parameterTypeName":"role"},{"group":{"start":39,"value":"locator","children":[]},"parameterTypeName":"attribute"},{"group":{"start":47,"value":"\"[data-table-test-name=TestName-29]\"","children":[{"start":48,"value":"[data-table-test-name=TestName-29]","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":90,"value":"visible","children":[]},"parameterTypeName":"condition"}]},{"pwStepLine":15,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"Then the element \"//*[@data-test='table-row-Name']\" does appear exactly \"20\" times","stepMatchArguments":[{"group":{"start":12,"value":"\"//*[@data-test='table-row-Name']\"","children":[{"start":13,"value":"//*[@data-test='table-row-Name']","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":67,"value":"\"20\"","children":[{"start":68,"value":"20","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"When I scroll to element \"[data-table-test-name=TestName-11]\"","stepMatchArguments":[{"group":{"start":20,"value":"\"[data-table-test-name=TestName-11]\"","children":[{"start":21,"value":"[data-table-test-name=TestName-11]","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"Then the element \"//*[@data-test='table-row-Name']\" does appear exactly \"30\" times","stepMatchArguments":[{"group":{"start":12,"value":"\"//*[@data-test='table-row-Name']\"","children":[{"start":13,"value":"//*[@data-test='table-row-Name']","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":67,"value":"\"30\"","children":[{"start":68,"value":"30","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end