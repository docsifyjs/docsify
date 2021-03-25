/* eslint-disable no-unused-vars */
import { isMobile } from '../util/env';
import * as dom from '../util/dom';

const title = dom.$.title;
/**
 * Toggle button
 * @param {Element} el Button to be toggled
 * @void
 */
export function btn(el) {
  const toggle = _ => dom.body.classList.toggle('close');

  el = dom.getNode(el);
  if (el === null || el === undefined) {
    return;
  }

  dom.on(el, 'click', e => {
    e.stopPropagation();
    toggle();
  });

  isMobile &&
    dom.on(
      dom.body,
      'click',
      _ => dom.body.classList.contains('close') && toggle()
    );
}

export function collapse(el) {
  el = dom.getNode(el);
  if (el === null || el === undefined) {
    return;
  }

  dom.on(el, 'click', ({ target }) => {
    if (
      target.nodeName === 'A' &&
      target.nextSibling &&
      target.nextSibling.classList &&
      target.nextSibling.classList.contains('app-sub-sidebar')
    ) {
      dom.toggleClass(target.parentNode, 'collapse');
    }
  });
}

export function sticky() {
  const cover = dom.getNode('section.cover');
  if (!cover) {
    return;
  }

  const coverHeight = cover.getBoundingClientRect().height;

  if (window.pageYOffset >= coverHeight || cover.classList.contains('hidden')) {
    dom.toggleClass(dom.body, 'add', 'sticky');
  } else {
    dom.toggleClass(dom.body, 'remove', 'sticky');
  }
}

/**
 * Get and active link
 * @param  {Object} router Router
 * @param  {String|Element} el Target element
 * @param  {Boolean} isParent Active parent
 * @param  {Boolean} autoTitle Automatically set title
 * @return {Element} Active element
 */
export function getAndActive(router, el, isParent, autoTitle) {
  el = dom.getNode(el);
  let links = [];
  if (el !== null && el !== undefined) {
    links = dom.findAll(el, 'a');
  }

  const hash = decodeURI(router.toURL(router.getCurrentPath()));
  let target;

  links
    .sort((a, b) => b.href.length - a.href.length)
    .forEach(a => {
      const href = decodeURI(a.getAttribute('href'));
      const node = isParent ? a.parentNode : a;

      a.title = a.title || a.innerText;

      if (hash.indexOf(href) === 0 && !target) {
        target = a;
        dom.toggleClass(node, 'add', 'active');
      } else {
        dom.toggleClass(node, 'remove', 'active');
      }
    });

  if (autoTitle) {
    dom.$.title = target
      ? target.title || `${target.innerText} - ${title}`
      : title;
  }

  return target;
}
