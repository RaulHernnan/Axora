import './globals.css';

export const metadata = {
  title: 'Axora - Remesas inteligentes',
  description: 'Envia dinero a Mexico con blockchain, stablecoins y asistente IA',
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}