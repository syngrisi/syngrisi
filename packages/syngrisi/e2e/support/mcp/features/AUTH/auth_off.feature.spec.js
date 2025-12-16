// Generated from: ../../features/AUTH/auth_off.feature
import { test } from "../../../fixtures/index.ts";

test.describe('Authentication - off', () => {

  test.beforeEach('Background', async ({ Given, appServer, testData }, testInfo) => { if (testInfo.error) return;
    await Given('I start Server', null, { appServer, testData }); 
  });
  
  test('Login as Guest', { tag: ['@fast-server', '@smoke'] }, async ({ When, page, testData }) => { 
    await When('I open the url "<syngrisiUrl>"', null, { page, testData }); 
    await When('I wait 30 seconds for the element with locator "span*=SG" to be visible', null, { page, testData }); 
  });

  test('Login as Guest with redirect', { tag: ['@fast-server'] }, async ({ When, Then, page, testData }) => { 
    await When('I open the url "<syngrisiUrl>admin"', null, { page, testData }); 
    await Then('the current url contains "/admin"', null, { page, testData }); 
    await When('I wait on element "[data-test=\'user-icon\']"', null, { page }); 
    await Then('the element with locator "[data-test=\'user-icon\']" should have contains text "SG"', null, { page, testData }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/AUTH/auth_off.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":10,"pickleLine":9,"tags":["@fast-server","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":10,"keywordType":"Action","textWithKeyword":"When I open the url \"<syngrisiUrl>\"","stepMatchArguments":[{"group":{"start":15,"value":"\"<syngrisiUrl>\"","children":[{"start":16,"value":"<syngrisiUrl>","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":11,"keywordType":"Action","textWithKeyword":"When I wait 30 seconds for the element with locator \"span*=SG\" to be visible","stepMatchArguments":[{"group":{"start":7,"value":"30","children":[]},"parameterTypeName":"int"},{"group":{"start":26,"value":"element","children":[]},"parameterTypeName":"role"},{"group":{"start":39,"value":"locator","children":[]},"parameterTypeName":"attribute"},{"group":{"start":47,"value":"\"span*=SG\"","children":[{"start":48,"value":"span*=SG","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":64,"value":"visible","children":[]},"parameterTypeName":"condition"}]}]},
  {"pwTestLine":15,"pickleLine":13,"tags":["@fast-server"],"steps":[{"pwStepLine":7,"gherkinStepLine":6,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":14,"keywordType":"Action","textWithKeyword":"When I open the url \"<syngrisiUrl>admin\"","stepMatchArguments":[{"group":{"start":15,"value":"\"<syngrisiUrl>admin\"","children":[{"start":16,"value":"<syngrisiUrl>admin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then the current url contains \"/admin\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/admin\"","children":[{"start":26,"value":"/admin","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":18,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I wait on element \"[data-test='user-icon']\"","stepMatchArguments":[{"group":{"start":18,"value":"\"[data-test='user-icon']\"","children":[{"start":19,"value":"[data-test='user-icon']","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then the element with locator \"[data-test='user-icon']\" should have contains text \"SG\"","stepMatchArguments":[{"group":{"start":17,"value":"locator","children":[]},"parameterTypeName":"target"},{"group":{"start":25,"value":"\"[data-test='user-icon']\"","children":[{"start":26,"value":"[data-test='user-icon']","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":77,"value":"\"SG\"","children":[{"start":78,"value":"SG","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end