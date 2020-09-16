context('routing.indexFile', () => {
  it('handles index file routing', () => {
    cy.visit('http://localhost:3000/index.html');

    cy.get('.sidebar-nav').contains('Changelog').click();

    cy.get('#main').should('contain', 'Bug Fixes');
  })

  it('handles index file routing with root fragment', () => {
    cy.visit('http://localhost:3000/index.html#/');

    cy.get('.sidebar-nav').contains('Changelog').click();

    cy.get('#main').should('contain', 'Bug Fixes');
  })

  it('handles index file routing with page fragment', () => {
    cy.visit('http://localhost:3000/index.html#/changelog');

    cy.get('#main').should('contain', 'Bug Fixes');
  })

  it('returns 404 for index file with leading fragment', () => {
    cy.visit('http://localhost:3000/#/index.html/');

    cy.get('#main').should('contain', '404');
  })

  it('returns 500 for index file as folder', () => {
    cy.request({
      url: 'http://localhost:3000/index.html/#/',
      failOnStatusCode: false
    }).then((resp) => expect(500).to.eq(resp.status))
  })

  it('does not serve shadowing index markdown file', () => {
    cy.request({
      url: 'http://localhost:3000/index.md',
      failOnStatusCode: false
    }).then((resp) => expect(404).to.eq(resp.status))
  })
});
