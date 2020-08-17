const paths = {}
const promises = []
// const NO_DATA_TEXT = "Sonuç bulunamadı ..."
// var ResultColor = 'yellow'

const configs = {
	NO_DATA_TEXT: 'Nothing Found ...',
	RESULT_COLOR: 'yellow',
}

function CreateSearchComponent () {
	const code = `
  .sidebar {
  padding-top: 0;
  }
  .search {
  margin-bottom: 20px;
  padding: 6px;
  border-bottom: 1px solid #eee;
  }
  .search .input-wrap {
  display: flex;
  align-items: center;
  }
  .search .results-panel {
  display: none;
  }
  .search .results-panel.show {
  display: block;
  }
  .search input {
  outline: none;
  border: none;
  width: 100%;
  padding: 0 7px;
  line-height: 36px;
  font-size: 14px;
  border: 1px solid transparent;
  }
  .search input:focus {
  box-shadow: 0 0 5px var(--theme-color, #42b983);
  border: 1px solid var(--theme-color, #42b983);
  }
  .search input::-webkit-search-decoration,
  .search input::-webkit-search-cancel-button,
  .search input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  }
  .search .clear-button {
  cursor: pointer;
  width: 36px;
  text-align: right;
  display: none;
  }
  .search .clear-button.show {
  display: block;
  }
  .search .clear-button svg {
  transform: scale(.5);
  }
  .search h2 {
  font-size: 17px;
  margin: 10px 0;
  }
  .search a {
  text-decoration: none;
  color: inherit;
  }
  .search .matching-post {
  border-bottom: 1px solid #eee;
  }
  .search .matching-post:last-child {
  border-bottom: 0;
  }
  .search p {
  font-size: 12px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  }
  .search p.empty {
  text-align: center;
  }
  .app-name.hide, .sidebar-nav.hide {
  display: none;
  }

  .lbC {
    background-color: yellow;
  }

  `
	const search = Docsify.dom.find('.search')
	if (!search) {
		Docsify.dom.style(code)
		const search = 'Arama ...'
		const html = `<div class="input-wrap">
    <input type="search" value="" placeholder="${ search }" aria-label="fullTextSearch text" />
    <div class="clear-button" onclick="ClearLabelStyle()">
      <svg width="26" height="24">
        <circle cx="12" cy="12" r="11" fill="#ccc" />
        <path stroke="white" stroke-width="2" d="M8.25,8.25,15.75,15.75" />
        <path stroke="white" stroke-width="2"d="M8.25,15.75,15.75,8.25" />
      </svg>
    </div>
    </div>
    <div class="results-panel"></div>
    </div>`
		const el = Docsify.dom.create('div', html)
		const aside = Docsify.dom.find('aside')

		Docsify.dom.toggleClass(el, 'search')
		Docsify.dom.before(aside, el)
		bindEvents()
	}

}

function bindEvents () {
	const $search = Docsify.dom.find('div.search')
	const $input = Docsify.dom.find($search, 'input')
	const $inputWrap = Docsify.dom.find($search, '.input-wrap')
	let timeId
	Docsify.dom.on($input, 'input', e => {
		clearTimeout(timeId)
		timeId = setTimeout(() => SearchInputOnPage(e.target.value.trim()) /* ListSearcMatches(e.target.value.trim())*/, 400)
	})
	Docsify.dom.on($inputWrap, 'click', e => {
		// Click input outside
		if (e.target.tagName !== 'INPUT') {
			$input.value = ''
			SearchInputOnPage(null)
			// ClearLabelStyle()
		} else if (!$input.value)
			ClearLabelStyle()

	})
}

function ClearLabelStyle () {
	console.log('ClearLabelStyle tetiklendi')
	const labels = document.querySelectorAll('label')
	for (let i = 0; i < labels.length; i++)
		labels[i].style = ''
}

function ClickToSearchResult (e) {
	localStorage.setItem('searcIndex', e.attributes.data.nodeValue)
	if (window.location == e.href) {
		console.log(window.location, e.href)
		ScroolToResult()
	}
}

