import { Browser, Page } from '@playwright/test'
import { BrowserName } from '../types'
import { ViewportSize } from 'playwright-core'

/**
 * instances of the class contains playwright entities which need to perform checks
 */
export class PlaywrightEntities {
    page: Page
    browser: Browser
    browserName: BrowserName
    viewport: ViewportSize

    constructor(page: Page) {
        this.page = page
        this.browser = page.context().browser()!
        this.browserName = page.context()?.browser()?.browserType()?.name() as BrowserName
        this.viewport = page.viewportSize()!
    }
}
