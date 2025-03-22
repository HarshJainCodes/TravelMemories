describe('should be able to upload photos', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('[data-qa-id="start-creating-btn"]').click()
    })
    
    it('should make a new collection and upload photos there', () => {
        Cypress.on('uncaught:exception', () => false)
        
        cy.loginAndVisitMap()

        cy.get('[data-qa-id="upload-btn"]').click()
        cy.get('[data-qa-id="trip-title-searchbar"]').type('DemoTrip')

        cy.get('[data-qa-id="trip-year"]').clear()
        cy.get('[data-qa-id="trip-year"]').type('2025')

        // cy.get('[data-qa-id="location-x"]').type('27.120121')
        // cy.get('[data-qa-id="location-y"]').type('78.123232')

        cy.get('#map-container-image-uploader').click({
            position: 'center'
        })

        cy.get('[data-qa-id="file-upload"]').selectFile('cypress/fixtures/test_upload_img.jpg', {
            action: 'drag-drop'
        })

        const imageUploadUrl = /^https:\/\/travelmemories.azurewebsites.net\/ImageUpload/

        cy.intercept(imageUploadUrl).as('uploadImages')
        cy.get('[data-qa-id="upload-images"]').click()
        cy.wait('@uploadImages').its('response.statusCode').should('eq', 200)
    })
})