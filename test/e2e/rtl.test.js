import docsifyInit from '../helpers/docsify-init.js';
import { test, expect } from './fixtures/docsify-init-fixture.js';

test.describe('RTL Mode', () => {
  test('should render in RTL mode when rtl:true is set', async ({ page }) => {
    // Initialize docsify with RTL configuration
    await docsifyInit({
      config: {
        rtl: true,
        // Add a sidebar to ensure it's rendered and we can test its position
        loadSidebar: true, 
      },
      markdown: {
        homepage: '# Test RTL Page',
        sidebar: `
* [Home](/)
* [Page2](/page2)
        `,
      },
      // _logHTML: true, // Uncomment for debugging if needed
    });

    // Check if body has 'rtl' class
    await expect(page.locator('body')).toHaveClass(/rtl/);

    // Check sidebar visibility and position
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    // Check computed style for sidebar position
    // This is generally more robust than bounding box calculations if CSS is clear
    await expect(sidebar).toHaveCSS('right', '0px');

    // Optional: Bounding box check (can be more fragile due to scrollbars, etc.)
    // const sidebarBoundingBox = await sidebar.boundingBox();
    // const viewportWidth = page.viewportSize().width;
    // expect(sidebarBoundingBox.x + sidebarBoundingBox.width).toBeCloseTo(viewportWidth, 2); // Allow 2px tolerance
    
    // Check content area position (to ensure it's not overlapping with the right-aligned sidebar)
    const content = page.locator('.content');
    await expect(content).toBeVisible();
    // The CSS for .content in RTL is `margin-right: 300px;`
    // We can check if its left side is not at 0, or its right margin is indeed 300px
    await expect(content).toHaveCSS('margin-right', '300px'); 
  });
});
