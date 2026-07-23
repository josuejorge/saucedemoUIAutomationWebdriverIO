import LoginPage from '../pageobjects/login.page'
import HomePage   from '../pageobjects/home.page'
import CartPage   from '../pageobjects/cart.page'

const VALID_USER = 'standard_user'
const VALID_PASS = 'secret_sauce'

describe('Carrinho', () => {

    beforeEach(async () => {
        await LoginPage.navigate()
        await LoginPage.login(VALID_USER, VALID_PASS)
        await HomePage.isLoaded()
    })

    it('Validar que item adicionado aparece no carrinho', async () => {
        await HomePage.addItemToCart()
        await HomePage.goToCart()
        await CartPage.isLoaded()
        const count = await CartPage.getItemCount()
        await expect(count).toBe(1)
    })

    it('Validar badge do carrinho ao adicionar item', async () => {
        await HomePage.addItemToCart()
        const count = await HomePage.getCartCount()
        await expect(count).toBe(1)
    })

    it('Validar badge ao adicionar múltiplos itens', async () => {
        await HomePage.addItemToCart(0)
        await HomePage.addItemToCart(1)
        const count = await HomePage.getCartCount()
        await expect(count).toBe(2)
    })

    it('Validar remover item do carrinho', async () => {
        await HomePage.addItemToCart()
        await HomePage.goToCart()
        await CartPage.isLoaded()
        await CartPage.removeItem()
        const count = await CartPage.getItemCount()
        await expect(count).toBe(0)
    })

    it('Validar continuar comprando a partir do carrinho', async () => {
        await HomePage.addItemToCart()
        await HomePage.goToCart()
        await CartPage.isLoaded()
        await CartPage.continueShopping()
        await expect(browser).toHaveUrl(expect.stringContaining('/inventory.html'))
    })
})
