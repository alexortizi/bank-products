import { Page } from '@playwright/test';

// Mock products matching the Angular app's mock data
export const mockProducts = [
  {
    id: 'trj-crd-01',
    name: 'Tarjeta de Crédito Oro',
    description: 'Tarjeta de crédito con beneficios exclusivos y programa de recompensas',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/Background%20Rosa.png',
    date_release: '2024-01-15',
    date_revision: '2025-01-15'
  },
  {
    id: 'trj-deb-02',
    name: 'Tarjeta de Débito Classic',
    description: 'Tarjeta de débito para uso diario con acceso a cajeros automáticos',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/Background%20Azul.png',
    date_release: '2024-02-20',
    date_revision: '2025-02-20'
  },
  {
    id: 'cta-aho-03',
    name: 'Cuenta de Ahorros Premium',
    description: 'Cuenta de ahorros con tasa de interés preferencial y sin costo de mantenimiento',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/Background%20Verde.png',
    date_release: '2024-03-10',
    date_revision: '2025-03-10'
  },
  {
    id: 'cdt-inv-04',
    name: 'CDT Inversión Segura',
    description: 'Certificado de depósito a término con rentabilidad garantizada',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/Background%20Naranja.png',
    date_release: '2024-04-05',
    date_revision: '2025-04-05'
  },
  {
    id: 'seg-vid-05',
    name: 'Seguro de Vida Familiar',
    description: 'Seguro de vida con cobertura completa para toda la familia',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/Background%20Morado.png',
    date_release: '2024-05-01',
    date_revision: '2025-05-01'
  },
  {
    id: 'crd-emp-06',
    name: 'Crédito Empresarial',
    description: 'Línea de crédito para pequeñas y medianas empresas con tasas competitivas',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/Background%20Rosa.png',
    date_release: '2024-06-15',
    date_revision: '2025-06-15'
  },
  {
    id: 'hip-viv-07',
    name: 'Crédito Hipotecario',
    description: 'Financiamiento para compra de vivienda con plazos flexibles hasta 20 años',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/Background%20Azul.png',
    date_release: '2024-07-20',
    date_revision: '2025-07-20'
  }
];

// No Playwright mocks needed - Angular's mock interceptor handles API calls
// This function is kept for compatibility but does nothing
export async function setupMocks(_page: Page): Promise<void> {
  // The Angular app uses its own mock interceptor (environment.useMocks: true)
  // which intercepts HTTP requests at the Angular HttpClient level.
  // No Playwright route interception is needed.
}
