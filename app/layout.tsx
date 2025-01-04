'use client'; // Client component directive

import '../styles/globals.css'; // Ensure global styles are applied
import { UserProvider, useUser } from '../src/contexts/UserContext'; // Import useUser hook and UserProvider
import { AchievementPopup } from '../src/components/AchievementPopup'; // Import AchievementPopup

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
        <title>Next.js App</title>
        <meta name="description" content="This is a Next.js app" />
      </head>
      <body>
        {/* Make sure UserProvider is wrapping the children */}
        <UserProvider>
          <MainContent>{children}</MainContent>
        </UserProvider>
      </body>
    </html>
  );
}

function MainContent({ children }: { children: React.ReactNode }) {
  const { showAchievement, setShowAchievement } = useUser();  // Access the showAchievement state from context

  return (
    <>
      {showAchievement && (
        <AchievementPopup 
          achievement={showAchievement} 
          onClose={() => setShowAchievement(null)}
        />
      )}
      {children}
    </>
  );
}
