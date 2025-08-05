# 🎭 Playwright Allure Automation CI/CD

Un framework robusto de automatización de pruebas web usando **Playwright** con
reportes **Allure** y optimización de rendimiento avanzada.

## 🚀 Características Principales

- **Playwright 1.47+** con TypeScript
- **Allure Reports** para reportes visuales
- **Page Object Model** mejorado con WebActions
- **6 workers paralelos** optimizados (40.8s ejecución)
- **ESLint + Prettier** para calidad de código
- **Docker** y **CI/CD** con Azure Pipelines

## 📦 Instalación

```bash
# Clonar e instalar
git clone <repo-url>
cd playwright-allure-automation-ci-cd
npm install
npx playwright install

# Ejecutar pruebas
npm run test
```

## 🎮 Scripts Principales

```bash
npm run test              # Ejecutar todas las pruebas
npm run test:books        # Solo pruebas Books (6 workers)
npm run test:smoke        # Pruebas críticas
npm run test:debug        # Modo debug
npm run report            # Generar y abrir reporte Allure
npm run format            # Formatear código
```

## 🏗️ Arquitectura

```text
📦 Estructura del Proyecto
├── tests/demoqa/books/         # Casos de prueba
├── pageObjectsManagers/        # Page Object Models
├── fixtures/                   # Fixtures personalizados
├── utils/                      # WebActions y utilidades
├── config/                     # Configuraciones
└── allure-results/             # Resultados de pruebas
```

## 🎯 Optimizaciones de Performance

| Workers | Tiempo | Éxito | Estado        |
| ------- | ------ | ----- | ------------- |
| 6       | 40.8s  | 100%  | ✅ Óptimo     |
| 8       | 42.1s  | 85%   | ⚠️ Contención |
| 10      | 45.3s  | 70%   | ❌ Sobrecarga |

## 🐳 Docker

```bash
# Construir y ejecutar
docker build -t playwright-demoqa .
docker-compose up --build

# Solo pruebas
docker-compose run tests
```

## 📊 Reportes

- **Allure Report**: `npm run report`
- **Playwright HTML**: Automático tras ejecución
- **Resumen personalizado**: `npm run view:results`

## �️ Desarrollo

### Crear nuevas pruebas

1. **Page Object**: `pageObjectsManagers/domain/feature/`
2. **Selectors**: `feature.selectors.ts`
3. **Assertions**: `tests/domain/feature.assertions.ts`
4. **Test Spec**: `tests/domain/feature.spec.ts`

### Calidad de código

```bash
npm run lint          # ESLint
npm run prettier      # Formateo
npm run format        # Ambos
```

## � CI/CD

- **Azure Pipelines** configurado
- **4 workers** en CI para estabilidad
- **Reportes Allure** publicados automáticamente
- **Retry automático** en fallos temporales

## 📄 Licencia

MIT - Ver [LICENSE](LICENSE) para detalles.

---

## Desarrollado con ❤️ para automatización web moderna
