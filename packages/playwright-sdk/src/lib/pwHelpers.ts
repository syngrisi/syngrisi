import { UAParser } from 'ua-parser-js'
import { Page } from '@playwright/test'
import { waitUntil } from './utils'
import { BrowserName } from '../../types'
import { ViewportSize } from 'playwright-core'

import { transformOs } from '@syngrisi/core-api'

export const getViewport = async (viewport: ViewportSize): Promise<string> => {
    return viewport ? `${viewport.width}x${viewport.height}` : '0x0'
}

export const getBrowserName = async (browserName: BrowserName): Promise<string> => {
    return browserName
}

export const getOS = async (page: Page): Promise<string> => {
    const osName = await waitUntil(async () => {
        const ua = await page.evaluate(() => navigator.userAgent)
        const userAgentInfo = UAParser(ua)
        return userAgentInfo.os.name || null
    })

    return transformOs(osName || 'UNKNOWN')
}

export const getBrowserFullVersion = (fullVersion: string) => fullVersion

export const getBrowserVersion = (fullVersion: string) => {
    return fullVersion.split('.')[0]
}
