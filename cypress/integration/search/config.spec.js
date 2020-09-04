context('sidebar.search', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('search list',()=>{
    cy.get(':input[type=search]')

    .type("npm i -g now")
    
    .should('have.value', 'npm i -g now');

    cy.get(
      '.results-panel>.matching-post p>em'
    ). should('contain', 'npm i -g now');
  })
});
