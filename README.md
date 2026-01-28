# Bank Products - Sistema de Gestión de Productos Financieros

Aplicación frontend desarrollada en Angular para la gestión de productos financieros de un banco. Permite visualizar, crear, editar y eliminar productos mediante una interfaz intuitiva y responsive.

## Tecnologías Utilizadas

| Tecnología     | Versión | Justificación                                                                                                            |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Angular**    | 18.2.0  | Última versión LTS con soporte para Signals, mejoras en rendimiento y nueva sintaxis de control de flujo (`@if`, `@for`) |
| **TypeScript** | 5.4.2   | Tipado estático robusto, mejor intellisense y detección temprana de errores                                              |
| **RxJS**       | 7.8.0   | Manejo reactivo de streams de datos y operaciones asíncronas                                                             |
| **Jest**       | 29.7.0  | Framework de testing rápido con mejor DX que Karma/Jasmine                                                               |
| **Playwright** | 1.58.0  | Framework de testing e2e moderno, rápido y con soporte multi-browser                                                     |
| **SCSS**       | -       | Preprocesador CSS para variables, mixins y estilos modulares                                                             |

### ¿Por qué Angular 18?

- **Signals**: Nueva API reactiva que mejora el rendimiento y simplifica el manejo de estado
- **Standalone Components**: Arquitectura modular sin necesidad de NgModules
- **Nueva sintaxis de control de flujo**: `@if`, `@for`, `@switch` más legibles y con mejor rendimiento
- **Mejoras en SSR y Hydration**: Preparado para renderizado del lado del servidor
- **OnPush por defecto**: Mejor rendimiento con detección de cambios optimizada

### ¿Por qué Jest en lugar de Karma/Jasmine?

- **Velocidad**: Ejecución paralela de tests significativamente más rápida
- **Snapshots**: Capacidad de testing con snapshots
- **Mocking**: Sistema de mocks integrado y más potente
- **Watch mode**: Mejor experiencia de desarrollo con re-ejecución inteligente
- **Coverage**: Reportes de cobertura integrados sin configuración adicional

## Arquitectura del Proyecto

```
src/app/
├── core/                    # Servicios singleton, modelos, interceptors
│   ├── interceptors/        # HTTP interceptors (manejo de errores)
│   ├── models/              # Interfaces y tipos
│   └── services/            # Servicios de datos (ProductService)
│
├── features/                # Módulos de funcionalidades
│   └── products/
│       ├── components/      # Componentes reutilizables del módulo
│       │   ├── confirmation-modal/
│       │   ├── context-menu/
│       │   ├── product-table/
│       │   ├── search-box/
│       │   └── skeleton-loader/
│       ├── pages/           # Páginas/vistas principales
│       │   ├── product-form/
│       │   └── product-list/
│       └── validators/      # Validadores personalizados
│
└── shared/                  # Componentes y utilidades compartidas
    ├── components/
    │   ├── header/
    │   └── toast/
    └── pipes/               # Pipes personalizados
```

### Principios SOLID Aplicados

- **S** - Single Responsibility: Cada componente/servicio tiene una única responsabilidad
- **O** - Open/Closed: Componentes extensibles via `@Input()` y `@Output()`
- **L** - Liskov Substitution: Interfaces consistentes para modelos de datos
- **I** - Interface Segregation: Interfaces específicas y pequeñas
- **D** - Dependency Injection: Servicios inyectados via DI de Angular

## Requisitos Previos

- Node.js 20.x o superior
- npm 10.x o superior

## Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <url-del-repositorio>
   cd bank-products
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar versión de Node (opcional)**

   ```bash
   # Si usas nvm
   nvm use

   # Si usas asdf
   asdf install
   ```

## Configuración del Backend

Esta aplicación requiere un backend REST API que debe estar ejecutándose antes de iniciar el frontend.

### Iniciar el Backend

1. **Navegar al directorio del backend**

   ```bash
   cd /ruta/al/backend
   ```

2. **Instalar dependencias (primera vez)**

   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**

   ```bash
   npm run start:dev
   ```

El backend estará disponible en `http://localhost:3002/bp/products`

### Configuración de Entornos

El proyecto utiliza diferentes archivos de configuración para cada entorno:

