export interface Example {
  spanish: string;
  english: string;
}

export interface Flashcard {
  id: number;
  spanish: string;
  english: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';  // Ensuring difficulty is one of these values
  pronunciation: string;
  level: number;
  streak: number;
  examples: Example[];
  commonMistakes?: string[];
  nextReview: Date;
  lastReviewed?: Date;
}

// Expanded flashcard database
export const flashcardsDB: Flashcard[] = [
  {
    id: 1,
    spanish: "el ordenador",
    english: "computer",
    category: "technology",
    difficulty: "easy" as 'easy', // Type assertion to ensure difficulty is treated as the correct union type
    pronunciation: "el or-den-ah-DOR",
    level: 0,
    streak: 0,
    examples: [
      { spanish: "Uso el ordenador para trabajar", english: "I use the computer to work" },
      { spanish: "El ordenador está roto", english: "The computer is broken" }
    ],
    commonMistakes: ["ordenadura", "computadora (Latin America)"],
    nextReview: new Date()
  },
  {
    id: 2,
    spanish: "la casa",
    english: "house",
    category: "basic",
    difficulty: "easy" as 'easy', // Type assertion to ensure difficulty is treated as the correct union type
    pronunciation: "la KAH-sah",
    level: 0,
    streak: 0,
    examples: [
      { spanish: "Mi casa es grande", english: "My house is big" },
      { spanish: "La casa está cerca", english: "The house is nearby" }
    ],
    nextReview: new Date()
  },
  // Add more flashcards here...
].map(card => ({ ...card, nextReview: new Date() }));

// Helper functions for spaced repetition
export const calculateNextReview = (card: Flashcard, wasCorrect: boolean): Date => {
  const now = new Date();
  const days = wasCorrect ? Math.pow(2, card.level) : 1;
  const nextReview = new Date(now.setDate(now.getDate() + days));
  return nextReview;
};

export const isCardDueForReview = (card: Flashcard): boolean => {
  return new Date() >= new Date(card.nextReview);
};
