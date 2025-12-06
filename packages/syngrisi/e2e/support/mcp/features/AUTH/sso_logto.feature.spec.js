// Generated from: ../../features/AUTH/sso_logto.feature
import { test } from "../../../fixtures/index.ts";

test.describe('SSO Authentication with Logto', () => {

  test.beforeEach('Background', async ({ Given, When, appServer, ssoServer, testData }, testInfo) => { if (testInfo.error) return;
    await When('I configure SSO with client ID "syngrisi-e2e-test" and secret "auto-provisioned"', null, { ssoServer }); 
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_AUTH: true\nSYNGRISI_TEST_MODE: false"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
  });
  
  test('Logto infrastructure is available', { tag: ['@sso-external', '@slow'] }, async ({ Then, ssoServer }) => { 
    await Then('Logto SSO should be available', null, { ssoServer }); 
  });

  test('Full OAuth2 Login Flow with Logto', { tag: ['@sso-external', '@slow'] }, async ({ When, Then, appServer, page, ssoServer, testData }) => { 
    await Then('Logto SSO should be available', null, { ssoServer }); 
    await When('I reload session', null, { page, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await Then('the title is "Login Page"', null, { page }); 
    await Then('the SSO login button should be visible', null, { page }); 
    await When('I click SSO login button', null, { page }); 
    await When('I login to Logto with username "testuser" and password "Test123!"', null, { page }); 
    await Then('I should be redirected back to the app', null, { appServer, page }); 
    await Then('I should be authenticated via SSO', null, { page }); 
  });

  test('Local Auth Fallback works with real SSO', { tag: ['@sso-external', '@slow'] }, async ({ When, Then, appServer, page, testData }) => { 
    await When('I reload session', null, { page, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await When('I login with user:"Administrator" password "Administrator"', null, { appServer, page, testData }); 
    await Then('the title is "By Runs"', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/AUTH/sso_logto.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":12,"pickleLine":25,"slow":true,"tags":["@sso-external","@slow"],"steps":[{"pwStepLine":7,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I configure SSO with client ID \"syngrisi-e2e-test\" and secret \"auto-provisioned\"","isBg":true,"stepMatchArguments":[{"group":{"start":31,"value":"\"syngrisi-e2e-test\"","children":[{"start":32,"value":"syngrisi-e2e-test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":62,"value":"\"auto-provisioned\"","children":[{"start":63,"value":"auto-provisioned","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":23,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Then Logto SSO should be available","stepMatchArguments":[]}]},
  {"pwTestLine":16,"pickleLine":28,"slow":true,"tags":["@sso-external","@slow"],"steps":[{"pwStepLine":7,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I configure SSO with client ID \"syngrisi-e2e-test\" and secret \"auto-provisioned\"","isBg":true,"stepMatchArguments":[{"group":{"start":31,"value":"\"syngrisi-e2e-test\"","children":[{"start":32,"value":"syngrisi-e2e-test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":62,"value":"\"auto-provisioned\"","children":[{"start":63,"value":"auto-provisioned","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":23,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"Then Logto SSO should be available","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":32,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"Then the title is \"Login Page\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Login Page\"","children":[{"start":14,"value":"Login Page","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Then the SSO login button should be visible","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When I click SSO login button","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"When I login to Logto with username \"testuser\" and password \"Test123!\"","stepMatchArguments":[{"group":{"start":31,"value":"\"testuser\"","children":[{"start":32,"value":"testuser","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"Test123!\"","children":[{"start":56,"value":"Test123!","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":24,"gherkinStepLine":44,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected back to the app","stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":45,"keywordType":"Outcome","textWithKeyword":"Then I should be authenticated via SSO","stepMatchArguments":[]}]},
  {"pwTestLine":28,"pickleLine":60,"slow":true,"tags":["@sso-external","@slow"],"steps":[{"pwStepLine":7,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I configure SSO with client ID \"syngrisi-e2e-test\" and secret \"auto-provisioned\"","isBg":true,"stepMatchArguments":[{"group":{"start":31,"value":"\"syngrisi-e2e-test\"","children":[{"start":32,"value":"syngrisi-e2e-test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":62,"value":"\"auto-provisioned\"","children":[{"start":63,"value":"auto-provisioned","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":8,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":23,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":61,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":62,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":63,"keywordType":"Action","textWithKeyword":"When I login with user:\"Administrator\" password \"Administrator\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Administrator\"","children":[{"start":19,"value":"Administrator","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":43,"value":"\"Administrator\"","children":[{"start":44,"value":"Administrator","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":32,"gherkinStepLine":64,"keywordType":"Outcome","textWithKeyword":"Then the title is \"By Runs\"","stepMatchArguments":[{"group":{"start":13,"value":"\"By Runs\"","children":[{"start":14,"value":"By Runs","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end