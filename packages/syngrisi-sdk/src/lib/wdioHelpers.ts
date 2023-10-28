import { default as logger } from '@wdio/logger'

const log = logger('syngrisi-wdio-sdk')

// @ts-ignore
import { transformOs } from '@syngrisi/core-api'

declare var browser: WebdriverIO.Browser

export const getViewport = async () => {
    if (isAndroid()) {
        // @ts-ignore
        return browser.capabilities.deviceScreenSize
    }

    const viewport = await browser.getWindowSize()
    if (viewport && viewport.width && viewport.height) {
        return `${viewport.width}x${viewport.height}`
    }
    return '0x0'
}

export const getOS = async () => {
    let platform
    if (isAndroid() || isIos()) {

        // @ts-ignore
        platform = browser.options?.capabilities['bstack:options']?.deviceName
            // @ts-ignore
            || browser.options?.capabilities['appium:deviceName']
            // @ts-ignore
            || browser.options?.capabilities?.deviceName
        if (!platform) {

            throw new Error(`Cannot get the platform of your device: ${JSON.stringify(browser.options?.capabilities)}`)
        }
    } else {
        let navPlatform
        for (let x = 0; x < 5; x++) {
            try {
                navPlatform = await browser.execute(() => navigator.platform)
                if (navPlatform) break
            } catch (e) {
                log.error(`Error - cannot get the platform #${x}: '${e}'`)
                await browser.pause(500)
                navPlatform = await browser.execute(() => navigator.platform)
            }
        }
        // @ts-ignore
        platform = browser.capabilities.platform || navPlatform
    }

    if (process.env.ENV_POSTFIX) {
        return `${platform}_${process.env.ENV_POSTFIX}`
    }
    return transformOs(platform)
}

export const getBrowserName = () => {
    // @ts-ignore
    let { browserName } = browser.capabilities
    // @ts-ignore
    const chromeOpts = browser.options.capabilities['goog:chromeOptions']
    if (chromeOpts && chromeOpts.args && chromeOpts.args.includes('--headless')) {
        browserName += ' [HEADLESS]'
    }
    return browserName
}

export const isAndroid = () => {
    return (
        browser.isAndroid
        // @ts-ignore
        || (browser.options.capabilities.browserName === 'Android')
        // @ts-ignore
        || (browser.options.capabilities.platformName === 'Android')
    )
}

export const isIos = () => {
    return browser.isIOS
        // @ts-ignore
        || (browser.execute(() => navigator.platform) === 'iPhone')
        // @ts-ignore
        || (browser.options.capabilities?.platformName?.toLowerCase() === 'ios')
        // @ts-ignore
        || (browser.options.capabilities?.browserName === 'iPhone')
        || false
}

export const getBrowserFullVersion = () => {
    let version
    if (isAndroid() || isIos()) {
        // @ts-ignore
        version = browser.options?.capabilities['bstack:options']?.osVersion
            // @ts-ignore
            || browser.capabilities?.version
            // @ts-ignore
            || browser.options?.capabilities.platformVersion
    } else {
        // @ts-ignore
        version = browser.capabilities?.browserVersion || browser.capabilities?.version
    }
    if (!version) {
        // eslint-disable-next-line max-len
        throw new Error('Cannot get Browser Version, try to check "capabilities.version", "capabilities.platformVersion" or "capabilities.browserVersion"')
    }
    return version
}

export const getBrowserVersion = () => {
    const fullVersion = getBrowserFullVersion()
    if (!fullVersion.includes('.')) {
        return fullVersion
    }
    return fullVersion.split('.')[0]
}
