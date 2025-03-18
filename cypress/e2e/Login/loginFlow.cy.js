describe('is able to login', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('[data-qa-id="start-creating-btn"]').click()
    })

    it('clicks on START CREATING and try to login on already existing account', () => {
        cy.get('[data-qa-id="username-field"]').type('harsh jain')
        cy.get('[data-qa-id="email-field"]').type('harshjain17may@gmail.com')
        cy.get('[data-qa-id="password-field"]').type('something')

        cy.intercept('https://travelmemories.azurewebsites.net/auth/Register').as('registerRequest')
        cy.get('[data-qa-id="login-action-btn"]').click()
        cy.wait('@registerRequest').its('response.statusCode').should('eq', 400)
        cy.contains('User With This Email Already Exists').should('exist');
    })

    it('enters email that does not exist', () => {
        cy.get('[data-qa-id="login-hyperlink"]').click()

        cy.get('[data-qa-id="username-field"]').type('cypress user')
        cy.get('[data-qa-id="email-field"]').type('cypressuserhj123@gmail.com')
        cy.get('[data-qa-id="password-field"]').type('hjcypress')

        cy.intercept('https://travelmemories.azurewebsites.net/auth/Login').as('loginRequest')
        cy.get('[data-qa-id="login-action-btn"]').click()
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 404)
        cy.contains('User With This Email Does Not Exist').should('exist');
    })

    it('enters correct email but wrong password', () => {
        cy.get('[data-qa-id="login-hyperlink"]').click()

        cy.get('[data-qa-id="username-field"]').type('cypress user')
        cy.get('[data-qa-id="email-field"]').type('cypressuserhj@gmail.com')
        cy.get('[data-qa-id="password-field"]').type('hjcypresswrong')

        cy.intercept('https://travelmemories.azurewebsites.net/auth/Login').as('loginRequest')
        cy.get('[data-qa-id="login-action-btn"]').click()
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 400)
        cy.contains('Incorrect Email or Password').should('exist');
    })

    it('enters correct email and password', () => {
        cy.get('[data-qa-id="login-hyperlink"]').click()

        cy.get('[data-qa-id="username-field"]').type('cypress user')
        cy.get('[data-qa-id="email-field"]').type('cypressuserhj@gmail.com')
        cy.get('[data-qa-id="password-field"]').type('hjcypress')

        cy.intercept('https://travelmemories.azurewebsites.net/auth/Login').as('loginRequest')
        cy.get('[data-qa-id="login-action-btn"]').click()
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)

        cy.get('#map').should('exist')
    })
})