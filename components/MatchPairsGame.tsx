import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Flashcard } from '../data/flashcards';

interface MatchPairsGameProps {
  cards: Flashcard[];
  onComplete: (score: number) => void;
}

export function MatchPairsGame({ cards, onComplete }: MatchPairsGameProps) {
  const [gameCards, setGameCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Create pairs of cards (Spanish and English)
    const pairs = cards.slice(0, 6).flatMap((card, index) => [
      { id: index * 2, content: card.spanish, type: 'spanish', pairId: index },
      { id: index * 2 + 1, content: card.english, type: 'english', pairId: index }
    ]);
    
    // Shuffle the cards
    setGameCards(shuffleArray(pairs));
  }, [cards]);

  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = gameCards.find(card => card.id === first);
      const secondCard = gameCards.find(card => card.id === second);

      if (firstCard.pairId === secondCard.pairId) {
        setMatched([...matched, first, second]);
        setScore(score + 1);
        setFlipped([]);

        if (matched.length + 2 === gameCards.length) {
          setTimeout(() => onComplete(score + 1), 1000);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">Match the Pairs</h2>
          <p className="text-sm text-gray-500">Find matching Spanish-English pairs</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {gameCards.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className={`w-full h-24 ${
                  flipped.includes(card.id) || matched.includes(card.id)
                    ? 'bg-blue-50'
                    : ''
                }`}
                onClick={() => handleCardClick(card.id)}
              >
                {(flipped.includes(card.id) || matched.includes(card.id))
                  ? card.content
                  : '?'}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Pairs Found: {matched.length / 2} of {gameCards.length / 2}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}