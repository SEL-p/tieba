import './globals.css';
import { Providers } from './components/Providers';

export const metadata = {
  title: 'Tieba Market – La Marketplace Ivoirienne N°1',
  description: 'Achetez et vendez des produits ivoiriens authentiques. Cacao, noix de cajou, pagnes, artisanat, alimentation... La référence e-commerce de Côte d\'Ivoire.',
  keywords: 'marketplace ivoirienne, ecommerce côte d\'ivoire, acheter cacao, pagnes africains, artisanat ivoirien, Tieba Market',
  openGraph: {
    title: 'Tieba Market – La Marketplace Ivoirienne N°1',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
