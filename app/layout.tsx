// app/layout.tsx
import '../styles/globals.css'; // Ensure global styles are applied
import { UserProvider } from '../src/contexts/UserContext'; // Corrected import path for UserProvider

export const metadata = {
  title: 'Next.js App',
  description: 'This is a Next.js app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <UserProvider> {/* Wrap the children with UserProvider */}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
