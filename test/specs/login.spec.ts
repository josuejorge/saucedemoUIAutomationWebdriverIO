import LoginPage from '../pageobjects/login.page'

const VALID_USER     = 'standard_user'
const VALID_PASS     = 'secret_sauce'
const LOCKED_USER    = 'locked_out_user'
const INVALID_USER   = 'invalid_user'
const INVALID_PASS   = 'wrong_password'

describe('Login', () => {

    beforeEach(async () => {
        await LoginPage.navigate()
    })

    it('Validar login com sucesso', async () => {
        await LoginPage.login(VALID_USER, VALID_PASS)
        await expect(browser).toHaveUrl(expect.stringContaining('/inventory.html'))
    })

    it('Validar login com credenciais inválidas', async () => {
        await LoginPage.login(INVALID_USER, INVALID_PASS)
        const error = await LoginPage.getErrorMessage()
        await expect(error).toContain('Username and password do not match')
    })

    it('Validar login com campos vazios', async () => {
        await LoginPage.login('', '')
        const error = await LoginPage.getErrorMessage()
        await expect(error).toEqual('Epic sadface: Username is required')
    })

    it('Validar login com usuário vazio', async () => {
        await LoginPage.login('', VALID_PASS)
        const error = await LoginPage.getErrorMessage()
        await expect(error).toEqual('Epic sadface: Username is required')
    })

    it('Validar login com senha vazia', async () => {
        await LoginPage.login(VALID_USER, '')
        const error = await LoginPage.getErrorMessage()
        await expect(error).toEqual('Epic sadface: Password is required')
    })

    it('Validar login com usuário bloqueado', async () => {
        await LoginPage.login(LOCKED_USER, VALID_PASS)
        const error = await LoginPage.getErrorMessage()
        await expect(error).toContain('Sorry, this user has been locked out')
    })
})
