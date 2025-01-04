import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Mic, CheckCircle, XCircle } from 'lucide-react';
import { Flashcard } from '../data/flashcards';

interface ListeningSpeakingQuizProps {
  cards: Flashcard[];
  onComplete: (score: number) => void;
}

export function ListeningSpeakingQuiz({ cards, onComplete }: ListeningSpeakingQuizProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const correct = transcript === cards[currentCard].spanish.toLowerCase();
      setFeedback(correct ? 'correct' : 'incorrect');
      if (correct) setScore(s => s + 1);
      
      setTimeout(() => {
        if (currentCard < cards.length - 1) {
          setCurrentCard(c => c + 1);
          setFeedback(null);
        } else {
          onComplete(score);
        }
      }, 1500);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-2">
            Question {currentCard + 1} of {cards.length}
          </p>
          <h2 className="text-2xl font-bold mb-4">{cards[currentCard].english}</h2>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => speakText(cards[currentCard].spanish)}
            >
              <Volume2 className="w-6 h-6 mr-2" />
              Listen to Pronunciation
            </Button>

            <Button
              variant={isListening ? "destructive" : "default"}
              size="lg"
              className="w-full"
              onClick={startListening}
              disabled={isListening}
            >
              <Mic className="w-6 h-6 mr-2" />
              {isListening ? 'Listening...' : 'Speak Now'}
            </Button>
          </div>

          {feedback && (
            <div className={`mt-4 flex items-center justify-center ${
              feedback === 'correct' ? 'text-green-500' : 'text-red-500'
            }`}>
              {feedback === 'correct' ? (
                <CheckCircle className="w-6 h-6 mr-2" />
              ) : (
                <XCircle className="w-6 h-6 mr-2" />
              )}
              {feedback === 'correct' ? 'Correct!' : 
                `Incorrect. The correct pronunciation is: ${cards[currentCard].spanish}`}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Score: {score}/{cards.length}</p>
        </div>
      </CardContent>
    </Card>
  );
}