// app/page.tsx
'use client';

import SpanishLearningPlatform from './components/SpanishLearningPlatform'; // Correct path to SpanishLearningPlatform
import { UserProvider } from '../src/contexts/UserContext'; // Corrected path to UserContext

export default function Home() {
  return (
    <UserProvider>
      <SpanishLearningPlatform />
    </UserProvider>
  );
}
