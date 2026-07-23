import LoginPage from '../pageobjects/login.page'
import HomePage  from '../pageobjects/home.page'

const VALID_USER = 'standard_user'
const VALID_PASS = 'secret_sauce'

describe('Home', () => {

    beforeEach(async () => {
        await LoginPage.navigate()
        await LoginPage.login(VALID_USER, VALID_PASS)
        await HomePage.isLoaded()
    })

    it('Validar homepage carregada', async () => {
        await expect(browser).toHaveUrl(expect.stringContaining('/inventory.html'))
        await expect(HomePage.inventoryContainer).toBeDisplayed()
    })

    it('Validar quantidade de produtos exibidos', async () => {
        const items = await HomePage.inventoryItems
        expect(items.length).toBe(6)
    })

    it('Validar card de produto na home', async () => {
        const names   = await HomePage.productNames
        const prices  = await HomePage.productPrices
        const images  = await HomePage.productImages
        const buttons = await HomePage.addToCartButtons

        await expect(names[0]).toBeDisplayed()
        await expect(prices[0]).toBeDisplayed()
        await expect(images[0]).toBeDisplayed()
        await expect(buttons[0]).toBeDisplayed()

        const priceText  = await prices[0].getText()
        expect(priceText).toMatch(/^\$\d+\.\d{2}$/)

        const buttonText = await buttons[0].getText()
        expect(buttonText).toBe('Add to cart')
    })

    it('Validar carrinho persistido após reload', async () => {
        await HomePage.addItemToCart()
        expect(await HomePage.getCartCount()).toBe(1)
        await browser.refresh()
        await HomePage.isLoaded()
        expect(await HomePage.getCartCount()).toBe(1)
    })

    it('Validar ordenar produtos Name (A to Z)', async () => {
        await HomePage.selectSort('az')
        const names  = await HomePage.getProductNameTexts()
        const sorted = [...names].sort((a, b) => a.localeCompare(b))
        expect(names).toEqual(sorted)
    })

    it('Validar ordenar produtos Name (Z to A)', async () => {
        await HomePage.selectSort('za')
        const names  = await HomePage.getProductNameTexts()
        const sorted = [...names].sort((a, b) => b.localeCompare(a))
        expect(names).toEqual(sorted)
    })

    it('Validar ordenar produtos Price (Low to High)', async () => {
        await HomePage.selectSort('lohi')
        const prices = await HomePage.getProductPriceValues()
        const sorted = [...prices].sort((a, b) => a - b)
        expect(prices).toEqual(sorted)
    })

    it('Validar ordenar produtos Price (High to Low)', async () => {
        await HomePage.selectSort('hilo')
        const prices = await HomePage.getProductPriceValues()
        const sorted = [...prices].sort((a, b) => b - a)
        expect(prices).toEqual(sorted)
    })

    it('Validar About via menu hamburguer', async () => {
        await HomePage.openMenu()
        await expect(HomePage.aboutLink).toBeDisplayed()
        await HomePage.aboutLink.click()
        await expect(browser).toHaveUrl(expect.stringContaining('saucelabs.com'))
    })

    it('Validar All Items via menu hamburguer', async () => {
        await HomePage.openMenu()
        await expect(HomePage.allItemsLink).toBeDisplayed()
        await HomePage.allItemsLink.click()
        await expect(browser).toHaveUrl(expect.stringContaining('/inventory.html'))
    })
})
