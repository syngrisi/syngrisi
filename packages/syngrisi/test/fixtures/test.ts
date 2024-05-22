import { test as base } from "@playwright/test"

import {} from "@playwright/test/reporter"

export const test = base.extend<{ locator: Function }>({
    locator: async ({ page }, use) => {
        let locator =  page.locator.bind(page)
        await use(locator)
        locator = null
        console.log('👹', locator)
    }
})