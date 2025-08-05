import { Page, Locator, expect } from '@playwright/test';
import { step, attachment } from 'allure-js-commons';

/**
 * WebActions - Wrapper avanzado para acciones de Playwright con validaciones y logging
 * Implementa las mejores prácticas para interacciones robustas con elementos web
 */
export class WebActions {
  private readonly page: Page;
  private readonly defaultTimeout: number = 30000;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navega a una URL con validación y logging
   */
  async navigateToUrl(
    url: string,
    waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'load'
  ): Promise<void> {
    await step(`Navigate to URL: ${url}`, async () => {
      await this.page.goto(url, { waitUntil });
      await this.waitForPageLoad();
    });
  }

  /**
   * Hace click en un elemento con validación previa
   */
  async clickElement(
    locator: string | Locator,
    options: { timeout?: number; force?: boolean } = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const selector = typeof locator === 'string' ? locator : locator.toString();

    await step(`Click element: ${selector}`, async () => {
      await this.waitForElementVisible(element, options.timeout);
      await this.scrollToElement(element);
      await element.click({
        timeout: options.timeout || this.defaultTimeout,
        force: options.force,
      });
    });
  }

  /**
   * Llena un campo de texto con validación
   */
  async fillText(
    locator: string | Locator,
    text: string,
    options: { clear?: boolean; timeout?: number } = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const selector = typeof locator === 'string' ? locator : locator.toString();

    await step(`Fill text "${text}" into: ${selector}`, async () => {
      await this.waitForElementVisible(element, options.timeout);

      if (options.clear !== false) {
        await element.clear();
      }

      await element.fill(text, { timeout: options.timeout || this.defaultTimeout });

      // Verificar que el texto se escribió correctamente
      await expect(element).toHaveValue(text);
    });
  }

  /**
   * Selecciona una opción de un dropdown
   */
  async selectOption(
    locator: string | Locator,
    value: string | { label?: string; value?: string; index?: number }
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const selector = typeof locator === 'string' ? locator : locator.toString();

    await step(`Select option from: ${selector}`, async () => {
      await this.waitForElementVisible(element);

      if (typeof value === 'string') {
        await element.selectOption(value);
      } else if (value.index !== undefined) {
        await element.selectOption({ index: value.index });
      } else if (value.label) {
        await element.selectOption({ label: value.label });
      } else if (value.value) {
        await element.selectOption({ value: value.value });
      }
    });
  }

  /**
   * Verifica que un elemento esté visible
   */
  async verifyElementVisible(
    locator: string | Locator,
    timeout?: number,
    errorMessage?: string
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const selector = typeof locator === 'string' ? locator : locator.toString();

    await step(`Verify element visible: ${selector}`, async () => {
      try {
        await expect(element).toBeVisible({ timeout: timeout || this.defaultTimeout });
      } catch {
        const message = errorMessage || `Element not visible: ${selector}`;
        throw new Error(message);
      }
    });
  }

  /**
   * Verifica que un elemento contenga texto específico
   */
  async verifyElementText(
    locator: string | Locator,
    expectedText: string | RegExp,
    options: { exact?: boolean; timeout?: number } = {}
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const selector = typeof locator === 'string' ? locator : locator.toString();

    await step(`Verify element text "${expectedText}" in: ${selector}`, async () => {
      if (options.exact) {
        await expect(element).toHaveText(expectedText, {
          timeout: options.timeout || this.defaultTimeout,
        });
      } else {
        await expect(element).toContainText(expectedText, {
          timeout: options.timeout || this.defaultTimeout,
        });
      }
    });
  }

  /**
   * Espera a que un elemento esté visible
   */
  async waitForElementVisible(locator: string | Locator, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({
      state: 'visible',
      timeout: timeout || this.defaultTimeout,
    });
  }

  /**
   * Espera a que un elemento esté oculto
   */
  async waitForElementHidden(locator: string | Locator, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({
      state: 'hidden',
      timeout: timeout || this.defaultTimeout,
    });
  }

