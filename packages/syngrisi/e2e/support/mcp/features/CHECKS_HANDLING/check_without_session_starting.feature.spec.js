// Generated from: ../../features/CHECKS_HANDLING/check_without_session_starting.feature
import { test } from "../../../fixtures/index.ts";

test.describe('One Check without session starting', () => {

  test('Create new check - without session ending', { tag: ['@integration', '@smoke', '@e2e', '@fast-server'] }, async ({ When, Then, appServer, testData }) => { 
    await When('I check image with path: "files/A.png" as "new int check" and suppress exceptions', null, { appServer, testData }); 
    await Then('I expect the stored "error" string is contain:', {"docString":{"content":"The test id is empty"}}, { testData }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/CHECKS_HANDLING/check_without_session_starting.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":8,"tags":["@integration","@smoke","@e2e","@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I check image with path: \"files/A.png\" as \"new int check\" and suppress exceptions","stepMatchArguments":[{"group":{"start":25,"value":"\"files/A.png\"","children":[{"start":26,"value":"files/A.png","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":42,"value":"\"new int check\"","children":[{"start":43,"value":"new int check","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then I expect the stored \"error\" string is contain:","stepMatchArguments":[{"group":{"start":20,"value":"\"error\"","children":[{"start":21,"value":"error","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end