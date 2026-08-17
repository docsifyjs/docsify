import { escapeHtml } from '../utils';

export const compileMedia = {
  markdown(url) {
    return {
      url,
    };
  },
  mermaid(url) {
    return {
      url,
    };
  },
  iframe(url, title) {
    return {
      html: `<iframe src="${escapeHtml(url)}" ${
        title || 'width=100% height=400'
      }></iframe>`,
    };
  },
  video(url, title) {
    return {
      html: `<video src="${escapeHtml(url)}" ${title || 'controls'}>Not Supported</video>`,
    };
  },
  audio(url, title) {
    return {
      html: `<audio src="${escapeHtml(url)}" ${title || 'controls'}>Not Supported</audio>`,
    };
  },
  code(url, title) {
    let lang = url.match(/\.(\w+)$/);

    lang = title || (lang && lang[1]);
    if (lang === 'md') {
      lang = 'markdown';
    }

    return {
      url,
      lang,
    };
  },
};
