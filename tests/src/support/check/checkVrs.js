export default function (name, imageBuffer, domDump) {
    return new Promise(
        async function (resolve, reject) {
            try {
                if(!browser.vDriver)
                    throw `'browser.vDriver' is not defined, looks lite the driver wasn't init, check @visual tag on scenario`
                const result = await browser.vDriver.checkSnapshoot(name, imageBuffer, domDump);
                resolve(result)
            } catch (e) {
                reject(e);
            }
        }
    )
};
