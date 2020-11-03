import * as dom from '../util/dom';

let barEl;
let timeId;

/**
 * Init progress component
 */
function init() {
  const div = dom.create('div');

  div.classList.add('progress');
  dom.appendTo(dom.body, div);
  barEl = div;
}

/**
 * Render progress bar
 */
export default function ({ loaded, total, step }) {
  let num;

  !barEl && init();

  if (step) {
    num = parseInt(barEl.style.width || 0, 10) + step;
    num = num > 80 ? 80 : num;
  } else {
    num = Math.floor((loaded / total) * 100);
  }

  barEl.style.opacity = 1;
  barEl.style.width = num >= 95 ? '100%' : num + '%';

  if (num >= 95) {
    clearTimeout(timeId);
    // eslint-disable-next-line no-unused-vars
    timeId = setTimeout(_ => {
      barEl.style.opacity = 0;
      barEl.style.width = '0%';
    }, 200);
  }
}
