import './globals.css';
import SplinePreloader from '@/components/SplinePreloader';

export const metadata = {
  title: 'MediDost AI — Your Medical Reports, Explained Simply',
  description:
    'MediDost AI turns complex clinical jargon into clear, compassionate language in your mother tongue. Privacy-first, multilingual, AI-powered medical report simplifier.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SplinePreloader>
          {children}
        </SplinePreloader>
      </body>
    </html>
  );
}
