class HomePage {

    get cartLink()         { return $('.shopping_cart_link') }
    get cartBadge()        { return $('.shopping_cart_badge') }
    get addToCartButtons() { return $$('[data-test^="add-to-cart"]') }

    async isLoaded() {
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/inventory.html'),
            { timeout: 10000, timeoutMsg: 'Home não carregou' }
        )
    }

    async addItemToCart(index = 0) {
        const buttons = await this.addToCartButtons
        await buttons[index].click()
    }

    async getCartCount(): Promise<number> {
        if (await this.cartBadge.isDisplayed()) {
            return parseInt(await this.cartBadge.getText(), 10)
        }
        return 0
    }

    async goToCart() {
        await this.cartLink.click()
    }
}

export default new HomePage()
