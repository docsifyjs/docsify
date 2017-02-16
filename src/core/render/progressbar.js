import { isPrimitive } from '../util/core'

let loadingEl
let timeId

/**
 * Init progress component
 */
function init () {
  if (loadingEl) return
  const div = document.createElement('div')

  div.classList.add('progress')
  document.body.appendChild(div)
  loadingEl = div
}
/**
 * Render progress bar
 */
export default function ({ loaded, total, step }) {
  let num

  loadingEl = init()

  if (!isPrimitive(step)) {
    step = Math.floor(Math.random() * 5 + 1)
  }
  if (step) {
    num = parseInt(loadingEl.style.width, 10) + step
    num = num > 80 ? 80 : num
  } else {
    num = Math.floor(loaded / total * 100)
  }

  loadingEl.style.opacity = 1
  loadingEl.style.width = num >= 95 ? '100%' : num + '%'

  if (num >= 95) {
    clearTimeout(timeId)
    timeId = setTimeout(_ => {
      loadingEl.style.opacity = 0
      loadingEl.style.width = '0%'
    }, 200)
  }
}
