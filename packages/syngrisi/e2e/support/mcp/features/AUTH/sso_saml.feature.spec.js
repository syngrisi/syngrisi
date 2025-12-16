// Generated from: ../../features/AUTH/sso_saml.feature
import { test } from "../../../fixtures/index.ts";

test.describe('SSO Authentication with SAML 2.0', () => {

  test.beforeEach('Background', async ({ Given, When, appServer, ssoServer, testData }, testInfo) => { if (testInfo.error) return;
    await When('I configure SAML SSO with auto-provisioned settings', null, { ssoServer }); 
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_AUTH: true\nSYNGRISI_TEST_MODE: false"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
  });
  
  test('Full SAML Login Flow with Logto IdP', { tag: ['@sso-external', '@slow', '@saml'] }, async ({ When, Then, appServer, page, testData }) => { 
    await When('I reload session', null, { page, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await Then('the title is "Login Page"', null, { page }); 
    await Then('the SSO login button should be visible', null, { page }); 
    await When('I click SSO login button', null, { page }); 
    await When('I login to Logto with username "testuser" and password "Test123!"', null, { page }); 
    await Then('I should be redirected back to the app', null, { appServer, page }); 
    await Then('I should be authenticated via SSO', null, { page }); 
  });

  test('SAML Account Linking - existing local user', { tag: ['@sso-external', '@slow', '@saml'] }, async ({ When, Then, appServer, page, testData }) => { 
    await When('I reset user "test@syngrisi.test" provider to local', null, { appServer }); 
    await When('I reload session', null, { page, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await When('I click SSO login button', null, { page }); 
    await When('I login to Logto with username "testuser" and password "Test123!"', null, { page }); 
    await Then('I should be redirected back to the app', null, { appServer, page }); 
    await Then('I should be authenticated via SSO', null, { page }); 
    await Then('the user "test@syngrisi.test" should have provider type "saml"', null, { appServer }); 
  });

  test('SAML User Creation - new user', { tag: ['@sso-external', '@slow', '@saml'] }, async ({ When, Then, appServer, page, testData }) => { 
    await When('I reload session', null, { page, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await When('I click SSO login button', null, { page }); 
    await When('I login to Logto with username "testuser" and password "Test123!"', null, { page }); 
    await Then('I should be redirected back to the app', null, { appServer, page }); 
    await Then('I should be authenticated via SSO', null, { page }); 
    await Then('a new user "test@syngrisi.test" should be created with role "reviewer"', null, { appServer }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/AUTH/sso_saml.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":12,"pickleLine":28,"slow":true,"tags":["@sso-external","@slow","@saml"],"steps":[{"pwStepLine":7,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"When I configure SAML SSO with auto-provisioned settings","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":32,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"Then the title is \"Login Page\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Login Page\"","children":[{"start":14,"value":"Login Page","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Then the SSO login button should be visible","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"When I click SSO login button","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"When I login to Logto with username \"testuser\" and password \"Test123!\"","stepMatchArguments":[{"group":{"start":31,"value":"\"testuser\"","children":[{"start":32,"value":"testuser","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"Test123!\"","children":[{"start":56,"value":"Test123!","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":44,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected back to the app","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":45,"keywordType":"Outcome","textWithKeyword":"Then I should be authenticated via SSO","stepMatchArguments":[]}]},
  {"pwTestLine":23,"pickleLine":47,"slow":true,"tags":["@sso-external","@slow","@saml"],"steps":[{"pwStepLine":7,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"When I configure SAML SSO with auto-provisioned settings","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":52,"keywordType":"Action","textWithKeyword":"When I reset user \"test@syngrisi.test\" provider to local","stepMatchArguments":[{"group":{"start":13,"value":"\"test@syngrisi.test\"","children":[{"start":14,"value":"test@syngrisi.test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":54,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":55,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":56,"keywordType":"Action","textWithKeyword":"When I click SSO login button","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":59,"keywordType":"Action","textWithKeyword":"When I login to Logto with username \"testuser\" and password \"Test123!\"","stepMatchArguments":[{"group":{"start":31,"value":"\"testuser\"","children":[{"start":32,"value":"testuser","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"Test123!\"","children":[{"start":56,"value":"Test123!","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":61,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected back to the app","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":62,"keywordType":"Outcome","textWithKeyword":"Then I should be authenticated via SSO","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":64,"keywordType":"Outcome","textWithKeyword":"Then the user \"test@syngrisi.test\" should have provider type \"saml\"","stepMatchArguments":[{"group":{"start":9,"value":"\"test@syngrisi.test\"","children":[{"start":10,"value":"test@syngrisi.test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":56,"value":"\"saml\"","children":[{"start":57,"value":"saml","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":34,"pickleLine":66,"slow":true,"tags":["@sso-external","@slow","@saml"],"steps":[{"pwStepLine":7,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"When I configure SAML SSO with auto-provisioned settings","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"When I set env variables:","isBg":true,"stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"Given I start Server","isBg":true,"stepMatchArguments":[]},{"pwStepLine":35,"gherkinStepLine":70,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":71,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":37,"gherkinStepLine":72,"keywordType":"Action","textWithKeyword":"When I click SSO login button","stepMatchArguments":[]},{"pwStepLine":38,"gherkinStepLine":75,"keywordType":"Action","textWithKeyword":"When I login to Logto with username \"testuser\" and password \"Test123!\"","stepMatchArguments":[{"group":{"start":31,"value":"\"testuser\"","children":[{"start":32,"value":"testuser","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"Test123!\"","children":[{"start":56,"value":"Test123!","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":39,"gherkinStepLine":77,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected back to the app","stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":78,"keywordType":"Outcome","textWithKeyword":"Then I should be authenticated via SSO","stepMatchArguments":[]},{"pwStepLine":41,"gherkinStepLine":80,"keywordType":"Outcome","textWithKeyword":"Then a new user \"test@syngrisi.test\" should be created with role \"reviewer\"","stepMatchArguments":[{"group":{"start":11,"value":"\"test@syngrisi.test\"","children":[{"start":12,"value":"test@syngrisi.test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":60,"value":"\"reviewer\"","children":[{"start":61,"value":"reviewer","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
]; // bdd-data-end