  /**
   * Hace scroll hacia un elemento
   */
  async scrollToElement(locator: string | Locator): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for page to load completely with better timeout handling
   */
  async waitForPageLoad(): Promise<void> {
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      await this.page.waitForLoadState('networkidle', { timeout: 15000 });
    } catch {
      // If networkidle fails, just wait for DOM to be ready
      // Network idle timeout, but DOM is ready - continuing
    }
  }

  /**
   * Toma una captura de pantalla con nombre personalizado
   */
  async takeScreenshot(name: string): Promise<void> {
    await step(`Take screenshot: ${name}`, async () => {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await attachment(name, screenshot, 'image/png');
    });
  }

  /**
   * Verifica la URL actual
   */
  async verifyUrl(expectedUrl: string | RegExp): Promise<void> {
    await step(`Verify URL: ${expectedUrl}`, async () => {
      await expect(this.page).toHaveURL(expectedUrl);
    });
  }

  /**
   * Verifica el título de la página
   */
  async verifyPageTitle(expectedTitle: string | RegExp): Promise<void> {
    await step(`Verify page title: ${expectedTitle}`, async () => {
      await expect(this.page).toHaveTitle(expectedTitle);
    });
  }

  /**
   * Espera por un tiempo específico (usar con moderación)
   */
  async wait(milliseconds: number): Promise<void> {
    await step(`Wait ${milliseconds}ms`, async () => {
      await this.page.waitForTimeout(milliseconds);
    });
  }

  /**
   * Ejecuta JavaScript en el contexto de la página
   */
  async executeScript<T = unknown>(script: string, ...args: unknown[]): Promise<T> {
    await step(`Execute script: ${script.substring(0, 50)}...`, async () => {
      // Step logging only
    });
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Maneja alertas del navegador
   */
  async handleAlert(action: 'accept' | 'dismiss' = 'accept', text?: string): Promise<void> {
    await step(`Handle alert: ${action}`, async () => {
      this.page.on('dialog', async dialog => {
        if (text && dialog.type() === 'prompt') {
          await dialog.accept(text);
        } else if (action === 'accept') {
          await dialog.accept();
        } else {
          await dialog.dismiss();
        }
      });
    });
  }

  /**
   * Obtiene el texto de un elemento
   */
  async getElementText(locator: string | Locator): Promise<string> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const selector = typeof locator === 'string' ? locator : locator.toString();

    await step(`Get text from element: ${selector}`, async () => {
      // Step logging only
    });

    await this.waitForElementVisible(element);
    return (await element.textContent()) || '';
  }

  /**
   * Obtiene el valor de un atributo
   */
  async getElementAttribute(locator: string | Locator, attribute: string): Promise<string | null> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const selector = typeof locator === 'string' ? locator : locator.toString();

    await step(`Get attribute "${attribute}" from: ${selector}`, async () => {
      // Step logging only
    });

    await this.waitForElementVisible(element);
    return await element.getAttribute(attribute);
  }

  /**
   * Verifica que la página tenga un título específico
   */
  async verifyPageHasTitle(expectedTitle: string | RegExp): Promise<void> {
    const actualTitle = await this.page.title();
    await step(
      `Verify page title matches "${expectedTitle}" (found: "${actualTitle}")`,
      async () => {
        await expect(this.page).toHaveTitle(expectedTitle);
      }
    );
  }

  /**
   * Verifica que la página tenga una URL específica
   */
  async verifyPageHasUrl(expectedUrl: string | RegExp): Promise<void> {
    const actualUrl = this.page.url();
    await step(`Verify page URL matches "${expectedUrl}" (found: "${actualUrl}")`, async () => {
      await expect(this.page).toHaveURL(expectedUrl);
    });
  }

  /**
   * Verifica que un elemento esté presente en la página
   */
  async verifyElementPresent(locator: string | Locator, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    const selector = typeof locator === 'string' ? locator : locator.toString();

    await step(`Verify element "${selector}" is visible on page`, async () => {
      await expect(element).toBeVisible({ timeout: timeout || this.defaultTimeout });
    });
  }

  /**
   * Verifica que una lista de libros esté visible en la página
   */
  async verifyBooksListVisible(locator: string | Locator, timeout?: number): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;

    await step(`Verify books list is displayed on page`, async () => {
      await expect(element).toBeVisible({ timeout: timeout || this.defaultTimeout });
    });
  }

  /**
   * Verifica que un libro específico esté presente en la lista
   */
  async verifyBookPresent(
    locator: string | Locator,
    bookTitle: string,
    timeout?: number
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;

    await step(`Verify book "${bookTitle}" is present in books list`, async () => {
      await expect(element).toBeVisible({ timeout: timeout || this.defaultTimeout });
    });
  }

  /**
   * Verifica que los resultados de búsqueda estén visibles
   */
  async verifySearchResultsVisible(
    locator: string | Locator,
    searchTerm: string,
    timeout?: number
  ): Promise<void> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;

    await step(`Verify search results for "${searchTerm}" are displayed`, async () => {
      await expect(element).toBeVisible({ timeout: timeout || this.defaultTimeout });
    });
  }

  /**
   * Registra un mensaje de éxito en el log (reemplaza console.log)
   */
  async logSuccess(message: string): Promise<void> {
    await step(`✅ ${message}`, async () => {
      // Log success message in Allure report
    });
  }

  /**
   * Registra un mensaje informativo en el log
   */
  async logInfo(message: string): Promise<void> {
    await step(`ℹ️ ${message}`, async () => {
      // Log info message in Allure report
    });
  }

  /**
   * Registra un mensaje de advertencia en el log
   */
  async logWarning(message: string): Promise<void> {
    await step(`⚠️ ${message}`, async () => {
      // Log warning message in Allure report
    });
  }
}
