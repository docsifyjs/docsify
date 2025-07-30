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
      html: `<iframe src="${url}" ${
        title || 'width=100% height=400'
      }></iframe>`,
    };
  },
  video(url, title) {
    return {
      html: `<video src="${url}" ${title || 'controls'}>Not Support</video>`,
    };
  },
  audio(url, title) {
    return {
      html: `<audio src="${url}" ${title || 'controls'}>Not Support</audio>`,
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
