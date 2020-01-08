context('sidebar.configurations', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })
  it('should click on the first element', async () => {
    cy.get(
      '.sidebar-nav > :nth-child(1) > :nth-child(1) > ul > :nth-child(1) > a'
    )
      .click()
      .then(() => cy.matchImageSnapshot())
  })

  it('go to #quickstart', () => {
    cy.get(
      '.sidebar-nav > :nth-child(1) > :nth-child(1) > ul > :nth-child(1) > a'
    ).click()
    cy.get('a.section-link[href=\'#/quickstart?id=initialize\']')
      .click()
      .then(() => cy.matchImageSnapshot())
  })
  it('go to #quickstart', () => {
    cy.get(
      '.sidebar-nav > :nth-child(1) > :nth-child(1) > ul > :nth-child(1) > a'
    ).click()
    cy.get('a.section-link[href=\'#/quickstart?id=writing-content\']')
      .click()
      .then(() => cy.matchImageSnapshot())
  })

  it('go to #quickstart', () => {
    cy.get(
      '.sidebar-nav > :nth-child(1) > :nth-child(1) > ul > :nth-child(1) > a'
    ).click()
    cy.get('a.section-link[href=\'#/quickstart?id=preview-your-site\']')
      .click()
      .then(() => cy.matchImageSnapshot())
  })

  it('go to #quickstart', () => {
    cy.get(
      '.sidebar-nav > :nth-child(1) > :nth-child(1) > ul > :nth-child(1) > a'
    ).click()
    cy.get('a.section-link[href=\'#/quickstart?id=manual-initialization\']')
      .click()
      .then(() => cy.matchImageSnapshot())
  })

  it('go to #quickstart', () => {
    cy.get(
      '.sidebar-nav > :nth-child(1) > :nth-child(1) > ul > :nth-child(1) > a'
    ).click()

    cy.get('a.section-link[href=\'#/quickstart?id=loading-dialog\']')
      .click()
      .then(() => cy.matchImageSnapshot())
  })
})
