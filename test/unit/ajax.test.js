import _mock from 'xhr-mock';
import { get } from '../../src/core/util/ajax.js';

const mock = _mock.default;

describe('ajax/get', () => {
  beforeEach(() => mock.setup());
  afterEach(() => mock.teardown());

  test('preserves response status when serving cached content', async () => {
    const url = '/cached-response-status.md';
    mock.get(url, { status: 200, body: '# Cached page' });

    const first = await new Promise(resolve => {
      get(url).then((content, opt, response) => {
        resolve({ content, opt, response });
      });
    });
    const cached = await new Promise(resolve => {
      get(url).then((content, opt, response) => {
        resolve({ content, opt, response });
      });
    });

    expect(first.response).toEqual(
      expect.objectContaining({ ok: true, status: 200 }),
    );
    expect(cached).toEqual(first);
  });
});
