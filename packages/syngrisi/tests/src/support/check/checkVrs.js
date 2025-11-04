module.exports = function (checkName, imageBuffer, params, domDump, suppressErrors) {
    return new Promise(
        (resolve, reject) => {
            try {
                if (!browser.vDriver) {
                    return reject(new Error('\'browser.vDriver\' is not defined, looks lite the driver wasn\'t init, check @visual tag on scenario'));
                }

                const result = browser.vDriver.check(
                    {
                        checkName,
                        imageBuffer,
                        params,
                        domDump,
                        suppressErrors,
                    }
                );
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        }
    );
}
