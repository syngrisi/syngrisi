// Generated from: ../../features/AUTH/sso_common.feature
import { test } from "../../../fixtures/index.ts";

test.describe('SSO Common Scenarios and Edge Cases', () => {

  test('Login attempt when SSO is disabled', { tag: ['@sso-common'] }, async ({ Given, When, Then, appServer, page, testData }) => { 
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_AUTH: true\nSSO_ENABLED: false\nSYNGRISI_TEST_MODE: true"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await When('I reload session', null, { page, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await Then('the title is "Login Page"', null, { page }); 
    await Then('SSO login should be disabled', null, { page }); 
  });

  test('Direct SSO access when disabled redirects to login', { tag: ['@sso-common'] }, async ({ Given, When, Then, appServer, page, testData }) => { 
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_AUTH: true\nSSO_ENABLED: false\nSYNGRISI_TEST_MODE: true"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await When('I reload session', null, { page, testData }); 
    await When('I try to access SSO directly', null, { appServer, page }); 
    await Then('the current url contains "/auth"', null, { page, testData }); 
  });

  test('Logout functionality clears session', { tag: ['@sso-common', '@sso-external', '@slow'] }, async ({ Given, When, Then, appServer, page, ssoServer, testData }) => { 
    await When('I configure SSO with client ID "syngrisi-e2e-test" and secret "auto-provisioned"', null, { ssoServer }); 
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_AUTH: true\nSYNGRISI_TEST_MODE: false"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await Then('Logto SSO should be available', null, { ssoServer }); 
    await When('I reload session', null, { page, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await When('I click SSO login button', null, { page }); 
    await When('I login to Logto with username "testuser" and password "Test123!"', null, { page }); 
    await Then('I should be redirected back to the app', null, { appServer, page }); 
    await Then('I should be authenticated via SSO', null, { page }); 
    await When('I go to "logout" page', null, { appServer, page }); 
    await Then('the current url contains "/auth"', null, { page, testData }); 
    await Then('my session should be destroyed', null, { appServer, page }); 
  });

  test('OAuth Account Linking - existing local user', { tag: ['@sso-common', '@sso-external', '@slow'] }, async ({ Given, When, Then, appServer, page, ssoServer, testData }) => { 
    await When('I configure SSO with client ID "syngrisi-e2e-test" and secret "auto-provisioned"', null, { ssoServer }); 
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_AUTH: true\nSYNGRISI_TEST_MODE: true"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await Then('Logto SSO should be available', null, { ssoServer }); 
    await When('I reset user "test@syngrisi.test" provider to local', null, { appServer }); 
    await When('I reload session', null, { page, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await When('I click SSO login button', null, { page }); 
    await When('I login to Logto with username "testuser" and password "Test123!"', null, { page }); 
    await Then('I should be redirected back to the app', null, { appServer, page }); 
    await Then('I should be authenticated via SSO', null, { page }); 
    await Then('the user "test@syngrisi.test" should have provider type "oauth"', null, { appServer }); 
  });

  test('OAuth User Creation - new user', { tag: ['@sso-common', '@sso-external', '@slow'] }, async ({ Given, When, Then, appServer, page, ssoServer, testData }) => { 
    await When('I configure SSO with client ID "syngrisi-e2e-test" and secret "auto-provisioned"', null, { ssoServer }); 
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_AUTH: true\nSYNGRISI_TEST_MODE: true"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await Then('Logto SSO should be available', null, { ssoServer }); 
    await When('I reload session', null, { page, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await When('I click SSO login button', null, { page }); 
    await When('I login to Logto with username "testuser" and password "Test123!"', null, { page }); 
    await Then('I should be redirected back to the app', null, { appServer, page }); 
    await Then('I should be authenticated via SSO', null, { page }); 
    await Then('a new user "test@syngrisi.test" should be created with role "reviewer"', null, { appServer }); 
  });

  test('SSO button visibility based on configuration', { tag: ['@sso-common'] }, async ({ Given, When, Then, appServer, page, testData }) => { 
    await When('I set env variables:', {"docString":{"content":"SYNGRISI_AUTH: true\nSSO_ENABLED: true\nSSO_PROTOCOL: oauth2\nSSO_CLIENT_ID: test-client\nSSO_CLIENT_SECRET: test-secret\nSSO_AUTHORIZATION_URL: http://localhost:3001/oidc/auth\nSSO_TOKEN_URL: http://localhost:3001/oidc/token\nSYNGRISI_TEST_MODE: true"}}, { appServer }); 
    await Given('I start Server', null, { appServer, testData }); 
    await When('I reload session', null, { page, testData }); 
    await When('I open the app', null, { appServer, page, testData }); 
    await Then('the title is "Login Page"', null, { page }); 
    await Then('the SSO login button should be visible', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('../../features/AUTH/sso_common.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":6,"tags":["@sso-common"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Action","textWithKeyword":"When I set env variables:","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given I start Server","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Then the title is \"Login Page\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Login Page\"","children":[{"start":14,"value":"Login Page","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"Then SSO login should be disabled","stepMatchArguments":[]}]},
  {"pwTestLine":15,"pickleLine":22,"tags":["@sso-common"],"steps":[{"pwStepLine":16,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"When I set env variables:","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":30,"keywordType":"Context","textWithKeyword":"Given I start Server","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":32,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"When I try to access SSO directly","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"Then the current url contains \"/auth\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/auth\"","children":[{"start":26,"value":"/auth","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":23,"pickleLine":37,"slow":true,"tags":["@sso-common","@sso-external","@slow"],"steps":[{"pwStepLine":24,"gherkinStepLine":40,"keywordType":"Action","textWithKeyword":"When I configure SSO with client ID \"syngrisi-e2e-test\" and secret \"auto-provisioned\"","stepMatchArguments":[{"group":{"start":31,"value":"\"syngrisi-e2e-test\"","children":[{"start":32,"value":"syngrisi-e2e-test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":62,"value":"\"auto-provisioned\"","children":[{"start":63,"value":"auto-provisioned","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":25,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"When I set env variables:","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":46,"keywordType":"Context","textWithKeyword":"Given I start Server","stepMatchArguments":[]},{"pwStepLine":27,"gherkinStepLine":49,"keywordType":"Outcome","textWithKeyword":"Then Logto SSO should be available","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":50,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":51,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":52,"keywordType":"Action","textWithKeyword":"When I click SSO login button","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":53,"keywordType":"Action","textWithKeyword":"When I login to Logto with username \"testuser\" and password \"Test123!\"","stepMatchArguments":[{"group":{"start":31,"value":"\"testuser\"","children":[{"start":32,"value":"testuser","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"Test123!\"","children":[{"start":56,"value":"Test123!","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":32,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected back to the app","stepMatchArguments":[]},{"pwStepLine":33,"gherkinStepLine":55,"keywordType":"Outcome","textWithKeyword":"Then I should be authenticated via SSO","stepMatchArguments":[]},{"pwStepLine":34,"gherkinStepLine":58,"keywordType":"Action","textWithKeyword":"When I go to \"logout\" page","stepMatchArguments":[{"group":{"start":8,"value":"\"logout\"","children":[{"start":9,"value":"logout","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":35,"gherkinStepLine":59,"keywordType":"Outcome","textWithKeyword":"Then the current url contains \"/auth\"","stepMatchArguments":[{"group":{"start":25,"value":"\"/auth\"","children":[{"start":26,"value":"/auth","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":36,"gherkinStepLine":62,"keywordType":"Outcome","textWithKeyword":"Then my session should be destroyed","stepMatchArguments":[]}]},
  {"pwTestLine":39,"pickleLine":65,"slow":true,"tags":["@sso-common","@sso-external","@slow"],"steps":[{"pwStepLine":40,"gherkinStepLine":68,"keywordType":"Action","textWithKeyword":"When I configure SSO with client ID \"syngrisi-e2e-test\" and secret \"auto-provisioned\"","stepMatchArguments":[{"group":{"start":31,"value":"\"syngrisi-e2e-test\"","children":[{"start":32,"value":"syngrisi-e2e-test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":62,"value":"\"auto-provisioned\"","children":[{"start":63,"value":"auto-provisioned","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":69,"keywordType":"Action","textWithKeyword":"When I set env variables:","stepMatchArguments":[]},{"pwStepLine":42,"gherkinStepLine":74,"keywordType":"Context","textWithKeyword":"Given I start Server","stepMatchArguments":[]},{"pwStepLine":43,"gherkinStepLine":76,"keywordType":"Outcome","textWithKeyword":"Then Logto SSO should be available","stepMatchArguments":[]},{"pwStepLine":44,"gherkinStepLine":79,"keywordType":"Action","textWithKeyword":"When I reset user \"test@syngrisi.test\" provider to local","stepMatchArguments":[{"group":{"start":13,"value":"\"test@syngrisi.test\"","children":[{"start":14,"value":"test@syngrisi.test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":45,"gherkinStepLine":81,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":82,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":47,"gherkinStepLine":83,"keywordType":"Action","textWithKeyword":"When I click SSO login button","stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":86,"keywordType":"Action","textWithKeyword":"When I login to Logto with username \"testuser\" and password \"Test123!\"","stepMatchArguments":[{"group":{"start":31,"value":"\"testuser\"","children":[{"start":32,"value":"testuser","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"Test123!\"","children":[{"start":56,"value":"Test123!","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":49,"gherkinStepLine":88,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected back to the app","stepMatchArguments":[]},{"pwStepLine":50,"gherkinStepLine":89,"keywordType":"Outcome","textWithKeyword":"Then I should be authenticated via SSO","stepMatchArguments":[]},{"pwStepLine":51,"gherkinStepLine":91,"keywordType":"Outcome","textWithKeyword":"Then the user \"test@syngrisi.test\" should have provider type \"oauth\"","stepMatchArguments":[{"group":{"start":9,"value":"\"test@syngrisi.test\"","children":[{"start":10,"value":"test@syngrisi.test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":56,"value":"\"oauth\"","children":[{"start":57,"value":"oauth","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":54,"pickleLine":94,"slow":true,"tags":["@sso-common","@sso-external","@slow"],"steps":[{"pwStepLine":55,"gherkinStepLine":97,"keywordType":"Action","textWithKeyword":"When I configure SSO with client ID \"syngrisi-e2e-test\" and secret \"auto-provisioned\"","stepMatchArguments":[{"group":{"start":31,"value":"\"syngrisi-e2e-test\"","children":[{"start":32,"value":"syngrisi-e2e-test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":62,"value":"\"auto-provisioned\"","children":[{"start":63,"value":"auto-provisioned","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":56,"gherkinStepLine":98,"keywordType":"Action","textWithKeyword":"When I set env variables:","stepMatchArguments":[]},{"pwStepLine":57,"gherkinStepLine":103,"keywordType":"Context","textWithKeyword":"Given I start Server","stepMatchArguments":[]},{"pwStepLine":58,"gherkinStepLine":105,"keywordType":"Outcome","textWithKeyword":"Then Logto SSO should be available","stepMatchArguments":[]},{"pwStepLine":59,"gherkinStepLine":107,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":60,"gherkinStepLine":108,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":61,"gherkinStepLine":109,"keywordType":"Action","textWithKeyword":"When I click SSO login button","stepMatchArguments":[]},{"pwStepLine":62,"gherkinStepLine":112,"keywordType":"Action","textWithKeyword":"When I login to Logto with username \"testuser\" and password \"Test123!\"","stepMatchArguments":[{"group":{"start":31,"value":"\"testuser\"","children":[{"start":32,"value":"testuser","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":55,"value":"\"Test123!\"","children":[{"start":56,"value":"Test123!","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":63,"gherkinStepLine":114,"keywordType":"Outcome","textWithKeyword":"Then I should be redirected back to the app","stepMatchArguments":[]},{"pwStepLine":64,"gherkinStepLine":115,"keywordType":"Outcome","textWithKeyword":"Then I should be authenticated via SSO","stepMatchArguments":[]},{"pwStepLine":65,"gherkinStepLine":117,"keywordType":"Outcome","textWithKeyword":"Then a new user \"test@syngrisi.test\" should be created with role \"reviewer\"","stepMatchArguments":[{"group":{"start":11,"value":"\"test@syngrisi.test\"","children":[{"start":12,"value":"test@syngrisi.test","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"},{"group":{"start":60,"value":"\"reviewer\"","children":[{"start":61,"value":"reviewer","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":68,"pickleLine":119,"tags":["@sso-common"],"steps":[{"pwStepLine":69,"gherkinStepLine":121,"keywordType":"Action","textWithKeyword":"When I set env variables:","stepMatchArguments":[]},{"pwStepLine":70,"gherkinStepLine":132,"keywordType":"Context","textWithKeyword":"Given I start Server","stepMatchArguments":[]},{"pwStepLine":71,"gherkinStepLine":134,"keywordType":"Action","textWithKeyword":"When I reload session","stepMatchArguments":[]},{"pwStepLine":72,"gherkinStepLine":135,"keywordType":"Action","textWithKeyword":"When I open the app","stepMatchArguments":[]},{"pwStepLine":73,"gherkinStepLine":136,"keywordType":"Outcome","textWithKeyword":"Then the title is \"Login Page\"","stepMatchArguments":[{"group":{"start":13,"value":"\"Login Page\"","children":[{"start":14,"value":"Login Page","children":[{"children":[]}]},{"children":[{"children":[]}]}]},"parameterTypeName":"string"}]},{"pwStepLine":74,"gherkinStepLine":137,"keywordType":"Outcome","textWithKeyword":"Then the SSO login button should be visible","stepMatchArguments":[]}]},
]; // bdd-data-end