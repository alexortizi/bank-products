import { test, expect } from '@playwright/test';
import { setupMocks } from './mocks/handlers';

test.describe('Product Form - Create', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/products/new');
  });

  test('should display the registration form', async ({ page }) => {
    await expect(page.locator('.page-title')).toContainText('Formulario de Registro');
  });

  test('should display all form fields', async ({ page }) => {
    await expect(page.locator('#id')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#description')).toBeVisible();
    await expect(page.locator('#logo')).toBeVisible();
    await expect(page.locator('#date_release')).toBeVisible();
    await expect(page.locator('#date_revision')).toBeVisible();
  });

  test('should have submit button disabled when form is invalid', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: 'Enviar' });
    await expect(submitButton).toBeDisabled();
  });

  test('should show validation errors when fields are touched', async ({ page }) => {
    await page.locator('#id').click();
    await page.locator('#name').click();

    await expect(page.locator('text=ID no válido!')).toBeVisible();
  });

  test('should validate ID minimum length', async ({ page }) => {
    await page.locator('#id').fill('ab');
    await page.locator('#name').click();

    await expect(page.locator('text=ID no válido!')).toBeVisible();
  });

  test('should validate ID maximum length', async ({ page }) => {
    await page.locator('#id').fill('12345678901');
    await page.locator('#name').click();

    await expect(page.locator('text=ID no válido!')).toBeVisible();
  });

  test('should validate name minimum length', async ({ page }) => {
    await page.locator('#name').fill('abc');
    await page.locator('#description').click();

    await expect(page.locator('text=Mínimo 5 caracteres')).toBeVisible();
  });

  test('should validate description minimum length', async ({ page }) => {
    await page.locator('#description').fill('short');
    await page.locator('#logo').click();

    await expect(page.locator('text=Mínimo 10 caracteres')).toBeVisible();
  });

  test('should auto-calculate revision date as release date + 1 year', async ({ page }) => {
    await page.locator('#date_release').fill('2025-06-15');

    const revisionValue = await page.locator('#date_revision').inputValue();
    expect(revisionValue).toBe('2026-06-15');
  });

  test('should have revision date field disabled', async ({ page }) => {
    await expect(page.locator('#date_revision')).toBeDisabled();
  });

  test('should reset form when clicking reset button', async ({ page }) => {
    await page.locator('#id').fill('test-id');
    await page.locator('#name').fill('Test Name');

    await page.getByRole('button', { name: 'Reiniciar' }).click();

    await expect(page.locator('#id')).toHaveValue('');
    await expect(page.locator('#name')).toHaveValue('');
  });

  test('should navigate back when clicking back button', async ({ page }) => {
    await page.locator('.back-btn').click();
    await expect(page).toHaveURL(/.*\/products$/);
  });

  test('should enable submit button when form is valid', async ({ page }) => {
    // Fill all required fields with valid data
    await page.locator('#id').fill('new-prod');
    await page.locator('#name').fill('Nuevo Producto');
    await page.locator('#description').fill('Descripción del nuevo producto financiero');
    await page.locator('#logo').fill('https://example.com/logo.png');

    // Set a future date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.locator('#date_release').fill(dateStr);

    // Wait for async validation
    await page.waitForTimeout(500);

    const submitButton = page.getByRole('button', { name: 'Enviar' });
    await expect(submitButton).toBeEnabled();
  });

  test('should show error for existing ID', async ({ page }) => {
    await page.locator('#id').fill('trj-crd-01'); // This ID exists in mocks
    await page.locator('#name').click();

    // Wait for async validation
    await page.waitForTimeout(500);

    await expect(page.locator('text=ID ya existe!')).toBeVisible();
  });
});

test.describe('Product Form - Edit', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
  });

  test('should display edit title when editing', async ({ page }) => {
    await page.goto('/products/edit/trj-crd-01');

    await expect(page.locator('.page-title')).toContainText('Editar Producto');
  });

  test('should load product data in form', async ({ page }) => {
    await page.goto('/products/edit/trj-crd-01');

    // Wait for data to load by checking the name input has a value
    await expect(page.locator('#name')).not.toHaveValue('');

    await expect(page.locator('#id')).toHaveValue('trj-crd-01');
    await expect(page.locator('#name')).toHaveValue('Tarjeta de Crédito Oro');
  });

  test('should have ID field disabled in edit mode', async ({ page }) => {
    await page.goto('/products/edit/trj-crd-01');

    await page.waitForSelector('#id:disabled');
    await expect(page.locator('#id')).toBeDisabled();
  });

  test('should restore original values on reset in edit mode', async ({ page }) => {
    await page.goto('/products/edit/trj-crd-01');

    // Wait for data to load
    await expect(page.locator('#name')).not.toHaveValue('');

    // Change the name
    await page.locator('#name').fill('Changed Name');

    // Click reset
    await page.getByRole('button', { name: 'Reiniciar' }).click();

    // Should restore original value
    await expect(page.locator('#name')).toHaveValue('Tarjeta de Crédito Oro');
  });
});
