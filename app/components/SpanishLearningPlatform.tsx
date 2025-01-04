'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import MultipleChoiceQuiz from '../../src/components/MultipleChoiceQuiz';
import {
  Trophy, Star, Zap, Calendar, Book, Users, CheckCircle, XCircle,
  Brain, Volume2, ChevronLeft, ChevronRight, Sparkles, Flag
} from 'lucide-react';

const flashcardsDB = [
  { 
    id: 1, 
    spanish: "el ordenador", 
    english: "computer", 
    category: "technology",
    difficulty: "easy",
    pronunciation: "el or-den-ah-DOR",
    level: 0,
    streak: 0,
    examples: [
      { spanish: "Uso el ordenador para trabajar", english: "I use the computer to work" }
    ],
    commonMistakes: ["ordenadura", "computadora (Latin America)"]
  },
  { 
    id: 2, 
    spanish: "la casa", 
    english: "house", 
    category: "basic",
    difficulty: "easy",
    pronunciation: "la KAH-sah",
    level: 0,
    streak: 0,
    examples: [
      { spanish: "Mi casa es grande", english: "My house is big" }
    ]
  }
].map(card => ({ ...card, nextReview: new Date() }));

export default function SpanishLearningPlatform() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizOptions, setQuizOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [practiceMode, setPracticeMode] = useState('flashcards');
  const [selectedPracticeMode, setSelectedPracticeMode] = useState(null);
  
  const [userStats, setUserStats] = useState({
    streak: 7,
    level: 3,
    xp: 750,
    nextLevel: 1000,
    dailyGoal: 80,
    totalCardsLearned: 245,
    weakestCategories: ['verbs', 'adjectives'],
    strongestCategories: ['nouns', 'basic phrases']
  });

  const [achievements, setAchievements] = useState([
    { id: 1, name: '7 Day Streak', icon: <Calendar className="w-4 h-4" />, achieved: true },
    { id: 2, name: 'Vocabulary Master', icon: <Book className="w-4 h-4" />, achieved: false },
    { id: 3, name: 'Quiz Champion', icon: <Trophy className="w-4 h-4" />, achieved: true },
    { id: 4, name: 'Perfect Pronunciation', icon: <Volume2 className="w-4 h-4" />, achieved: false }
  ]);

  const handleNextCard = () => {
    setCurrentFlashcard((prev) => (prev + 1) % flashcardsDB.length);
    setShowAnswer(false);
    setIsCorrect(null);
  };

  const handleAnswer = (correct) => {
    setIsCorrect(correct);
    setUserStats(prev => ({
      ...prev,
      xp: prev.xp + (correct ? 10 : 2),
      dailyGoal: Math.min(100, prev.dailyGoal + (correct ? 5 : 1))
    }));
    setTimeout(handleNextCard, 1000);
  };

  const renderPractice = () => {
    if (selectedPracticeMode === 'multiple-choice') {
      return (
        <MultipleChoiceQuiz 
          cards={flashcardsDB} 
          onComplete={(results) => {
            setSelectedPracticeMode(null);
            setUserStats(prev => ({
              ...prev,
              xp: prev.xp + (results.score * 10) + Math.floor(results.timeSpent / 60) * 5,
              totalCardsLearned: prev.totalCardsLearned + results.correctAnswers.length,
              dailyGoal: Math.min(100, prev.dailyGoal + (results.score * 5))
            }));
            if (results.score === results.totalQuestions) {
              setAchievements(prev => 
                prev.map(achievement => 
                  achievement.name === 'Quiz Champion' 
                    ? { ...achievement, achieved: true }
                    : achievement
                )
              );
            }
          }} 
        />
      );
    }
    return (
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Practice Modes</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button 
            className="h-24 flex flex-col items-center justify-center space-y-2"
            onClick={() => setSelectedPracticeMode('multiple-choice')}
          >
            <Brain className="w-6 h-6" />
            <span>Multiple Choice</span>
          </Button>
          <Button 
            className="h-24 flex flex-col items-center justify-center space-y-2"
            disabled
          >
            <Volume2 className="w-6 h-6" />
            <span>Listen & Speak</span>
          </Button>
          <Button 
            className="h-24 flex flex-col items-center justify-center space-y-2"
            disabled
          >
            <Users className="w-6 h-6" />
            <span>Match Pairs</span>
          </Button>
          <Button 
            className="h-24 flex flex-col items-center justify-center space-y-2"
            disabled
          >
            <Zap className="w-6 h-6" />
            <span>Time Challenge</span>
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Daily Progress</h2>
              <p className="text-sm text-gray-600">Keep up the great work!</p>
            </div>
            <Badge className="px-2 py-1">
              <Sparkles className="w-4 h-4 mr-1" />
              Level {userStats.level}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Level Progress</span>
                <span>{Math.round((userStats.xp / userStats.nextLevel) * 100)}%</span>
              </div>
              <Progress value={(userStats.xp / userStats.nextLevel) * 100} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">{userStats.streak}</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </Card>
              
              <Card className="p-4 text-center">
                <Brain className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{userStats.totalCardsLearned}</div>
                <div className="text-xs text-gray-500">Cards Learned</div>
              </Card>
              
              <Card className="p-4 text-center">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{userStats.xp}</div>
                <div className="text-xs text-gray-500">Total XP</div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-bold">Achievements</h3>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map(achievement => (
            <Card key={achievement.id} className={achievement.achieved ? 'bg-green-50' : 'bg-gray-50'}>
              <div className="flex items-center space-x-2 p-3">
                {achievement.icon}
                <span className="text-sm">{achievement.name}</span>
                {achievement.achieved && (
                  <Badge className="ml-auto bg-green-500">
                    <Star className="w-3 h-3" />
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Strengths</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userStats.strongestCategories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm">{category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Areas to Improve</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userStats.weakestCategories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <Flag className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="text-sm">{category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFlashcard = () => {
    const card = flashcardsDB[currentFlashcard];
    
    return (
      <Card className="overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Badge variant="outline">{card.category}</Badge>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Volume2 className="w-4 h-4" />
              </Button>
              <Badge>Level {card.level}</Badge>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{card.spanish}</h2>
            {showAnswer && (
              <div className="space-y-4">
                <p className="text-2xl text-green-600">{card.english}</p>
                <p className="text-gray-600 italic">"{card.pronunciation}"</p>
                
                <div className="space-y-2">
                  {card.examples.map((example, index) => (
                    <div key={index} className="text-sm bg-gray-50 p-3 rounded">
                      <p className="font-medium">{example.spanish}</p>
                      <p className="text-gray-600">{example.english}</p>
                    </div>
                  ))}
                </div>

                {card.commonMistakes?.length > 0 && (
                  <Alert>
                    <p className="font-medium">Common mistakes:</p>
                    <ul className="list-disc list-inside">
                      {card.commonMistakes.map((mistake, index) => (
                        <li key={index}>{mistake}</li>
                      ))}
                    </ul>
                  </Alert>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Button 
                variant={showAnswer ? "outline" : "default"}
                onClick={() => setShowAnswer(!showAnswer)}
              >
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </Button>
              {showAnswer && (
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => handleAnswer(false)}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Incorrect
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-50"
                    onClick={() => handleAnswer(true)}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Correct
                  </Button>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setCurrentFlashcard(prev => (prev - 1 + flashcardsDB.length) % flashcardsDB.length)}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNextCard}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">¡Hola! Welcome back</h1>
            <p className="text-sm opacity-90">Continue your Spanish journey</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {renderDashboard()}
        </TabsContent>

        <TabsContent value="study">
          {renderFlashcard()}
        </TabsContent>

        <TabsContent value="practice">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold">Practice Modes</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button className="h-24 flex flex-col items-center justify-center space-y-2">
                <Brain className="w-6 h-6" />
                <span>Multiple Choice</span>
              </Button>
              <Button className="h-24 flex flex-col items-center justify-center space-y-2">
                <Volume2 className="w-6 h-6" />
                <span>Listen & Speak</span>
              </Button>
              <Button className="h-24 flex flex-col items-center justify-center space-y-2">
                <Users className="w-6 h-6" />
                <span>Match Pairs</span>
              </Button>
              <Button className="h-24 flex flex-col items-center justify-center space-y-2">
                <Zap className="w-6 h-6" />
                <span>Time Challenge</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


