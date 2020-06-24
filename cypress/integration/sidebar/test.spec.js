describe('Mobile miscellennon', () => {
  context('sidebar toggle on mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
      cy.visit('http://localhost:3000');
    });

    it('sidebar toggle should not be shown in onl', () => {
      cy.window().should('have.property', '$docsify')
        .invoke('$docsify', 'coverOnly', 'true')
      cy.visit('http://localhost:3000');
      cy.visit('http://localhost:3000/#/quickstart');
    });
  });
})