const Nav = function () {
  console.log(this)
}
Nav.name = 'Doscify.Nav'

if (window.Docsify) {
  window.Docsify.use(Nav)
}

export default Nav
