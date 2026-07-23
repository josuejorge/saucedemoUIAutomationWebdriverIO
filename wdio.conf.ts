import { Options } from '@wdio/types'
import AllureReporter from '@wdio/allure-reporter'

export const config: Options.Testrunner = {
    runner: 'local',

    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true,
        },
    },

    specs: ['./test/specs/**/*.spec.ts'],
    exclude: [],

    maxInstances: 1,

    capabilities: [{
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: [
                '--no-first-run',
                '--no-default-browser-check',
            ],
            prefs: {
                'credentials_enable_service': false,
                'profile.password_manager_enabled': false,
                'profile.password_manager_leak_detection': false,
            },
        },
    }],

    logLevel: 'warn',
    bail: 0,
    baseUrl: 'https://www.saucedemo.com',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    services: ['chromedriver'],

    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }],
    ],

    afterTest: async function(_test, _context, { error }) {
        if (error) {
            const screenshot = await browser.takeScreenshot()
            AllureReporter.addAttachment('Screenshot', Buffer.from(screenshot, 'base64'), 'image/png')
        }
    },

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },
}
