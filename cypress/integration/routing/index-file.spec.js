context('routing.indexFile', () => {
  it('handles index file routing', () => {
    cy.visit('http://localhost:3000/index.html');

    cy.get('.sidebar-nav').contains('Changelog').click();

    cy.get('#main').should('contain', 'Bug Fixes');
  })
});
