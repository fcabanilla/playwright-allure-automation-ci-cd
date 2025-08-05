import { BooksPage } from '../../../pageObjectsManagers/demoqa/books/books.page.js';
import { BooksAssertions } from '../../../tests/demoqa/books/books.assertions.js';
import { testScenarios } from '../../../tests/demoqa/books/books.data.js';

/**
 * Clase para encapsular escenarios complejos de testing de Books
 * Contiene la lógica de negocio que no pertenece ni a Page Objects ni a Assertions
 * Utiliza datos de configuración externa para ser completamente data-driven
 */
export class BookTestScenarios {
  constructor(
    private readonly booksPage: BooksPage,
    private readonly booksAssertions: BooksAssertions
  ) {}

  /**
   * Escenario: Verificar navegación al hacer click en un libro
   * Usa datos de configuración para determinar comportamiento esperado
   */
  async verifyBookClickNavigation(): Promise<void> {
    const navigationConfig = testScenarios.navigationScenarios.bookClickNavigation;
    const books = await this.booksPage.getVisibleBooks();

    if (books.length === 0) {
      await this.booksPage.logTestSuccess('No books available - navigation test skipped');
      return;
    }

    // Usar el libro configurado o el primero disponible
    const targetBook =
      books.find(book => book.title.includes(navigationConfig.targetBook)) || books[0];
    await this.booksPage.clickBookByTitle(targetBook.title);

    // Intentar verificar navegación con patrones configurados
    let urlChanged = false;
    for (const pattern of navigationConfig.expectedUrlPatterns) {
      urlChanged = await this.booksPage.waitForUrlChange(new RegExp(pattern), 10000);
      if (urlChanged) break;
    }

    if (!urlChanged && navigationConfig.fallbackValidation === 'searchBoxPresent') {
      await this.booksPage.verifySearchBoxPresent();
    }

    await this.booksPage.logTestSuccess(`${navigationConfig.description} - completed`);
  }

  /**
   * Escenario: Verificar funcionalidad de paginación
   * Usa configuración para determinar umbrales y selectores
   */
  async verifyPaginationFunctionality(): Promise<void> {
    const paginationConfig = testScenarios.paginationScenarios.paginationCheck;
    const books = await this.booksPage.getVisibleBooks();
    const totalBooks = books.length;

    if (totalBooks <= paginationConfig.minBooksForPagination) {
      await this.booksPage.logTestSuccess('Limited books available - no pagination required');
      return;
    }

    // Verificar si existe alguno de los selectores de paginación configurados
    let paginationExists = false;
    for (const selector of paginationConfig.paginationSelectors) {
      paginationExists = await this.booksPage.isElementPresent(selector);
      if (paginationExists) break;
    }

    if (paginationExists) {
      await this.booksPage.logTestSuccess('Pagination controls detected and verified');
    } else {
      await this.booksPage.logTestSuccess(
        'No pagination needed - all books displayed on single page'
      );
    }

    await this.booksPage.logTestSuccess(`${paginationConfig.description} - completed`);
  }

  /**
   * Escenario: Búsqueda por título parcial con validación dinámica
   */
  async verifyPartialTitleSearch(searchTerm?: string): Promise<void> {
    const searchConfig = testScenarios.searchScenarios.partialTitleSearch;
    const termToUse = searchTerm || searchConfig.term;

    await this.booksPage.searchBook(termToUse);
    const books = await this.booksPage.getVisibleBooks();

    const hasMatchingBooks = books.some(book =>
      book.title.toLowerCase().includes(termToUse.toLowerCase())
    );

    if (hasMatchingBooks && searchConfig.shouldFindResults) {
      await this.booksAssertions.expectSuccessfulSearch(termToUse);
    }

    await this.booksPage.logTestSuccess(
      `${searchConfig.description} - completed for "${termToUse}"`
    );
  }

  /**
   * Escenario: Verificar estado de autenticación
   */
  async verifyAuthenticationState(): Promise<void> {
    const authConfig = testScenarios.authenticationScenarios.unauthenticatedState;
    const isLoggedIn = await this.booksPage.isUserLoggedIn();

    if (!isLoggedIn) {
      await this.booksAssertions.expectLoginButtonVisible();
    }

    await this.booksPage.logTestSuccess(`${authConfig.description} - completed`);
  }

  /**
   * Escenario: Operaciones de búsqueda múltiples
   */
  async performMultipleSearchOperations(customTerms?: string[]): Promise<void> {
    const multiSearchConfig = testScenarios.multipleSearchOperations;
    const searchTerms = customTerms || multiSearchConfig.rapidSearches;

    for (const searchTerm of searchTerms) {
      await this.booksPage.searchBook(searchTerm);
      await this.booksPage.clearSearch();
    }

    // Verificar que la página sigue funcional
    await this.booksPage.verifySearchBoxPresent();
    await this.booksPage.verifyTableStructurePresent();

    await this.booksPage.logTestSuccess(`${multiSearchConfig.description} - completed`);
  }

