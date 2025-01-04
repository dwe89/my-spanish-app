import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Flashcard } from '../data/flashcards';

interface TimeChallengeProps {
  cards: Flashcard[];
  onComplete: (score: number) => void;
}

export function TimeChallenge({ cards, onComplete }: TimeChallengeProps) {
  const GAME_DURATION = 60; // 60 seconds
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentCard, setCurrentCard] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      onComplete(score);
    }
  }, [gameStarted, timeLeft, score, onComplete]);

  useEffect(() => {
    if (gameStarted) {
      generateOptions();
    }
  }, [currentCard, gameStarted]);

  const generateOptions = () => {
    const correctAnswer = cards[currentCard].english;
    const otherCards = cards.filter(card => card.english !== correctAnswer);
    const wrongAnswers = shuffleArray(otherCards)
      .slice(0, 3)
      .map(card => card.english);
    setOptions(shuffleArray([correctAnswer, ...wrongAnswers]));
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (answer: string) => {
    const correct = answer === cards[currentCard].english;
    if (correct) setScore(s => s + 1);
    
    setCurrentCard(c => (c + 1) % cards.length);
  };

  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Time Challenge</h2>
          <p className="mb-6">Translate as many words as you can in 60 seconds!</p>
          <Button onClick={() => setGameStarted(true)}>Start Challenge</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Time Left: {timeLeft}s</span>
            <span>Score: {score}</span>
          </div>
          <Progress value={(timeLeft / GAME_DURATION) * 100} />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-4">{cards[currentCard].spanish}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="w-full h-16"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}