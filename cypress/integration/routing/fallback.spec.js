context('config.fallbackLanguages', () => {
  it('fallbacks respecting aliases', () => {
    cy.visit('http://localhost:3000/#/es/');

    cy.get('.sidebar-nav').contains('Changelog').click();

    cy.get('#main').should('contain', 'Bug Fixes');
  })
});