function SearchInputOnPage (searchKey) {
	// Invoked each time after the data is fully loaded, no arguments,
	if (searchKey) {
		Docsify.dom
			.findAll('.sidebar-nav a:not(.section-link):not([data-nosearch])')
			.forEach(item => {
				promises.push(new Promise(res => {
					const page = item.href
					const url = page.replace(/\/\#\//, '/') + '.md'
					if (url.indexOf('/.md') === -1)
						GetMDFiles(url, page, item.innerText, paths, res)
					 else
						res(true)
				}))
			})
		console.log(paths)

		Promise.all(promises).then(() => {
			const keys = Object.keys(paths)
			// const searchKey = 'pointObj'
			localStorage.setItem('regex', '(.{30}|.)' + searchKey + '(.{30}|.)')
			localStorage.setItem('searchKey', searchKey)
			const re = new RegExp('(.{30}|.)' + searchKey + '(.{30}|.)', 'g')
			const storageData = []
			let found
			for (let i = keys.length; i--;) {
				found = paths[keys[i]].data.match(re)
				if (found)
					storageData.push({
						url: paths[keys[i]].page,
						title: paths[keys[i]].title,
						key: searchKey,
						results: found,
					})

			}
			// if(data.length){
			//    localStorage.setItem('searchData',JSON.stringify(storageData))
			// }
			return storageData
		})
			.then(matches => {
				console.log('isteklerden sonra: ', matches)
				ListSearcMatches(matches)
				ScroolToResult()
			})
	} else
		ListSearcMatches([])


}

function ListSearcMatches (matchs) {
	const $search = Docsify.dom.find('div.search')
	const $panel = Docsify.dom.find($search, '.results-panel')
	const $clearBtn = Docsify.dom.find($search, '.clear-button')
	// const $sidebarNav = Docsify.dom.find('.sidebar-nav')
	// const $appName = Docsify.dom.find('.app-name')
	if (!matchs.length) {
		$panel.classList.remove('show')
		$clearBtn.classList.remove('show')
		$panel.innerHTML = ''
		return
	}
	let html = ''
	console.log(matchs)
	matchs.forEach(post => {
		console.log(post)
		html += `<div class="matching-post">
    <a href="${ post.url }">
    <h2>${ post.title }</h2>
    <!-- <p>${ post.results }</p>  -->
    </a>
    </div>`

		post.results.forEach((res, i) => {
			html += `<div class="matching-post">
      <a href="${ post.url }" onclick="ClickToSearchResult(this)" data="${ i }">
      <!-- <h2>${ post.url }</h2> -->
      <p>${ res }</p>
      </a>
      </div>`
		})

	})

	$panel.classList.add('show')
	$clearBtn.classList.add('show')
	$panel.innerHTML = html || `<p class="empty">${ configs.NO_DATA_TEXT }</p>`
	// if (options.hideOtherSidebarContent) {
	//   $sidebarNav.classList.add('hide');
	//   $appName.classList.add('hide');
	// }
}

function GetMDFiles (url, page, title, obj, res) {
	const http = new XMLHttpRequest()
	http.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			obj[url] = {
				page,
				data: http.responseText,
				title,
			}
			res(true)
		}
	}
	http.open('GET', url)
	http.send()
}

function ScroolToResult () {
	const itemIndex = parseInt(localStorage.getItem('searcIndex'))
	console.log(itemIndex)
	if (itemIndex != null) {
		const main = document.getElementById('main')
		const itemIndexInPage = 0
		let item = null
		for (let i = 0; i < main.children.length; i++) {
			item = FindResultElem(main.children[i], itemIndexInPage, itemIndex)
			if (item)
				break

		}
		console.log('item', item)
		if (item)
			item.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
				inline: 'start',
			})
	}


}

function FindResultElem (item, itemIndexInPage, itemIndex) {
	const searchKey = localStorage.getItem('searchKey')
	if (searchKey) {
		const re = new RegExp(searchKey, 'g')
		const match = item.innerHTML.match(re)
		console.log('match', match)
		if (match) {
			console.log(match, configs.RESULT_COLOR)
			item.innerHTML = item.innerHTML.replace(re, `<label style='background-color:${ configs.RESULT_COLOR }'>${ searchKey }</label>`)
			itemIndexInPage += match.length
			if (itemIndexInPage >= itemIndex) return item
		}
	} else
		console.log('yokkk')

	return null
}

function fullTextSearch (hook, vm) {

	hook.init(() => {
		localStorage.removeItem('searcIndex')
		localStorage.removeItem('searchKey')
		ClearLabelStyle()
	})

	hook.beforeEach(content => {
	})

	hook.afterEach((html, next) => {
		next(html)
	})

	hook.doneEach((x, vm) => {
		CreateSearchComponent()
		ScroolToResult()
	})

	hook.mounted(() => {
	})

	hook.ready(() => {
	})
}
