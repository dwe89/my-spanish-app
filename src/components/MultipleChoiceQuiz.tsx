import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RefreshCcw, 
  Volume2,
  Trophy,
  Timer,
  Heart
} from 'lucide-react';

// Types for our component props and quiz state
interface FlashCard {
  id: number;
  spanish: string;
  english: string;
  category: string;
  pronunciation: string;
  examples: Array<{ spanish: string; english: string }>;
}

interface QuizProps {
  cards: FlashCard[];
  onComplete: (results: QuizResults) => void;
}

interface QuizResults {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  correctAnswers: number[];
  incorrectAnswers: number[];
}

const MultipleChoiceQuiz: React.FC<QuizProps> = ({ cards, onComplete }) => {
  // Core quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Advanced features state
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number[]>([]);

  const totalQuestions = Math.min(10, cards.length);
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Generate quiz options with improved distribution
  const generateOptions = (correctAnswer: string): string[] => {
    const options = [correctAnswer];
    // Filter cards by same category for more relevant options
    const sameCategory = cards.filter(
      card => card.english !== correctAnswer && 
      card.category === cards[currentQuestion].category
    );
    const otherCards = cards.filter(
      card => card.english !== correctAnswer && 
      card.category !== cards[currentQuestion].category
    );
    
    // Try to get at least one option from same category
    if (sameCategory.length > 0) {
      options.push(sameCategory[Math.floor(Math.random() * sameCategory.length)].english);
    }
    
    // Fill remaining options
    while (options.length < 4 && (sameCategory.length > 0 || otherCards.length > 0)) {
      const pool = options.length < 3 ? [...sameCategory, ...otherCards] : otherCards;
      const randomIndex = Math.floor(Math.random() * pool.length);
      const option = pool[randomIndex].english;
      if (!options.includes(option)) {
        options.push(option);
      }
    }

    return options.sort(() => Math.random() - 0.5);
  };

  const currentOptions = useMemo(() => {
    return generateOptions(cards[currentQuestion].english);
  }, [currentQuestion, cards]);

  // Handle text-to-speech
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (answer: string) => {
    const correct = answer === cards[currentQuestion].english;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setCorrectAnswers([...correctAnswers, cards[currentQuestion].id]);
    } else {
      setLives(lives - 1);
      setStreak(0);
      setIncorrectAnswers([...incorrectAnswers, cards[currentQuestion].id]);
    }

    // Check if quiz should end
    const isLastQuestion = currentQuestion + 1 === totalQuestions;
    const isOutOfLives = lives - 1 === 0;

    setTimeout(() => {
      if (isLastQuestion || isOutOfLives) {
        const results: QuizResults = {
          score,
          totalQuestions: currentQuestion + 1,
          timeSpent,
          correctAnswers,
          incorrectAnswers
        };
        onComplete(results);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setShowFeedback(false);
        setSelectedAnswer(null);
      }
    }, 1500);
  };

  const getStreakBonus = () => {
    if (streak >= 5) return '🔥 x3';
    if (streak >= 3) return '🔥 x2';
    return '';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">Multiple Choice Quiz</h2>
            <Badge variant="outline" className="ml-2">
              {currentQuestion + 1}/{totalQuestions}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Timer className="w-4 h-4 mr-1" />
              <span>{timeSpent}s</span>
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              <span>{lives}</span>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2">
            <h3 className="text-2xl font-bold">{cards[currentQuestion].spanish}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speakText(cards[currentQuestion].spanish)}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-gray-600 italic">{cards[currentQuestion].pronunciation}</p>
          {streak > 2 && (
            <Badge variant="secondary" className="animate-pulse">
              Streak Bonus {getStreakBonus()}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentOptions.map((option, index) => (
            <Button
              key={index}
              variant={showFeedback ? 'outline' : 'default'}
              className={`h-14 text-lg ${
                showFeedback
                  ? option === cards[currentQuestion].english
                    ? 'border-green-500 text-green-700 bg-green-50'
                    : selectedAnswer === option
                    ? 'border-red-500 text-red-700 bg-red-50'
                    : ''
                  : 'hover:translate-y-[-2px] transition-transform'
              }`}
              onClick={() => !showFeedback && handleAnswer(option)}
              disabled={showFeedback}
            >
              {option}
              {showFeedback && option === cards[currentQuestion].english && (
                <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
              )}
              {showFeedback && selectedAnswer === option && !isCorrect && (
                <XCircle className="w-5 h-5 ml-2 text-red-500" />
              )}
            </Button>
          ))}
        </div>

        {showFeedback && (
          <Alert className={isCorrect ? 'bg-green-50' : 'bg-red-50'}>
            <AlertTitle className="flex items-center">
              {isCorrect ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-green-700">¡Correcto! Well done!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-red-700">
                    Not quite! The correct answer is: {cards[currentQuestion].english}
                  </span>
                </>
              )}
            </AlertTitle>
            <AlertDescription>
              {cards[currentQuestion].examples[0]?.spanish && (
                <div className="mt-2 text-sm">
                  <p className="font-medium">Example:</p>
                  <p>{cards[currentQuestion].examples[0].spanish}</p>
                  <p className="text-gray-600">{cards[currentQuestion].examples[0].english}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="text-sm space-x-4">
          <span className="text-gray-600">
            Score: {score}/{currentQuestion + 1}
          </span>
          <span className="text-gray-600">
            Streak: {streak} {streak >= 3 && '🔥'}
          </span>
        </div>
        {currentQuestion + 1 === totalQuestions && !showFeedback && (
          <Button onClick={() => onComplete({
            score,
            totalQuestions,
            timeSpent,
            correctAnswers,
            incorrectAnswers
          })}>
            Finish Quiz
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MultipleChoiceQuiz;