# Utilizar la imagen oficial de Playwright con Node.js
FROM mcr.microsoft.com/playwright:v1.50.0-jammy

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY playwright.config.ts ./
COPY .env ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Instalar solo el navegador necesario
RUN npx playwright install chromium

# Establecer variable de entorno para CI
ENV CI=true

# Comando por defecto
CMD ["npm", "run", "test:books"]
