import { test, expect } from '@playwright/test';
import { setupMocks } from './mocks/handlers';

test.describe('Product Actions - Context Menu', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.product-table tbody tr.product-row');
  });

  test('should display context menu button for each product', async ({ page }) => {
    const menuButtons = page.locator('.context-menu__trigger');
    const count = await menuButtons.count();

    expect(count).toBeGreaterThan(0);
    await expect(menuButtons.first()).toBeVisible();
  });

  test('should open context menu dropdown on click', async ({ page }) => {
    await page.locator('.context-menu__trigger').first().click();
    await expect(page.locator('.context-menu__dropdown').first()).toBeVisible();
  });

  test('should show edit and delete options in dropdown', async ({ page }) => {
    await page.locator('.context-menu__trigger').first().click();

    await expect(page.getByText('Editar').first()).toBeVisible();
    await expect(page.getByText('Eliminar').first()).toBeVisible();
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    await page.locator('.context-menu__trigger').first().click();
    await expect(page.locator('.context-menu__dropdown').first()).toBeVisible();

    // Click outside
    await page.locator('.page-title, .product-list__header').first().click();

    await expect(page.locator('.context-menu__dropdown')).not.toBeVisible();
  });

  test('should navigate to edit page when clicking edit', async ({ page }) => {
    await page.locator('.context-menu__trigger').first().click();
    await page.getByText('Editar').first().click();

    await expect(page).toHaveURL(/.*\/products\/edit\/.+/);
    await expect(page.locator('.page-title')).toContainText('Editar Producto');
  });
});

test.describe('Product Actions - Delete Modal', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('.product-table tbody tr.product-row');
  });

  test('should open delete confirmation modal', async ({ page }) => {
    await page.locator('.context-menu__trigger').first().click();
    await page.getByText('Eliminar').first().click();

    await expect(page.locator('.modal')).toBeVisible();
  });

  test('should display product name in confirmation message', async ({ page }) => {
    await page.locator('.context-menu__trigger').first().click();
    await page.getByText('Eliminar').first().click();

    await expect(page.locator('.modal__message')).toContainText('¿Estás seguro de eliminar');
    await expect(page.locator('.modal__message')).toContainText('Tarjeta de Crédito Oro');
  });

  test('should display cancel and confirm buttons', async ({ page }) => {
    await page.locator('.context-menu__trigger').first().click();
    await page.getByText('Eliminar').first().click();

    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Confirmar' })).toBeVisible();
  });

  test('should close modal when clicking cancel', async ({ page }) => {
    await page.locator('.context-menu__trigger').first().click();
    await page.getByText('Eliminar').first().click();

    await page.getByRole('button', { name: 'Cancelar' }).click();

    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('should close modal when clicking backdrop', async ({ page }) => {
    await page.locator('.context-menu__trigger').first().click();
    await page.getByText('Eliminar').first().click();

    // Click on backdrop (outside the modal content)
    await page.locator('.modal-backdrop').click({ position: { x: 10, y: 10 } });

    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('should delete product and show success toast', async ({ page }) => {
    await page.locator('.context-menu__trigger').first().click();
    await page.getByText('Eliminar').first().click();

    await page.getByRole('button', { name: 'Confirmar' }).click();

    // Should show success toast
    await expect(page.locator('.toast--success')).toBeVisible();
    await expect(page.locator('.toast__message')).toContainText('eliminado exitosamente');
  });
});
