import LoginPage    from '../pageobjects/login.page'
import HomePage     from '../pageobjects/home.page'
import CartPage     from '../pageobjects/cart.page'
import CheckoutPage from '../pageobjects/checkout.page'

const VALID_USER = 'standard_user'
const VALID_PASS = 'secret_sauce'

describe('Checkout', () => {

    beforeEach(async () => {
        await LoginPage.navigate()
        await LoginPage.login(VALID_USER, VALID_PASS)
        await HomePage.isLoaded()
        await HomePage.addItemToCart()
        await HomePage.goToCart()
        await CartPage.isLoaded()
        await CartPage.proceedToCheckout()
    })

    it('Validar checkout sem preencher informações', async () => {
        await CheckoutPage.continue()
        const error = await CheckoutPage.getErrorMessage()
        await expect(error).toContain('First Name is required')
    })

    it('Validar checkout sem sobrenome', async () => {
        await CheckoutPage.fillInfo('João', '', '12345')
        await CheckoutPage.continue()
        const error = await CheckoutPage.getErrorMessage()
        await expect(error).toContain('Last Name is required')
    })

    it('Validar checkout sem CEP', async () => {
        await CheckoutPage.fillInfo('João', 'Silva', '')
        await CheckoutPage.continue()
        const error = await CheckoutPage.getErrorMessage()
        await expect(error).toContain('Postal Code is required')
    })

    it('Validar cancelar compra e voltar ao carrinho', async () => {
        await CheckoutPage.cancel()
        await expect(browser).toHaveUrl(expect.stringContaining('/cart.html'))
    })

    it('Validar compra completa com sucesso', async () => {
        await CheckoutPage.fillInfo('João', 'Silva', '12345')
        await CheckoutPage.continue()
        await expect(browser).toHaveUrl(expect.stringContaining('/checkout-step-two.html'))
        await CheckoutPage.finish()
        await expect(browser).toHaveUrl(expect.stringContaining('/checkout-complete.html'))
        const header = await CheckoutPage.completeHeader.getText()
        await expect(header).toContain('Thank you for your order')
    })
})
