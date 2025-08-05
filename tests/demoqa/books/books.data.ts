/**
 * Datos de prueba para la página de Books de DemoQA
 * Contiene información sobre libros, búsquedas y validaciones esperadas
 */

import rawTestData from './books.test-data.json' assert { type: 'json' };

export interface BookData {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  pages?: number;
  description?: string;
}

export interface SearchTestData {
  searchTerm: string;
  expectedResults: number;
  shouldFindBooks: boolean;
}

export interface ValidationData {
  expectedUrl: string | RegExp;
  expectedTitle: string | RegExp;
  expectedElements: string[];
}

export interface SearchScenario {
  term: string;
  expectedBook?: string;
  shouldFindResults: boolean;
  minExpectedResults?: number;
  expectedMessage?: string;
  maxLength?: number;
  description: string;
}

export interface NavigationScenario {
  targetBook: string;
  expectedUrlPatterns: string[];
  fallbackValidation: string;
  description: string;
}

export interface TestScenarios {
  searchScenarios: {
    basicSearch: SearchScenario;
    authorSearch: SearchScenario;
    partialTitleSearch: SearchScenario;
    emptyResultSearch: SearchScenario;
    specialCharacterSearch: SearchScenario;
    longTermSearch: SearchScenario;
  };
  multipleSearchOperations: {
    rapidSearches: string[];
    stateVerificationSearches: string[];
    description: string;
  };
  navigationScenarios: {
    bookClickNavigation: NavigationScenario;
  };
  paginationScenarios: {
    paginationCheck: {
      minBooksForPagination: number;
      paginationSelectors: string[];
      description: string;
    };
  };
  authenticationScenarios: {
    unauthenticatedState: {
      expectedLoginButton: string;
      expectedUserNameField: string;
      description: string;
    };
  };
  dataValidationScenarios: {
    bookDataConsistency: {
      maxBooksToCheck: number;
      requiredFields: string[];
      invalidPatterns: string[];
      description: string;
    };
  };
}

// Importar configuración desde JSON
export const testScenarios: TestScenarios = rawTestData as TestScenarios;

// Libros reales visibles en DemoQA (basado en la captura de pantalla)
export const knownBooks: BookData[] = [
  {
    title: 'Git Pocket Guide',
    author: 'Richard E. Silverman',
    publisher: "O'Reilly Media",
    isbn: '9781449325862',
    pages: 234,
    description: 'A Working Introduction',
  },
  {
    title: 'Learning JavaScript Design Patterns',
    author: 'Addy Osmani',
    publisher: "O'Reilly Media",
    isbn: '9781449331818',
    pages: 254,
    description: "A JavaScript and React Developer's Guide",
  },
  {
    title: 'Designing Evolvable Web APIs with ASP.NET',
    author: 'Glenn Block et al.',
    publisher: "O'Reilly Media",
    isbn: '9781449337711',
    pages: 538,
    description: 'Harnessing the Power of the Web',
  },
  {
    title: 'Speaking JavaScript',
    author: 'Axel Rauschmayer',
    publisher: "O'Reilly Media",
    isbn: '9781449365035',
    pages: 460,
    description: 'An In-Depth Guide for Programmers',
  },
  {
    title: "You Don't Know JS",
    author: 'Kyle Simpson',
    publisher: "O'Reilly Media",
    isbn: '9781491904244',
    pages: 278,
    description: 'ES6 & Beyond',
  },
  {
    title: 'Programming JavaScript Applications',
    author: 'Eric Elliott',
    publisher: "O'Reilly Media",
    isbn: '9781491950296',
    pages: 254,
    description: 'Robust Web Architecture with Node, HTML5, and Modern JS Libraries',
  },
  {
    title: 'Eloquent JavaScript, Second Edition',
    author: 'Marijn Haverbeke',
    publisher: 'No Starch Press',
    isbn: '9781593275846',
    pages: 472,
    description: 'A Modern Introduction to Programming',
  },
  {
    title: 'Understanding ECMAScript 6',
    author: 'Nicholas C. Zakas',
    publisher: 'No Starch Press',
    isbn: '9781593277574',
    pages: 352,
    description: 'The Definitive Guide for JavaScript Developers',
  },
];

// Casos de prueba para búsquedas
export const searchTestCases: SearchTestData[] = [
  {
    searchTerm: 'JavaScript',
    expectedResults: 4, // Aproximado, puede variar
    shouldFindBooks: true,
  },
  {
    searchTerm: 'Git',
    expectedResults: 1,
    shouldFindBooks: true,
  },
  {
    searchTerm: 'Python', // Libro que probablemente no existe
    expectedResults: 0,
    shouldFindBooks: false,
  },
  {
    searchTerm: "O'Reilly",
    expectedResults: 5, // Aproximado por publisher
    shouldFindBooks: true,
  },
  {
    searchTerm: 'NonExistentBook12345',
    expectedResults: 0,
    shouldFindBooks: false,
  },
];

// Datos de validación para la página (basado en la estructura real)
export const pageValidation: ValidationData = {
  expectedUrl: /.*\/books/,
  expectedTitle: /DEMOQA/, // El título real es "DEMOQA"
  expectedElements: [
    '#searchBox', // Campo de búsqueda "Type to search"
    '.ReactTable', // Contenedor principal de la tabla
    '.rt-table', // Tabla de libros
    '.rt-thead', // Header de la tabla
    '.rt-tbody', // Cuerpo de la tabla con libros
  ],
};

// URLs base y endpoints
export const urls = {
  books: '/books',
  bookStore: '/books',
  profile: '/profile',
  login: '/login',
};

// Datos de usuario para pruebas (si es necesario)
export const testUsers = {
  validUser: {
    username: 'testuser',
    password: 'TestPassword123!',
    fullName: 'Test User',
  },
  invalidUser: {
    username: 'invaliduser',
    password: 'wrongpassword',
    fullName: 'Invalid User',
  },
};

// Configuraciones de prueba
export const testConfig = {
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
  },
  retries: {
    search: 3,
    navigation: 2,
    assertion: 1,
  },
  pagination: {
    booksPerPage: 10,
    maxPages: 100,
  },
};

// Tags para categorización de tests
export const testTags = {
  smoke: '@smoke',
  regression: '@regression',
  critical: '@critical',
  search: '@search',
  navigation: '@navigation',
  books: '@books',
};
