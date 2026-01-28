# Bank Products - Sistema de Gestión de Productos Financieros

Aplicación frontend desarrollada en Angular para la gestión de productos financieros de un banco. Permite visualizar, crear, editar y eliminar productos mediante una interfaz intuitiva y responsive.

## Tecnologías Utilizadas

| Tecnología     | Versión | Justificación                                                                                                            |
| -------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Angular**    | 18.2.0  | Última versión LTS con soporte para Signals, mejoras en rendimiento y nueva sintaxis de control de flujo (`@if`, `@for`) |
| **TypeScript** | 5.4.2   | Tipado estático robusto, mejor intellisense y detección temprana de errores                                              |
| **RxJS**       | 7.8.0   | Manejo reactivo de streams de datos y operaciones asíncronas                                                             |
| **Jest**       | 29.7.0  | Framework de testing rápido con mejor DX que Karma/Jasmine                                                               |
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

## Ejecución

### Desarrollo

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

## Funcionalidades

### Listado de Productos

- Visualización de productos en tabla
- Columnas: Logo, Nombre, Descripción, Fecha Liberación, Fecha Revisión
- Tooltips informativos en cabeceras

### Búsqueda de Productos

- Campo de búsqueda en tiempo real
- Filtrado por nombre y descripción
- Resaltado de coincidencias
- Botón para limpiar búsqueda

### Paginación

- Selector de cantidad de registros (5, 10, 20)
- Contador de resultados totales

### Agregar Producto

- Formulario de registro con validaciones
- Validación asíncrona de ID único
- Cálculo automático de fecha de revisión (+1 año)
- Mensajes de error por campo

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

| Script                  | Descripción                    |
| ----------------------- | ------------------------------ |
| `npm start`             | Inicia servidor de desarrollo  |
| `npm run build`         | Compila para producción        |
| `npm test`              | Ejecuta tests unitarios        |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run test:watch`    | Tests en modo observador       |
