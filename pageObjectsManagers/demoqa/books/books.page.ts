import { Page } from '@playwright/test';
import { WebActions } from '../../../utils/WebActions.js';
import { booksPageSelectors, BooksPageSelectors } from './books.selectors.js';
import { testConfig } from '../../../config/testConfig.js';

/**
 * Representa la página de Books de DemoQA
 * Proporciona métodos para interactuar con la lista de libros, búsqueda y navegación
 */
export class BooksPage {
  private readonly page: Page;
  private readonly webActions: WebActions;
  readonly selectors: BooksPageSelectors;
  private readonly baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.selectors = booksPageSelectors;
    this.baseUrl = testConfig.environment.baseUrl;
  }

  /**
   * Navega a la página de Books
   */
  async navigateToBooks(): Promise<void> {
    const booksUrl = `${this.baseUrl}/books`;
    await this.webActions.navigateToUrl(booksUrl);
    await this.waitForBooksToLoad();
  }

  /**
   * Verifica que la página de Books está cargada correctamente
   */
  async verifyBooksPageLoaded(): Promise<void> {
    await this.webActions.verifyElementVisible(this.selectors.pageTitle);
    await this.webActions.verifyElementText(this.selectors.pageTitle, 'Book Store');
    await this.webActions.verifyUrl(/.*\/books/);
  }

  /**
   * Verifica que el título de la página sea correcto
   */
  async verifyPageTitle(): Promise<void> {
    await this.webActions.verifyPageHasTitle(/DEMOQA/);
  }

  /**
   * Verifica que la URL sea correcta
   */
  async verifyPageUrl(): Promise<void> {
    await this.webActions.verifyPageHasUrl(/.*\/books/);
  }

  /**
   * Verifica que la caja de búsqueda esté presente
   */
  async verifySearchBoxPresent(): Promise<void> {
    await this.webActions.verifyElementPresent(this.selectors.searchBox);
  }

  /**
   * Verifica que la estructura de la tabla esté presente
   */
  async verifyTableStructurePresent(): Promise<void> {
    await this.webActions.verifyElementPresent(this.selectors.booksContainer);
  }

  /**
   * Registra mensaje de éxito del test
   */
  async logTestSuccess(message: string): Promise<void> {
    await this.webActions.logSuccess(message);
  }

  /**
   * Busca un libro específico
   */
  async searchBook(bookTitle: string): Promise<void> {
    await this.webActions.fillText(this.selectors.searchBox, bookTitle);
    await this.webActions.clickElement(this.selectors.searchButton);
    await this.waitForSearchResults();
  }

  /**
   * Obtiene la lista de libros visibles en la página actual
   */
  async getVisibleBooks(): Promise<Array<{ title: string; author: string; publisher: string }>> {
    await this.waitForBooksToLoad();

    const bookElements = await this.page.locator(this.selectors.bookItem).all();
    const books = [];

    for (const bookElement of bookElements) {
      const titleElement = bookElement.locator(this.selectors.bookTitle);
      const authorElement = bookElement.locator(this.selectors.bookAuthor);
      const publisherElement = bookElement.locator(this.selectors.bookPublisher);

      if (await titleElement.isVisible()) {
        const title = (await titleElement.textContent()) || '';
        const author = (await authorElement.textContent()) || '';
        const publisher = (await publisherElement.textContent()) || '';

        books.push({ title, author, publisher });
      }
    }

    return books;
  }

  /**
   * Hace click en un libro específico por título
   */
  async clickBookByTitle(bookTitle: string): Promise<void> {
    const bookLink = this.page
      .locator(this.selectors.bookLink)
      .filter({ hasText: bookTitle })
      .first();
    await this.webActions.clickElement(bookLink);
  }

  /**
   * Verifica que un libro específico está visible en la lista
   */
  async verifyBookVisible(bookTitle: string): Promise<void> {
    const bookElement = this.page.locator(this.selectors.bookTitle).filter({ hasText: bookTitle });
    await this.webActions.verifyElementVisible(bookElement);
  }

  /**
   * Verifica que no hay libros (mensaje de "No data")
   */
  async verifyNoBooksMessage(): Promise<void> {
    await this.webActions.verifyElementVisible(this.selectors.noDataMessage);
    await this.webActions.verifyElementText(this.selectors.noDataMessage, 'No rows found');
  }

  /**
   * Limpia la búsqueda
   */
  async clearSearch(): Promise<void> {
    await this.webActions.fillText(this.selectors.searchBox, '', { clear: true });
    await this.waitForBooksToLoad();
  }

  /**
   * Navega a la siguiente página de resultados
   */
  async goToNextPage(): Promise<void> {
    const nextButton = this.page.locator(this.selectors.nextButton);
    const isDisabled = await nextButton.getAttribute('disabled');

    if (!isDisabled) {
      await this.webActions.clickElement(nextButton);
      await this.waitForBooksToLoad();
    } else {
      throw new Error('Next button is disabled - already on last page');
    }
  }

  /**
   * Navega a la página anterior de resultados
   */
  async goToPreviousPage(): Promise<void> {
    const previousButton = this.page.locator(this.selectors.previousButton);
    const isDisabled = await previousButton.getAttribute('disabled');

    if (!isDisabled) {
      await this.webActions.clickElement(previousButton);
      await this.waitForBooksToLoad();
    } else {
      throw new Error('Previous button is disabled - already on first page');
    }
  }

  /**
   * Obtiene el número total de libros encontrados
   */
  async getTotalBooksCount(): Promise<number> {
    await this.waitForBooksToLoad();
    const bookElements = await this.page.locator(this.selectors.bookItem).all();

    // Filtrar elementos vacíos
    let count = 0;
    for (const element of bookElements) {
      const titleElement = element.locator(this.selectors.bookTitle);
      if (await titleElement.isVisible()) {
        count++;
      }
    }

    return count;
  }

  /**
   * Hace click en el logo para volver al inicio
   */
  async clickLogo(): Promise<void> {
    await this.webActions.clickElement(this.selectors.logo);
  }

  /**
   * Verifica si el usuario está logueado
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      await this.webActions.verifyElementVisible(this.selectors.userNameValue, 2000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Hace click en el botón de login
   */
  async clickLoginButton(): Promise<void> {
    await this.webActions.clickElement(this.selectors.loginButton);
  }

  /**
   * Obtiene la URL actual de la página
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Espera a que la URL cambie según el patrón especificado
   */
  async waitForUrlChange(urlPattern: RegExp, timeout: number = 10000): Promise<boolean> {
    try {
      await this.page.waitForURL(urlPattern, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifica si un elemento está presente y visible
   */
  async isElementPresent(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene un locator del elemento especificado
   */
  getElementLocator(selector: string) {
    return this.page.locator(selector);
  }

  /**
   * Espera a que los libros se carguen completamente
   */
  private async waitForBooksToLoad(): Promise<void> {
    // Esperar a que desaparezca el spinner de carga si existe
    try {
      await this.webActions.waitForElementHidden(this.selectors.loadingSpinner, 5000);
    } catch {
      // Si no hay spinner, continuar
    }

    // Esperar a que aparezca el contenedor de libros o el mensaje de no data
    try {
      await this.page.waitForSelector('.rt-tbody', { timeout: 5000 });
    } catch {
      await this.page.waitForSelector('.rt-noData', { timeout: 5000 });
    }
  }

  /**
   * Espera a que se muestren los resultados de búsqueda
   */
  private async waitForSearchResults(): Promise<void> {
    // Pequeña pausa para que procese la búsqueda
    await this.webActions.wait(1000);
    await this.waitForBooksToLoad();
  }
}