- **`environment.ts`**: Producción - Backend real, sin mocks
- **`environment.test.ts`**: Testing - Usa mocks para tests unitarios
- **`environment.development.ts`**: Desarrollo - Backend real, sin mocks

## Ejecución

### Desarrollo

**Importante:** Asegúrate de que el backend esté ejecutándose antes de iniciar el frontend.

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

## Testing

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests con cobertura

```bash
npm run test:coverage
```

### Ejecutar tests en modo watch

```bash
npm run test:watch
```

### Cobertura Actual

```
---------------------|---------|----------|---------|---------|
File                 | % Stmts | % Branch | % Funcs | % Lines |
---------------------|---------|----------|---------|---------|
All files            |      94 |    82.08 |   92.94 |   93.7  |
---------------------|---------|----------|---------|---------|
```

**Cobertura total: 93.7%**

### Tests End-to-End (E2E)

Los tests e2e se ejecutan con Playwright y cubren los flujos principales de la aplicación.

**Importante:** Los tests e2e requieren que tanto el frontend como el backend estén ejecutándose:

```bash
# Terminal 1: Iniciar backend
cd /ruta/al/backend
npm run start:dev

# Terminal 2: Iniciar frontend
cd /ruta/al/frontend
npm start

# Terminal 3: Ejecutar tests e2e
npm run e2e

# Ejecutar con interfaz visual
npm run e2e:ui

# Ejecutar en modo headed (ver navegador)
npm run e2e:headed

# Ver reporte de tests
npm run e2e:report
```

**Cobertura E2E:**
- 40 tests ejecutados
- 100% de tests pasando
- Cobertura de flujos completos: listado, búsqueda, creación, edición y eliminación de productos

## Funcionalidades

### Listado de Productos

- Visualización de productos en tabla
- Columnas: Logo, Nombre, Descripción, Fecha Liberación, Fecha Revisión
- Tooltips informativos en cabeceras
- **Ordenamiento**: Botón para ordenar productos alfabéticamente por nombre
  - Primer clic: Orden ascendente (A-Z)
  - Segundo clic: Orden descendente (Z-A)
  - Tercer clic: Vuelve al orden original

### Búsqueda de Productos

- Campo de búsqueda en tiempo real con debounce
- Filtrado por nombre y descripción
- Resaltado de coincidencias en resultados
- Botón para limpiar búsqueda

### Paginación

- Selector de cantidad de registros (5, 10, 20)
- Contador de resultados totales
- Paginación dinámica basada en resultados filtrados

### Agregar Producto

- Formulario de registro con validaciones
- **Validación asíncrona de ID único**: Verifica en tiempo real si el ID ya existe
  - Botón deshabilitado durante la validación
  - Muestra "Validando ID..." mientras verifica
  - Previene envío con validaciones pendientes
- Cálculo automático de fecha de revisión (+1 año desde fecha de liberación)
- Validación de fecha mínima (debe ser igual o mayor a hoy)
- Mensajes de error específicos por campo y tipo de validación

### Editar Producto

- Menú contextual por producto
- Campo ID deshabilitado en edición
- Mismas validaciones que creación

### Eliminar Producto

- Modal de confirmación
- Notificación de éxito/error via Toast

### Características Adicionales

- **Skeletons**: Estados de carga con animación
- **Responsive Design**: Adaptable a móviles y tablets
- **Rendimiento**: OnPush change detection + Signals
- **Accesibilidad**: Atributos ARIA, roles semánticos

## Scripts Disponibles

| Script                  | Descripción                       |
| ----------------------- | --------------------------------- |
| `npm start`             | Inicia servidor de desarrollo     |
| `npm run build`         | Compila para producción           |
| `npm test`              | Ejecuta tests unitarios           |
| `npm run test:coverage` | Tests con reporte de cobertura    |
| `npm run test:watch`    | Tests en modo observador          |
| `npm run e2e`           | Ejecuta tests e2e con Playwright  |
| `npm run e2e:ui`        | Tests e2e con interfaz visual     |
| `npm run e2e:headed`    | Tests e2e mostrando el navegador  |
| `npm run e2e:report`    | Muestra reporte de tests e2e      |
