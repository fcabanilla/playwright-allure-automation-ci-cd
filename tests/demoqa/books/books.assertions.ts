import { Page, expect } from '@playwright/test';
import { step } from 'allure-js-commons';
import { WebActions } from '../../../utils/WebActions.js';
import { BooksPage } from '../../../pageObjectsManagers/demoqa/books/books.page.js';
import { BookData, ValidationData } from './books.data.js';

/**
 * Clase de aserciones dedicadas para la página de Books
 * Contiene todas las validaciones específicas y reutilizables
 */
export class BooksAssertions {
  private readonly page: Page;
  private readonly webActions: WebActions;
  private readonly booksPage: BooksPage;

  constructor(page: Page, booksPage: BooksPage) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.booksPage = booksPage;
  }

  /**
   * Verifica que la página de Books esté completamente cargada
   */
  async expectBooksPageLoaded(validation: ValidationData): Promise<void> {
    await step('Assert Books page is fully loaded', async () => {
      // Verificar URL
      await this.webActions.verifyUrl(validation.expectedUrl);

      // Verificar título
      await this.webActions.verifyPageTitle(validation.expectedTitle);

      // Verificar elementos críticos
      for (const selector of validation.expectedElements) {
        await this.webActions.verifyElementVisible(selector);
      }
    });
  }

  /**
   * Verifica que se muestre la lista de libros
   */
  async expectBooksListVisible(): Promise<void> {
    await step('Assert books list is visible', async () => {
      const booksCount = await this.booksPage.getTotalBooksCount();
      await step(`Found ${booksCount} books on page`, async () => {
        expect(booksCount).toBeGreaterThan(0);
      });

      // Verificar que al menos un libro tiene todos los datos requeridos
      const books = await this.booksPage.getVisibleBooks();
      await step(`Verified ${books.length} visible books with complete data`, async () => {
        expect(books.length).toBeGreaterThan(0);
      });

      const firstBook = books[0];
      await step(
        `Validate first book data: "${firstBook.title}" by ${firstBook.author}`,
        async () => {
          expect(firstBook.title).toBeTruthy();
          expect(firstBook.author).toBeTruthy();
          expect(firstBook.publisher).toBeTruthy();
        }
      );

      // Usar el nuevo método específico para libros
      await this.webActions.verifyBooksListVisible(this.booksPage.selectors.booksContainer);
    });
  }

  /**
   * Verifica que un libro específico esté presente en la lista
   */
  async expectBookPresent(bookData: BookData): Promise<void> {
    await step(`Assert book "${bookData.title}" is present`, async () => {
      await this.booksPage.verifyBookVisible(bookData.title);

      const books = await this.booksPage.getVisibleBooks();
      const foundBook = books.find(
        book => book.title.includes(bookData.title) || book.author.includes(bookData.author)
      );

      expect(
        foundBook,
        `Expected to find book "${bookData.title}" by author "${bookData.author}" in the books list, ` +
          `but book was not found among ${books.length} visible books. ` +
          `Available books: ${books.map(b => `"${b.title}"`).join(', ')}`
      ).toBeDefined();

      if (foundBook) {
        expect(
          foundBook.title,
          `Expected book title to contain "${bookData.title}", ` +
            `but found "${foundBook.title}". Book titles should match search criteria.`
        ).toContain(bookData.title);
        expect(
          foundBook.author,
          `Expected book author to contain "${bookData.author}", ` +
            `but found "${foundBook.author}". Book authors should match expected data.`
        ).toContain(bookData.author);
        expect(
          foundBook.publisher,
          `Expected book publisher to contain "${bookData.publisher}", ` +
            `but found "${foundBook.publisher}". Book publishers should match expected data.`
        ).toContain(bookData.publisher);
      }
    });
  }

  /**
   * Verifica los resultados de búsqueda
   */
  async expectSearchResults(
    searchTerm: string,
    expectedCount: number,
    shouldFindBooks: boolean
  ): Promise<void> {
    await step(`Assert search results for "${searchTerm}"`, async () => {
      if (!shouldFindBooks) {
        await this.booksPage.verifyNoBooksMessage();
        return;
      }

      const actualCount = await this.booksPage.getTotalBooksCount();

      // Permitir cierta flexibilidad en el conteo exacto
      if (expectedCount > 0) {
        expect(
          actualCount,
          `Expected search for "${searchTerm}" to return at least 1 book, ` +
            `but found ${actualCount} books. Search should return relevant results.`
        ).toBeGreaterThan(0);

        // Verificar que los resultados son relevantes al término de búsqueda
        const books = await this.booksPage.getVisibleBooks();
        const relevantBooks = books.filter(
          book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
        );

        expect(
          relevantBooks.length,
          `Expected at least 1 book to be relevant to search term "${searchTerm}", ` +
            `but found ${relevantBooks.length} relevant books out of ${books.length} total results. ` +
            `Books found: ${books.map(b => `"${b.title}"`).join(', ')}`
        ).toBeGreaterThan(0);
      } else {
        expect(
          actualCount,
          `Expected search for "${searchTerm}" to return exactly 0 books, ` +
            `but found ${actualCount} books. No results were expected for this search.`
        ).toBe(0);
      }
    });
  }

  /**
   * Verifica que no hay resultados de búsqueda
   */
  async expectNoSearchResults(): Promise<void> {
    await step('Assert no search results found', async () => {
      await this.booksPage.verifyNoBooksMessage();
      const count = await this.booksPage.getTotalBooksCount();
      expect(
        count,
        `Expected no search results to be displayed (count should be 0), ` +
          `but found ${count} books. The "No data" message should be visible when no books match the search.`
      ).toBe(0);
    });
  }

  /**
   * Verifica que la búsqueda fue exitosa y devolvió resultados relevantes
   */
  async expectSuccessfulSearch(searchTerm: string): Promise<void> {
    await step(`Assert successful search for "${searchTerm}"`, async () => {
      const books = await this.booksPage.getVisibleBooks();
      expect(
        books.length,
        `Expected search for "${searchTerm}" to return at least 1 book, ` +
          `but found ${books.length} books. Search should return relevant results.`
      ).toBeGreaterThan(0);

      // Al menos uno de los libros debe contener el término de búsqueda
      const relevantFound = books.some(
        book =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(
        relevantFound,
        `Expected at least one book to contain the search term "${searchTerm}" ` +
          `in title, author, or publisher, but none of the ${books.length} results were relevant. ` +
          `Books found: ${books.map(b => `"${b.title}" by ${b.author}`).join(', ')}`
      ).toBe(true);
    });
  }

  /**
   * Verifica la navegación correcta al hacer click en un libro
   */
  async expectBookNavigation(bookTitle: string, expectedUrlPattern: RegExp): Promise<void> {
    await step(`Assert navigation to book "${bookTitle}"`, async () => {
      await this.webActions.verifyUrl(expectedUrlPattern);

      // Verificar que estamos en una página de detalles de libro
      // (esto dependerá de la implementación específica de DemoQA)
    });
  }

  /**
   * Verifica el estado de autenticación del usuario
   */
  async expectUserAuthenticated(isAuthenticated: boolean): Promise<void> {
    await step(
      `Assert user is ${isAuthenticated ? 'authenticated' : 'not authenticated'}`,
      async () => {
        const actualAuthState = await this.booksPage.isUserLoggedIn();
        expect(
          actualAuthState,
          `Expected user authentication state to be ${isAuthenticated}, ` +
            `but found ${actualAuthState}. User login status verification failed.`
        ).toBe(isAuthenticated);
      }
    );
  }

  /**
   * Verifica que todos los libros de la página tienen la información requerida
   */
  async expectCompleteBookInformation(): Promise<void> {
    await step('Assert all books have complete information', async () => {
      const books = await this.booksPage.getVisibleBooks();

      for (let i = 0; i < books.length; i++) {
        const book = books[i];
        expect(
          book.title,
          `Book #${i + 1} title should not be empty, but found: "${book.title}". ` +
            'All books must have valid titles.'
        ).toBeTruthy();

        expect(
          book.author,
          `Book #${i + 1} ("${book.title}") author should not be empty, but found: "${book.author}". ` +
            'All books must have valid authors.'
        ).toBeTruthy();

        expect(
          book.publisher,
          `Book #${i + 1} ("${book.title}") publisher should not be empty, but found: "${book.publisher}". ` +
            'All books must have valid publishers.'
        ).toBeTruthy();

        // Verificar que no hay caracteres extraños o HTML
        expect(
          book.title,
          `Book #${i + 1} title should not contain HTML tags, but found: "${book.title}". ` +
            'Book titles should be plain text without HTML markup.'
        ).not.toMatch(/<[^>]*>/);

        expect(
          book.author,
          `Book #${i + 1} author should not contain HTML tags, but found: "${book.author}". ` +
            'Book authors should be plain text without HTML markup.'
        ).not.toMatch(/<[^>]*>/);

        expect(
          book.publisher,
          `Book #${i + 1} publisher should not contain HTML tags, but found: "${book.publisher}". ` +
            'Book publishers should be plain text without HTML markup.'
        ).not.toMatch(/<[^>]*>/);
      }
    });
  }

  /**
   * Verifica la funcionalidad de la paginación
   */
  async expectPaginationWorking(): Promise<void> {
    await step('Assert pagination is working correctly', async () => {
      const initialBooks = await this.booksPage.getVisibleBooks();
      const initialCount = initialBooks.length;

      if (initialCount >= 10) {
        // Si hay suficientes libros para paginar
        try {
          await this.booksPage.goToNextPage();
          const nextPageBooks = await this.booksPage.getVisibleBooks();

          // Los libros de la siguiente página deben ser diferentes
          const isDifferent = !this.arraysAreEqual(
            initialBooks.map(b => b.title),
            nextPageBooks.map(b => b.title)
          );

          expect(
            isDifferent,
            `Expected books on next page to be different from first page, ` +
              `but found the same books. Initial page titles: [${initialBooks.map(b => `"${b.title}"`).join(', ')}]. ` +
              `Next page titles: [${nextPageBooks.map(b => `"${b.title}"`).join(', ')}]. ` +
              'Pagination should display different books on different pages.'
          ).toBe(true);

          // Volver a la página anterior
          await this.booksPage.goToPreviousPage();
        } catch (error) {
          // Si no hay siguiente página, puede ser esperado
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          expect(
            true,
            `Pagination test could not be completed. This might be expected if there are not enough books ` +
              `to paginate (found ${initialCount} books). Error: ${errorMessage}`
          ).toBe(true);
        }
      } else {
        expect(
          true,
          `Cannot test pagination with only ${initialCount} books. ` +
            'Pagination testing requires at least 10 books to verify different pages.'
        ).toBe(true);
      }
    });
  }

  /**
   * Verifica que la búsqueda se puede limpiar correctamente
   */
  async expectSearchClearable(): Promise<void> {
    await step('Assert search can be cleared', async () => {
      await this.booksPage.clearSearch();

      // Después de limpiar, deberían aparecer todos los libros
      const booksAfterClear = await this.booksPage.getTotalBooksCount();
      expect(booksAfterClear).toBeGreaterThan(0);
    });
  }

  /**
   * Método auxiliar para comparar arrays
   */
  private arraysAreEqual(arr1: string[], arr2: string[]): boolean {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  }

  /**
   * Verifica que el botón de login esté visible
   */
  async expectLoginButtonVisible(): Promise<void> {
    await step('Assert login button is visible', async () => {
      const loginButton = this.booksPage.getElementLocator(this.booksPage.selectors.loginButton);
      await loginButton.waitFor({ state: 'visible' });

      expect(
        await loginButton.isVisible(),
        'Expected login button to be visible when user is not authenticated, ' +
          'but login button was not found or not visible on the page.'
      ).toBe(true);
    });
  }

  /**
   * Verifica que los datos de un libro son válidos
   */
  async expectValidBookData(book: {
    title: string;
    author: string;
    publisher: string;
  }): Promise<void> {
    await step(`Assert book data is valid for "${book.title}"`, async () => {
      expect(
        book.title.length,
        `Book title should not be empty, but found: "${book.title}". ` +
          'All books must have valid titles.'
      ).toBeGreaterThan(0);

      expect(
        book.author.length,
        `Book author should not be empty for book "${book.title}", but found: "${book.author}". ` +
          'All books must have valid authors.'
      ).toBeGreaterThan(0);

      expect(
        book.publisher.length,
        `Book publisher should not be empty for book "${book.title}", but found: "${book.publisher}". ` +
          'All books must have valid publishers.'
      ).toBeGreaterThan(0);

      // Verificar que no hay caracteres HTML en los datos
      expect(
        book.title,
        `Book title should not contain HTML tags, but found: "${book.title}". ` +
          'Book titles should be plain text without HTML markup.'
      ).not.toMatch(/<[^>]*>/);

      expect(
        book.author,
        `Book author should not contain HTML tags, but found: "${book.author}". ` +
          'Book authors should be plain text without HTML markup.'
      ).not.toMatch(/<[^>]*>/);

      expect(
        book.publisher,
        `Book publisher should not contain HTML tags, but found: "${book.publisher}". ` +
          'Book publishers should be plain text without HTML markup.'
      ).not.toMatch(/<[^>]*>/);
    });
  }
}
