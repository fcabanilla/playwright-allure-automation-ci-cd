import { config } from 'dotenv';

// Cargar variables de entorno
config();

export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  apiUrl: string;
  timeout: number;
  retries: number;
}

export const environments: Record<string, EnvironmentConfig> = {
  dev: {
    name: 'Development',
    baseUrl: 'https://demoqa.com',
    apiUrl: 'https://demoqa.com/api',
    timeout: 30000,
    retries: 1,
  },
  staging: {
    name: 'Staging',
    baseUrl: 'https://staging.demoqa.com',
    apiUrl: 'https://staging.demoqa.com/api',
    timeout: 45000,
    retries: 2,
  },
  prod: {
    name: 'Production',
    baseUrl: 'https://demoqa.com',
    apiUrl: 'https://demoqa.com/api',
    timeout: 60000,
    retries: 3,
  },
};

export const getEnvironment = (): EnvironmentConfig => {
  const env = process.env.ENVIRONMENT || 'dev';
  const environment = environments[env];

  if (!environment) {
    throw new Error(
      `Environment '${env}' not found. Available: ${Object.keys(environments).join(', ')}`
    );
  }

  return environment;
};

export const testConfig = {
  // Configuración base
  environment: getEnvironment(),

  // Configuración de navegador
  headless: process.env.HEADLESS === 'true',
  browser: process.env.BROWSER || 'chromium',

  // Configuración de ejecución
  workers: parseInt(process.env.WORKERS || '1'),
  timeout: parseInt(process.env.TIMEOUT || '30000'),
  retries: parseInt(process.env.RETRIES || '1'),

  // Configuración de reportes
  allureResultsDir: process.env.ALLURE_RESULTS_DIR || 'allure-results',
  allureReportDir: process.env.ALLURE_REPORT_DIR || 'allure-report',

  // Configuración de CI/CD
  isCI: process.env.CI === 'true',
  isAzureDevOps: process.env.AZURE_DEVOPS === 'true',

  // Credenciales de prueba
  testUser: {
    email: process.env.TEST_USER_EMAIL || 'test@example.com',
    password: process.env.TEST_USER_PASSWORD || 'TestPassword123',
  },
};