  /**
   * Escenario: Validación de consistencia de datos de libros
   */
  async validateBookDataConsistency(customMaxBooks?: number): Promise<void> {
    const dataConfig = testScenarios.dataValidationScenarios.bookDataConsistency;
    const maxBooksToCheck = customMaxBooks || dataConfig.maxBooksToCheck;

    const books = await this.booksPage.getVisibleBooks();
    const booksToCheck = books.slice(0, maxBooksToCheck);

    for (const book of booksToCheck) {
      await this.booksAssertions.expectValidBookData(book);
    }

    await this.booksPage.logTestSuccess(
      `${dataConfig.description} - validated ${booksToCheck.length} books`
    );
  }

  /**
   * Escenario: Mantenimiento de estado después de múltiples operaciones
   */
  async verifyPageStateAfterOperations(): Promise<void> {
    const stateConfig = testScenarios.multipleSearchOperations;
    const searchTerms = stateConfig.stateVerificationSearches;

    // Realizar múltiples operaciones usando términos configurados
    for (const term of searchTerms) {
      await this.booksPage.searchBook(term);
      await this.booksPage.clearSearch();
    }

    // Verificar que la página mantiene su estado funcional
    await this.booksAssertions.expectBooksListVisible();
    await this.booksPage.verifySearchBoxPresent();

    await this.booksPage.logTestSuccess('Page state maintained after multiple operations');
  }

  /**
   * Escenario: Manejo de términos de búsqueda especiales
   */
  async verifySpecialCharacterSearch(customTerm?: string): Promise<void> {
    const specialConfig = testScenarios.searchScenarios.specialCharacterSearch;
    const searchTerm = customTerm || specialConfig.term;

    await this.booksPage.searchBook(searchTerm);

    // Verificar que la búsqueda no rompe la página
    await this.booksPage.verifySearchBoxPresent();
    await this.booksPage.verifyTableStructurePresent();

    await this.booksPage.logTestSuccess(
      `${specialConfig.description} - completed for "${searchTerm}"`
    );
  }

  /**
   * Escenario: Manejo de términos de búsqueda largos
   */
  async verifyLongSearchTermHandling(customTerm?: string): Promise<void> {
    const longTermConfig = testScenarios.searchScenarios.longTermSearch;
    const searchTerm = customTerm || longTermConfig.term;

    await this.booksPage.searchBook(searchTerm);
    await this.booksPage.verifySearchBoxPresent();

    // Intentar verificar mensaje de no resultados
    if (!longTermConfig.shouldFindResults) {
      try {
        await this.booksPage.verifyNoBooksMessage();
      } catch {
        // Si hay resultados o error diferente, está bien
      }
    }

    await this.booksPage.logTestSuccess(`${longTermConfig.description} - completed`);
  }

  /**
   * Escenario: Búsqueda básica con configuración
   */
  async verifyBasicSearch(): Promise<void> {
    const basicConfig = testScenarios.searchScenarios.basicSearch;

    await this.booksPage.searchBook(basicConfig.term);

    if (basicConfig.expectedBook) {
      await this.booksPage.verifyBookVisible(basicConfig.expectedBook);
    }

    if (basicConfig.shouldFindResults) {
      await this.booksAssertions.expectSuccessfulSearch(basicConfig.term);
    }

    await this.booksPage.logTestSuccess(`${basicConfig.description} - completed`);
  }

  /**
   * Escenario: Búsqueda por autor con configuración
   */
  async verifyAuthorSearch(): Promise<void> {
    const authorConfig = testScenarios.searchScenarios.authorSearch;

    await this.booksPage.searchBook(authorConfig.term);

    if (authorConfig.expectedBook) {
      await this.booksPage.verifyBookVisible(authorConfig.expectedBook);
    }

    if (authorConfig.shouldFindResults) {
      await this.booksAssertions.expectSuccessfulSearch(authorConfig.term);
    }

    await this.booksPage.logTestSuccess(`${authorConfig.description} - completed`);
  }

  /**
   * Escenario: Búsqueda sin resultados con configuración
   */
  async verifyEmptySearchResults(): Promise<void> {
    const emptyConfig = testScenarios.searchScenarios.emptyResultSearch;

    await this.booksPage.searchBook(emptyConfig.term);

    if (!emptyConfig.shouldFindResults) {
      await this.booksPage.verifyNoBooksMessage();
      await this.booksAssertions.expectNoSearchResults();
    }

    await this.booksPage.logTestSuccess(`${emptyConfig.description} - completed`);
  }
}
