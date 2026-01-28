import { test, expect } from '@playwright/test';
import { setupMocks, mockProducts } from './mocks/handlers';

test.describe('Product List', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
  });

  test('should display the header with logo', async ({ page }) => {
    await expect(page.locator('.logo-text')).toHaveText('BANCO');
  });

  test('should display the product table', async ({ page }) => {
    await expect(page.locator('.product-table')).toBeVisible();
  });

  test('should display products from API', async ({ page }) => {
    // Wait for products to load
    await page.waitForSelector('.product-table tbody tr.product-row');

    const rows = page.locator('.product-table tbody tr.product-row');
    const count = await rows.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should display search box', async ({ page }) => {
    await expect(page.locator('input[placeholder="Buscar..."]')).toBeVisible();
  });

  test('should display add product button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Agregar' })).toBeVisible();
  });

  test('should filter products when searching', async ({ page }) => {
    await page.waitForSelector('.product-table tbody tr.product-row');

    const searchInput = page.locator('input[placeholder="Buscar..."]');
    await searchInput.fill('Tarjeta');

    // Wait for filtering
    await page.waitForTimeout(300);

    const resultsText = await page.locator('.results-count').textContent();
    // Should find 2 products: "Tarjeta de Crédito Oro" and "Tarjeta de Débito Classic"
    expect(resultsText).toContain('2 Resultados');
  });

  test('should show no results when search has no matches', async ({ page }) => {
    await page.waitForSelector('.product-table tbody tr.product-row');

    const searchInput = page.locator('input[placeholder="Buscar..."]');
    await searchInput.fill('xyz-no-existe');

    await page.waitForTimeout(300);

    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('should clear search when clicking X button', async ({ page }) => {
    await page.waitForSelector('.product-table tbody tr.product-row');

    const searchInput = page.locator('input[placeholder="Buscar..."]');
    await searchInput.fill('test');

    const clearButton = page.locator('.clear-btn');
    await clearButton.click();

    await expect(searchInput).toHaveValue('');
  });

  test('should change page size', async ({ page }) => {
    const select = page.locator('.page-size-select');
    await select.selectOption('10');
    await expect(select).toHaveValue('10');
  });

  test('should navigate to add product form', async ({ page }) => {
    await page.getByRole('button', { name: 'Agregar' }).click();
    await expect(page).toHaveURL(/.*\/products\/new/);
    await expect(page.locator('.page-title')).toContainText('Formulario de Registro');
  });

  test('should display correct number of results', async ({ page }) => {
    await page.waitForSelector('.product-table tbody tr.product-row');

    const resultsText = await page.locator('.results-count').textContent();
    expect(resultsText).toContain(`${mockProducts.length} Resultados`);
  });
});
