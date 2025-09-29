// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
const PROD_URL = 'https://memoriesbackend.harshjain17.com';

Cypress.Commands.add('loginAndVisitMap', () => {
	cy.visit('/');
	cy.get('[data-qa-id="start-creating-btn"]').click();

	cy.get('[data-qa-id="login-hyperlink"]').click();

	cy.get('[data-qa-id="username-field"]').type('cypress user');
	cy.get('[data-qa-id="email-field"]').type('cypressuserhj@gmail.com');
	cy.get('[data-qa-id="password-field"]').type('hjcypress');

	cy.intercept(`${PROD_URL}/auth/Login`).as('loginRequest');
	cy.get('[data-qa-id="login-action-btn"]').click();
	cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

	cy.get('#map').should('exist');
});
