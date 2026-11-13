import { prerenderEmbed } from '../../src/core/render/embed.js';

test('reuses prerendered tokens across anchors without mixing content directories', () => {
  let currentPath = '/first/?id=one';
  let lexerCalls = 0;
  const compiler = {
    contentBase: '/docs/',
    router: { getCurrentPath: () => currentPath },
    config: {},
    _marked: {
      lexer: () => {
        lexerCalls += 1;
        return Object.assign([], { links: {} });
      },
    },
  };
  const render = target =>
    prerenderEmbed({ compiler: target, raw: '# Example' }, () => {});

  render(compiler);
  currentPath = '/first/?id=two';
  render(compiler);
  currentPath = '/first/page';
  render(compiler);
  expect(lexerCalls).toBe(1);

  currentPath = '/second/';
  render(compiler);
  expect(lexerCalls).toBe(2);

  currentPath = '/first/';
  render(compiler);
  expect(lexerCalls).toBe(2);

  render({ ...compiler, contentBase: '/other/' });
  expect(lexerCalls).toBe(3);
});
