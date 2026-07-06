import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { appSettings } from '@settings';
import { isRcaEnabled, isRcaEnvControlled } from './rca.config';

// isRcaEnabled reads process.env.SYNGRISI_RCA (env wins) then appSettings.get
// (an imported singleton). Monkey-patch get + control the env var per test.
const originalGet = appSettings.get;

afterEach(() => {
    (appSettings as unknown as { get: unknown }).get = originalGet;
    delete process.env.SYNGRISI_RCA;
});

const setSetting = (setting: unknown) => {
    (appSettings as unknown as { get: (n: string) => Promise<unknown> }).get = async () => setting;
};

test('env unset + setting enabled:true value:"true" -> enabled', async () => {
    setSetting({ enabled: true, value: 'true' });
    assert.equal(await isRcaEnabled(), true);
    assert.equal(isRcaEnvControlled(), false);
});

test('env unset + setting value:"false" -> disabled', async () => {
    setSetting({ enabled: true, value: 'false' });
    assert.equal(await isRcaEnabled(), false);
});

test('env unset + setting enabled:false -> disabled (both flags required)', async () => {
    setSetting({ enabled: false, value: 'true' });
    assert.equal(await isRcaEnabled(), false);
});

test('env unset + no setting -> disabled (default off)', async () => {
    setSetting(undefined);
    assert.equal(await isRcaEnabled(), false);
});

test('env "true" wins over a disabled setting', async () => {
    setSetting({ enabled: true, value: 'false' });
    process.env.SYNGRISI_RCA = 'true';
    assert.equal(await isRcaEnabled(), true);
    assert.equal(isRcaEnvControlled(), true);
});

test('env "false" wins over an enabled setting', async () => {
    setSetting({ enabled: true, value: 'true' });
    process.env.SYNGRISI_RCA = 'false';
    assert.equal(await isRcaEnabled(), false);
    assert.equal(isRcaEnvControlled(), true);
});

test('isRcaEnvControlled: only "true"/"false" lock; other values do not', () => {
    process.env.SYNGRISI_RCA = 'yes';
    assert.equal(isRcaEnvControlled(), false);
});
