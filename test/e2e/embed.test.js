import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test('resolves identical includes relative to each page directory', async ({
  page,
}) => {
  const markdown = '# Example\n\n[snippet](snippet.js ":include :type=code")';

  await docsifyInit({
    markdown: {
      homepage: '# Home',
      sidebar: '- [First](first/)\n- [Second](second/)',
    },
    routes: {
      '/first/README.md': markdown,
      '/second/README.md': markdown,
      '/first/snippet.js': 'const example = "first";',
      '/second/snippet.js': 'const example = "second";',
    },
  });

  const sidebar = page.locator('.sidebar-nav');
  const code = page.locator('#main pre code');

  await sidebar.getByRole('link', { name: 'First', exact: true }).click();
  await expect(code).toHaveText('const example = "first";');
  await sidebar.getByRole('link', { name: 'Second', exact: true }).click();
  await expect(code).toHaveText('const example = "second";');
  await sidebar.getByRole('link', { name: 'First', exact: true }).click();
  await expect(code).toHaveText('const example = "first";');
});
