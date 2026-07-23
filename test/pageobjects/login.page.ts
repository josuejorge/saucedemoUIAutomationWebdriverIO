class LoginPage {

    // Locators
    get usernameInput() { return $('#user-name') }
    get passwordInput() { return $('#password') }
    get loginButton()   { return $('#login-button') }
    get errorMessage()  { return $('[data-test="error"]') }

    async navigate() {
        await browser.url('/')
    }

    async login(username: string, password: string) {
        await this.usernameInput.setValue(username)
        await this.passwordInput.setValue(password)
        await this.loginButton.click()
    }

    async isLoginSuccessful(): Promise<boolean> {
        try {
            await browser.waitUntil(
                async () => (await browser.getUrl()).includes('/inventory.html'),
                { timeout: 10000, timeoutMsg: 'URL não mudou para /inventory.html' }
            )
            return true
        } catch {
            return false
        }
    }

    async getErrorMessage(): Promise<string> {
        await this.errorMessage.waitForDisplayed({ timeout: 5000 })
        return this.errorMessage.getText()
    }
}

export default new LoginPage()
