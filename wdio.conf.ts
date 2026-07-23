import { Options }    from '@wdio/types'
import AllureReporter from '@wdio/allure-reporter'
import PDFDocument    from 'pdfkit'
import * as fs        from 'fs'
import * as path      from 'path'

type TestResult = {
    name:       string
    status:     'passed' | 'failed'
    screenshot: string
    timestamp:  string
}

const testResults: TestResult[] = []

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

    afterTest: async function(test, _context, { error }) {
        const screenshot = await browser.takeScreenshot()

        testResults.push({
            name:      `${test.parent} > ${test.title}`,
            status:    error ? 'failed' : 'passed',
            screenshot,
            timestamp: new Date().toLocaleString('pt-BR'),
        })

        if (error) {
            AllureReporter.addAttachment(
                'Screenshot',
                Buffer.from(screenshot, 'base64'),
                'image/png'
            )
        }
    },

    after: function(_result, _capabilities, specs) {
        return new Promise<void>((resolve) => {
            if (testResults.length === 0) { resolve(); return }

            const specName  = path.basename(specs[0], '.ts').replace('.spec', '')
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
            const outDir    = 'evidence'
            const pdfPath   = path.join(outDir, `${timestamp}_${specName}.pdf`)

            if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

            const passed = testResults.filter(r => r.status === 'passed').length
            const failed = testResults.filter(r => r.status === 'failed').length

            const doc    = new PDFDocument({ margin: 40, size: 'A4' })
            const stream = fs.createWriteStream(pdfPath)
            doc.pipe(stream)

            // --- Capa ---
            doc.fontSize(22).fillColor('#000000').text('Test Evidence Report', { align: 'center' })
            doc.moveDown(0.5)
            doc.fontSize(14).text(`Suite: ${specName}`, { align: 'center' })
            doc.fontSize(10).fillColor('#444444').text(
                `Generated: ${new Date().toLocaleString('pt-BR')}`,
                { align: 'center' }
            )
            doc.moveDown(1.5)
            doc.fontSize(13).fillColor('#28a745').text(`PASSED: ${passed}`, { align: 'center' })
            doc.fillColor('#dc3545').text(`FAILED: ${failed}`, { align: 'center' })

            // --- Uma página por teste ---
            for (const result of testResults) {
                doc.addPage()

                const color = result.status === 'passed' ? '#28a745' : '#dc3545'
                const label = result.status === 'passed' ? 'PASSED' : 'FAILED'

                doc.fontSize(13).fillColor(color).text(`[${label}]`, { continued: true })
                doc.fillColor('#000000').fontSize(12).text(`  ${result.name}`)
                doc.fontSize(9).fillColor('#666666').text(result.timestamp)
                doc.fillColor('#000000').moveDown(0.5)

                doc.image(Buffer.from(result.screenshot, 'base64'), {
                    fit:   [515, 630],
                    align: 'center',
                })
            }

            stream.on('finish', () => {
                testResults.length = 0
                resolve()
            })

            doc.end()
        })
    },

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000,
    },
}
