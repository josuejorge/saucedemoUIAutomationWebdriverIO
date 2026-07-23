class CheckoutPage {

    // Step 1
    get firstNameInput()  { return $('#first-name') }
    get lastNameInput()   { return $('#last-name') }
    get postalCodeInput() { return $('#postal-code') }
    get continueBtn()     { return $('#continue') }
    get cancelBtn()       { return $('#cancel') }
    get errorMessage()    { return $('[data-test="error"]') }

    // Step 2
    get finishBtn()       { return $('#finish') }

    // Complete
    get completeHeader()  { return $('.complete-header') }

    async fillInfo(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.setValue(firstName)
        await this.lastNameInput.setValue(lastName)
        await this.postalCodeInput.setValue(postalCode)
    }

    async continue() {
        await this.continueBtn.click()
    }

    async finish() {
        await this.finishBtn.click()
    }

    async cancel() {
        await this.cancelBtn.click()
    }

    async getErrorMessage(): Promise<string> {
        await this.errorMessage.waitForDisplayed({ timeout: 5000 })
        return this.errorMessage.getText()
    }
}

export default new CheckoutPage()
