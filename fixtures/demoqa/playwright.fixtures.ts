import { test as base, Page } from '@playwright/test';
import { WebActions } from '../../utils/WebActions.js';
import { BooksPage } from '../../pageObjectsManagers/demoqa/books/books.page.js';
import { BooksAssertions } from '../../tests/demoqa/books/books.assertions.js';
import { BookTestScenarios } from '../../utils/demoqa/books/BookTestScenarios.js';

// Definir tipos para nuestros fixtures personalizados
export type CustomFixtures = {
  webActions: WebActions;
  booksPage: BooksPage;
  booksAssertions: BooksAssertions;
  bookScenarios: BookTestScenarios;
};

/**
 * Extensión del test base de Playwright con fixtures personalizados
 * Implementa el patrón BaseTest mejorado para DemoQA
 */
export const test = base.extend<CustomFixtures>({
  /**
   * Fixture para WebActions - Wrapper de acciones web avanzadas
   */
  webActions: async ({ page }: { page: Page }, use: (webActions: WebActions) => Promise<void>) => {
    const webActions = new WebActions(page);
    await use(webActions);
  },

  /**
   * Fixture para BooksPage - Página principal de Books
   */
  booksPage: async ({ page }: { page: Page }, use: (booksPage: BooksPage) => Promise<void>) => {
    const booksPage = new BooksPage(page);
    await use(booksPage);
  },

  /**
   * Fixture para BooksAssertions - Aserciones especializadas para Books
   */
  /**
   * Fixture para BooksAssertions - Aserciones especializadas para Books
   */
  booksAssertions: async (
    { page, booksPage }: { page: Page; booksPage: BooksPage },
    use: (booksAssertions: BooksAssertions) => Promise<void>
  ) => {
    const booksAssertions = new BooksAssertions(page, booksPage);
    await use(booksAssertions);
  },

  /**
   * Fixture para BookTestScenarios - Escenarios complejos de testing
   */
  bookScenarios: async (
    { booksPage, booksAssertions }: { booksPage: BooksPage; booksAssertions: BooksAssertions },
    use: (bookScenarios: BookTestScenarios) => Promise<void>
  ) => {
    const bookScenarios = new BookTestScenarios(booksPage, booksAssertions);
    await use(bookScenarios);
  },
});

export { expect } from '@playwright/test';
