import logger from '@wdio/logger'
import { faker } from '@faker-js/faker'
import { TestInfo } from '@playwright/test'

export const log = logger('syngrisi-playwright-sdk')

interface WaitOptions {
    attempts?: number;
    interval?: number;
    timeout?: number;
}

export const waitUntil = async <T>(
    callback: (attempt?: number) => Promise<T>,
    options: WaitOptions = {}
): Promise<T | null> => {
    const {
        attempts = 10,
        interval = 200,
        timeout = 10000
    } = options

    let timeoutExceeded = false
    setTimeout(() => {
        timeoutExceeded = true
    }, timeout)

    let result: any

    for (let attempt = 1; attempt <= attempts; attempt++) {
        result = await callback(attempt)
        if (timeoutExceeded) {
            log.warn(`waitUntil timeout: ${timeout} is exceeded`)
            return result
        }

        if (result) {
            return result
        }
        if (attempt < attempts) {
            await new Promise(resolve => setTimeout(resolve, interval))
        }
    }
    return result
}

export const generateRunName = () => faker.lorem.sentence(4)
    .replace('.', '')

export const generateRunIdent = () => faker.string.uuid()

export const getSuiteTitle = (testInfo: TestInfo) => {
    const titles = testInfo.titlePath
    if (titles.length > 1) {
        return titles[titles.length - 2]
    }
    return null
}

export const getTestTitle = (testInfo: TestInfo) => {
    return testInfo.title
}
