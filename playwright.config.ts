import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './config/testConfig.js';

export default defineConfig({
  // Configuración dinámica basada en variables de entorno
  testDir: './tests',
  outputDir: './playwright-test-results',

  // Configuración global de timeouts
  timeout: testConfig.timeout,
  globalTimeout: testConfig.timeout * 10,

  // Configuración de ejecución
  fullyParallel: true,
  workers: testConfig.workers,
  retries: testConfig.retries,

  // Configuración de reportes mejorada
  reporter: testConfig.isCI
    ? [
        ['list'],
        [
          'allure-playwright',
          {
            detail: true,
            outputFolder: testConfig.allureResultsDir,
            suiteTitle: true,
          },
        ],
        [
          'junit',
          {
            outputFile: './test-results/results.xml',
          },
        ],
        [
          'html',
          {
            outputFolder: './playwright-report',
            open: 'never',
          },
        ],
      ]
    : [
        ['list'],
        [
          'allure-playwright',
          {
            detail: true,
            outputFolder: testConfig.allureResultsDir,
            suiteTitle: true,
          },
        ],
        [
          'html',
          {
            outputFolder: './playwright-report',
            open: 'on-failure',
          },
        ],
      ],

  // Configuración global de navegador
  use: {
    // URL base dinámica
    baseURL: testConfig.environment.baseUrl,

    // Configuración de navegador
    headless: testConfig.headless,

    // Configuración de timeouts específicos
    actionTimeout: 15000,
    navigationTimeout: 30000,

    // Configuración de captura
    screenshot: 'only-on-failure',
    video: testConfig.isCI ? 'retain-on-failure' : 'on-first-retry',
    trace: testConfig.isCI ? 'retain-on-failure' : 'on-first-retry',

    // Configuración específica para DemoQA
    locale: 'en-US',
    timezoneId: 'America/New_York',

    // Headers personalizados
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  // Configuración de proyectos multi-browser
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Configuraciones específicas para Chrome
        launchOptions: {
          args: [
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ],
        },
      },
    },
  ],

  // Configuración de servidor web local (si es necesario)
  // webServer: testConfig.isCI ? undefined : {
  //   command: 'echo "No local server required for DemoQA"',
  //   port: 3000,
  //   reuseExistingServer: !testConfig.isCI,
  // },

  // Configuración específica para CI/CD
  forbidOnly: testConfig.isCI,

  // Configuración de metadatos
  metadata: {
    environment: testConfig.environment.name,
    browser: testConfig.browser,
    baseUrl: testConfig.environment.baseUrl,
    timestamp: new Date().toISOString(),
  },
});
