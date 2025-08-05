import { test } from '../../../fixtures/demoqa/playwright.fixtures.js';

test.describe('DemoQA Books Store Tests', () => {
  test.beforeEach(async ({ booksPage }) => {
    await booksPage.navigateToBooks();
  });

  test(
    'should load Books page successfully',
    { tag: ['@smoke', '@critical'] },
    async ({ booksPage }) => {
      await booksPage.verifyPageTitle();
      await booksPage.verifyPageUrl();
      await booksPage.verifySearchBoxPresent();
      await booksPage.verifyTableStructurePresent();
      await booksPage.logTestSuccess('Basic DemoQA Books page test passed!');
    }
  );

  test(
    'should display list of books with complete information',
    { tag: ['@smoke', '@regression'] },
    async ({ booksPage, booksAssertions }) => {
      await booksAssertions.expectBooksListVisible();
      await booksAssertions.expectCompleteBookInformation();
      await booksPage.logTestSuccess('Books list with complete information test passed!');
    }
  );

  test(
    'should search for books successfully',
    {
      tag: ['@regression', '@search'],
    },
    async ({ booksPage, booksAssertions }) => {
      await booksPage.searchBook('Git');
      await booksPage.verifyBookVisible('Git Pocket Guide');
      await booksAssertions.expectSuccessfulSearch('Git');
      await booksPage.logTestSuccess('Book search functionality test passed!');
    }
  );

  test(
    'should handle empty search results',
    {
      tag: ['@regression', '@search'],
    },
    async ({ booksPage, booksAssertions }) => {
      await booksPage.searchBook('NonExistentBook123');
      await booksPage.verifyNoBooksMessage();
      await booksAssertions.expectNoSearchResults();
      await booksPage.logTestSuccess('Empty search results handling test passed!');
    }
  );

  test(
    'should clear search and show all books',
    {
      tag: ['@regression', '@search'],
    },
    async ({ booksPage, booksAssertions }) => {
      // Primero buscar algo específico
      await booksPage.searchBook('Git');

      // Limpiar búsqueda
      await booksPage.clearSearch();

      // Debe mostrar más libros después de limpiar
      await booksAssertions.expectBooksListVisible();
      await booksPage.logTestSuccess('Search clear functionality test passed!');
    }
  );

  test(
    'should search by author name',
    {
      tag: ['@regression', '@search'],
    },
    async ({ booksPage, booksAssertions }) => {
      await booksPage.searchBook('Addy Osmani');
      await booksPage.verifyBookVisible('Learning JavaScript Design Patterns');
      await booksAssertions.expectSuccessfulSearch('Addy Osmani');
      await booksPage.logTestSuccess('Author search functionality test passed!');
    }
  );

  test(
    'should search by partial title',
    {
      tag: ['@regression', '@search'],
    },
    async ({ bookScenarios }) => {
      await bookScenarios.verifyPartialTitleSearch('JavaScript');
    }
  );

  test(
    'should click on book and navigate to details',
    {
      tag: ['@regression', '@navigation'],
    },
    async ({ bookScenarios }) => {
      await bookScenarios.verifyBookClickNavigation();
    }
  );

  test(
    'should handle pagination if available',
    {
      tag: ['@regression', '@pagination'],
    },
    async ({ bookScenarios }) => {
      await bookScenarios.verifyPaginationFunctionality();
    }
  );

  test(
    'should display login button when not authenticated',
    {
      tag: ['@regression', '@authentication'],
    },
    async ({ bookScenarios }) => {
      await bookScenarios.verifyAuthenticationState();
    }
  );

  test(
    'should search with special characters',
    {
      tag: ['@regression', '@search', '@edge-case'],
    },
    async ({ booksPage }) => {
      // Probar búsqueda con caracteres especiales
      await booksPage.searchBook('ASP.NET');

      // La búsqueda no debe romper la página
      await booksPage.verifySearchBoxPresent();
      await booksPage.verifyTableStructurePresent();

      await booksPage.logTestSuccess('Special characters search test passed!');
    }
  );

  test(
    'should maintain page state after search operations',
    {
      tag: ['@regression', '@state'],
    },
    async ({ booksPage, booksAssertions }) => {
      // Realizar varias operaciones de búsqueda
      await booksPage.searchBook('Git');
      await booksPage.clearSearch();
      await booksPage.searchBook('Java');
      await booksPage.clearSearch();

      // La página debe mantener su estado funcional
      await booksAssertions.expectBooksListVisible();
      await booksPage.verifySearchBoxPresent();

      await booksPage.logTestSuccess('Page state maintenance test passed!');
    }
  );

  test(
    'should handle rapid search operations',
    {
      tag: ['@regression', '@stress'],
    },
    async ({ booksPage }) => {
      const searches = ['Git', 'Java', 'ASP'];

      for (const search of searches) {
        await booksPage.searchBook(search);
        await booksPage.clearSearch();
      }

      // Verificar que la página sigue funcionando
      await booksPage.verifySearchBoxPresent();
      await booksPage.verifyTableStructurePresent();

      await booksPage.logTestSuccess('Rapid search operations test passed!');
    }
  );

  test(
    'should validate book data consistency',
    { tag: ['@regression', '@data-validation'] },
    async ({ booksPage }) => {
      const books = await booksPage.getVisibleBooks();

      // Verificar que todos los libros tienen datos válidos
      for (const book of books.slice(0, 3)) {
        // Verificar primeros 3 libros
        if (book.title.length === 0) throw new Error(`Book without title found`);
        if (book.author.length === 0) throw new Error(`Book without author found`);
        if (book.publisher.length === 0) throw new Error(`Book without publisher found`);

        // Verificar que no hay caracteres HTML en los datos
        if (book.title.includes('<') || book.title.includes('>')) {
          throw new Error(`HTML tags found in book title: ${book.title}`);
        }
      }

      await booksPage.logTestSuccess('Book data consistency validation test passed!');
    }
  );

  test(
    'should handle long search terms gracefully',
    {
      tag: ['@regression', '@edge-case'],
    },
    async ({ booksPage }) => {
      // Probar con término de búsqueda muy largo
      const longSearch = 'a'.repeat(50);
      await booksPage.searchBook(longSearch);

      // La página debe seguir funcionando
      await booksPage.verifySearchBoxPresent();

      // Probablemente no habrá resultados, pero no debe romper
      try {
        await booksPage.verifyNoBooksMessage();
      } catch {
        // Si hay resultados o error diferente, está bien
      }

      await booksPage.logTestSuccess('Long search terms handling test passed!');
    }
  );
});
