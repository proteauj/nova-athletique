import './globals.css';
import { Sofia_Sans_Extra_Condensed } from 'next/font/google';
import Header from '@/components/Header';
import HeaderResponsiveStyles from '@/components/HeaderResponsiveStyles';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/lib/auth/AuthContext';

const sofia = Sofia_Sans_Extra_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
});

export const metadata = {
  title: 'Nova Athlétique',
  description: 'Site vitrine et réservation Nova Athlétique'
};
import '@/app/globals.css';
import '@/styles/theme.css';
import StripeProvider from '@/components/StripeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <StripeProvider>
          {children}
        </StripeProvider>
      </body>
    </html>
  );
}