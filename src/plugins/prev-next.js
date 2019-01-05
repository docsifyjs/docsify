function getLink(link) {
  if (link instanceof Element) {
    link = link.getAttribute('href')
  }
  var hash = (link.match(/#.+/) || '').toString().replace('#', '').replace(/\?.*/, '')
  return hash || '/'
}

function getLinks() {
  var sidebar = document.querySelector('.sidebar')
  var links = [].slice.call(sidebar.querySelectorAll('a'))
  var current = links.find(link => getLink(link) === getLink(location.href))
  var index = links.indexOf(current)

  return {
    length: links.length,
    current: current,
    index: index,
    prev: links[index - 1],
    next: links[index + 1]
  }
}

function pageNav(hook) {
  function navigate(name) {
    var links = getLinks()
    var link = links[name]
    if (link) {
      window.location.hash = getLink(link)
    }
  }

  hook.init(function () {
    window.addEventListener('keydown', function (event) {
      if (!event.ctrlKey && !event.metaKey) {
        if (event.keyCode === 37) {
          navigate('prev')
        }
        if (event.keyCode === 39) {
          navigate('next')
        }
      }
    })
  })
}

function pageLinks(hook) {
  function makeLinks() {
    var links = getLinks()
    if (!links.current) {
      return ''
    }

    var html = ''
    if (links.prev) {
      html += '<span class="guide-link-prev">' + links.prev.outerHTML + '</span>'
    }
    if (links.next) {
      html += '<span class="guide-link-next">' + links.next.outerHTML + '</span>'
    }

    return html
  }

  hook.afterEach(function (html, next) {
    next(html + '<div class="guide-links">' + makeLinks() + '</div>')
  })

  hook.ready(function () {
    document.querySelector('.guide-links').innerHTML = makeLinks()
  })
}

$docsify.plugins = [].concat(pageLinks, pageNav, $docsify.plugins)
