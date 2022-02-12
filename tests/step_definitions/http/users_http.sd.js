/* eslint-disable prefer-arrow-callback,no-console */
const { When } = require('cucumber');
const got = require('got');
const { requestWithLastSessionSid } = require('../../src/utills/common');

When(/^I create via http test user$/, async function () {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/loadTestUser`;
    console.log({ uri });
    const res = await got.get(uri);
    console.log({ response: res.body });
    expect(JSON.parse(res.body).username)
        .toBe('Test');
});

When(/^I login via http with user:"([^"]*)" password "([^"]*)"$/, async function (login, password) {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}`;
    console.log({ uri });

    const res = (await got.post(
        `${uri}/login?origin=%2F&noredirect=1`,
        {
            headers: {
                'upgrade-insecure-requests': '1',
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: `username=${login}&password=${password}`,
        }
    ));
    // console.log({ Body: res.body });
    const sessionSid = res.headers['set-cookie'][0].split(';')
        .filter((x) => x.includes('connect.sid'))[0].split('=')[1];
    console.log({ sessionSid });

    this.saveItem('users', {
        [login]: { sessionSid },
    });

    this.saveItem('lastSessionId', sessionSid);
});

When(/^I create via http user as:"([^"]*)" with params:$/, async function (user, json) {
    const params = JSON.parse(json);
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/users`;
    const { sessionSid } = this.getSavedItem('users')[user];
    console.log({ sessionSid });

    const res = await requestWithLastSessionSid(`${uri}`,
        this,
        {
            method: 'POST',
            form: {
                username: params.username,
                firstName: params.firstName,
                lastName: params.lastName,
                role: params.role,
                password: params.password,
            },
        });
    console.log({ respBody: res.json });
});

When(/^I generate via http API key for the User$/, async function () {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/apikey`;
    const res = await requestWithLastSessionSid(uri, this);
    console.log({ respBodyJSON: res.json });
    const apiKey = res.json.apikey;
    console.log({ apiKey });
    this.saveItem('apiKey', { value: apiKey });
});
