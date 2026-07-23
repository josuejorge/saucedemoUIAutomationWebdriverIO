class HomePage {

    // Inventário
    get inventoryContainer() { return $('.inventory_list') }
    get inventoryItems()     { return $$('.inventory_item') }
    get productNames()       { return $$('.inventory_item_name') }
    get productPrices()      { return $$('.inventory_item_price') }
    get productImages()      { return $$('.inventory_item_img img') }
    get addToCartButtons()   { return $$('[data-test^="add-to-cart"]') }

    // Ordenação e carrinho
    get sortDropdown()       { return $('[data-test="product-sort-container"]') }
    get cartLink()           { return $('.shopping_cart_link') }
    get cartBadge()          { return $('.shopping_cart_badge') }

    // Menu lateral
    get hamburgerMenu()      { return $('#react-burger-menu-btn') }
    get aboutLink()          { return $('#about_sidebar_link') }
    get allItemsLink()       { return $('#inventory_sidebar_link') }

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

    async openMenu() {
        await this.hamburgerMenu.click()
    }

    async selectSort(option: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.sortDropdown.selectByAttribute('value', option)
    }

    async getProductNameTexts(): Promise<string[]> {
        const result: string[] = []
        for (const el of await this.productNames) {
            result.push(await el.getText())
        }
        return result
    }

    async getProductPriceValues(): Promise<number[]> {
        const result: number[] = []
        for (const el of await this.productPrices) {
            const text = await el.getText()
            result.push(parseFloat(text.replace('$', '')))
        }
        return result
    }
}

export default new HomePage()
