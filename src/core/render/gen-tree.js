/**
 * Gen toc tree
 * @link https://github.com/killercup/grock/blob/5280ae63e16c5739e9233d9009bc235ed7d79a50/styles/solarized/assets/js/behavior.coffee#L54-L81
 * @param  {Array} toc List of TOC elements
 * @param  {Number} maxLevel Deep level
 * @return {Array} Headlines
 */
export function genTree(toc, maxLevel) {
  const headlines = [];
  const last = {};

  toc.forEach(headline => {
    const level = headline.depth || 1;
    const len = level - 1;

    if (level > maxLevel) {
      return;
    }

    if (last[len]) {
      last[len].children = [...(last[len].children || []), headline];
    } else {
      headlines.push(headline);
    }

    last[level] = headline;
  });

  return headlines;
}
