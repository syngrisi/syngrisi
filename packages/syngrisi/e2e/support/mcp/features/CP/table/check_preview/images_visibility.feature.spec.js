// Generated from: ../../features/CP/table/check_preview/images_visibility.feature
import { test } from "../../../../../fixtures/index.ts";

test.describe('Checks Preview images visibilities', () => {

  test.beforeEach('Background', async ({ When, appServer, page, testData }, testInfo) => { if (testInfo.error) return;
    await When('I open the app', null, { appServer, page, testData }); 
    await When('I clear local storage', null, { page }); 
  });
  
  test('Checks Preview images visibilities', { tag: ['@fast-server'] }, async ({ Given, When, appServer, page, testData }) => { 
    await Given('I create "1" tests with:', {"docString":{"content":"      testName: TestName\n      checks:\n        - checkName: CheckName\n          filePath: files/A.png"}}, { appServer, testData }); 
    await When('I go to "main" page', null, { appServer, page }); 
    await When('I unfold the test "TestName"', null, { page, testData }); 
    await When('I execute javascript code:', {"docString":{"content":"return {url: document.querySelector(\"[alt='CheckName']\").src}"}}, { page, testData }); 
    await When('I open the url "<js:url>"', null, { page, testData }); 
    await When('I wait 30 seconds for the element with locator "img" to be visible', null, { page, testData }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/CP/table/check_preview/images_visibility.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":10,"tags":["@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Action","textWithKeyword":"When I open the app","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I clear local storage","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"Given I create \"1\" tests with:","stepMatchArguments":[{"group":{"start":9,"value":"\"1\"","children":[{"start":10,"value":"1","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When I go to \"main\" page","stepMatchArguments":[{"group":{"start":8,"value":"\"main\"","children":[{"start":9,"value":"main","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":19,"keywordType":"Action","textWithKeyword":"When I unfold the test \"TestName\"","stepMatchArguments":[{"group":{"start":18,"value":"\"TestName\"","children":[{"start":19,"value":"TestName","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I execute javascript code:","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"When I open the url \"<js:url>\"","stepMatchArguments":[{"group":{"start":15,"value":"\"<js:url>\"","children":[{"start":16,"value":"<js:url>","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"When I wait 30 seconds for the element with locator \"img\" to be visible","stepMatchArguments":[{"group":{"start":7,"value":"30","children":[]},"parameterTypeName":"int"},{"group":{"start":26,"value":"element","children":[]},"parameterTypeName":"role"},{"group":{"start":39,"value":"locator","children":[]},"parameterTypeName":"attribute"},{"group":{"start":47,"value":"\"img\"","children":[{"start":48,"value":"img","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":59,"value":"visible","children":[]},"parameterTypeName":"condition"}]}]},
]; // bdd-data-end