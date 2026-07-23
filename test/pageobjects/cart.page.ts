class CartPage {

    get cartItems()     { return $$('.cart_item') }
    get continueBtn()   { return $('[data-test="continue-shopping"]') }
    get checkoutBtn()   { return $('[data-test="checkout"]') }
    get removeButtons() { return $$('[data-test^="remove"]') }

    async isLoaded() {
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/cart.html'),
            { timeout: 10000, timeoutMsg: 'Carrinho não carregou' }
        )
    }

    async getItemCount(): Promise<number> {
        return (await this.cartItems).length
    }

    async removeItem(index = 0) {
        const buttons = await this.removeButtons
        await buttons[index].click()
    }

    async continueShopping() {
        await this.continueBtn.click()
    }

    async proceedToCheckout() {
        await this.checkoutBtn.click()
    }
}

export default new CartPage()
