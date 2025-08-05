/**
 * Selectores para la página de Books de DemoQA
 * Incluye todos los elementos principales de la interfaz
 */
export interface BooksPageSelectors {
  // Elementos de navegación
  logo: string;
  homeLink: string;

  // Sección principal
  mainBanner: string;
  pageTitle: string;

  // Barra de búsqueda
  searchBox: string;
  searchButton: string;

  // Lista de libros
  booksContainer: string;
  bookItem: string;
  bookTitle: string;
  bookAuthor: string;
  bookPublisher: string;
  bookImage: string;

  // Detalles del libro
  bookLink: string;

  // Elementos de usuario
  loginButton: string;
  userNameValue: string;

  // Paginación
  paginationContainer: string;
  nextButton: string;
  previousButton: string;
  pageNumbers: string;

  // Filtros y ordenamiento
  sortDropdown: string;

  // Elementos de carga
  loadingSpinner: string;

  // Mensajes
  noDataMessage: string;
}

export const booksPageSelectors: BooksPageSelectors = {
  // Elementos de navegación
  logo: '.header-wrapper .header-left img',
  homeLink: '.header-wrapper .header-left a',

  // Sección principal
  mainBanner: '.main-banner',
  pageTitle: '.main-header',

  // Barra de búsqueda
  searchBox: '#searchBox',
  searchButton: '#basic-addon2',

  // Lista de libros - Basado en la estructura real de DemoQA
  booksContainer: '.ReactTable',
  bookItem: '.rt-tr-group',
  bookTitle: '.rt-td:nth-child(2) span a',
  bookAuthor: '.rt-td:nth-child(3)',
  bookPublisher: '.rt-td:nth-child(4)',
  bookImage: '.rt-td:nth-child(1) img',

  // Detalles del libro
  bookLink: '.rt-td:nth-child(2) span a',

  // Elementos de usuario
  loginButton: '#login',
  userNameValue: '#userName-value',

  // Paginación
  paginationContainer: '.pagination-bottom',
  nextButton: '.-next button',
  previousButton: '.-previous button',
  pageNumbers: '.-pageJump input',

  // Filtros y ordenamiento
  sortDropdown: '.rt-th .rt-resizable-header-content',

  // Elementos de carga
  loadingSpinner: '.rt-loading',

  // Mensajes
  noDataMessage: '.rt-noData',
};
