import './globals.css';
import { Providers } from './components/Providers';
import MobileNav from './components/MobileNav';

export const metadata = {
  title: 'Tieba – La Plateforme Ivoirienne Pro',
  description: 'Achetez et vendez des produits ivoiriens authentiques. Cacao, noix de cajou, pagnes, artisanat, alimentation... La plateforme de référence de Côte d\'Ivoire.',
  keywords: 'plateforme ivoirienne, ecommerce côte d\'ivoire, acheter cacao, pagnes africains, artisanat ivoirien, Tieba',
  openGraph: {
    title: 'Tieba – La Plateforme Pro N°1',
    description: 'La plateforme e-commerce de référence en Côte d\'Ivoire',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <Providers>
          {children}
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
