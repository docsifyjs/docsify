import * as dom from '../util/dom.js';

let barEl;
let timeId;

/**
 * Init progress component
 */
function init() {
  const div = dom.create('div');

  div.classList.add('progress');
  div.setAttribute('role', 'progressbar');
  div.setAttribute('aria-valuemin', '0');
  div.setAttribute('aria-valuemax', '100');
  div.setAttribute('aria-label', 'Loading...');
  dom.appendTo(dom.body, div);
  barEl = div;
}

/**
 * Render progress bar
 * @param {{step: number, loaded?: undefined, total?: undefined} | {step?: undefined, loaded: number, total: number}} info
 */
export default function (info) {
  const { loaded, total, step } = info;
  let num;

  !barEl && init();

  if (typeof step !== 'undefined') {
    num = parseInt(barEl.style.width || 0, 10) + step;
    num = num > 80 ? 80 : num;
  } else {
    num = Math.floor((loaded / total) * 100);
  }

  barEl.style.opacity = 1;
  barEl.style.width = num >= 95 ? '100%' : num + '%';
  barEl.setAttribute('aria-valuenow', num >= 95 ? 100 : num);

  if (num >= 95) {
    clearTimeout(timeId);

    timeId = setTimeout(_ => {
      barEl.style.opacity = 0;
      barEl.style.width = '0%';
      barEl.removeAttribute('aria-valuenow');
    }, 200);
  }
}
