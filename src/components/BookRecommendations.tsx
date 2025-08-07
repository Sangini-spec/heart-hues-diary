import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Star, TrendingUp, Heart, Lightbulb, Coffee } from 'lucide-react';
import { MoodType } from '@/components/MoodTracker';
import { JournalEntryData } from '@/components/JournalTimeline';

// Book cover imports
import powerOfNowCover from '@/assets/book-covers/power-of-now.jpg';
import atomicHabitsCover from '@/assets/book-covers/atomic-habits.jpg';
import bigMagicCover from '@/assets/book-covers/big-magic.jpg';
import giftsOfImperfectionCover from '@/assets/book-covers/gifts-of-imperfection.jpg';
import maybeYouShouldTalkCover from '@/assets/book-covers/maybe-you-should-talk.jpg';
import subtleArtCover from '@/assets/book-covers/subtle-art.jpg';
import whenThingsFallApartCover from '@/assets/book-covers/when-things-fall-apart.jpg';
import optionBCover from '@/assets/book-covers/option-b.jpg';
import bodyKeepsScoreCover from '@/assets/book-covers/body-keeps-score.jpg';
import risingStrongCover from '@/assets/book-covers/rising-strong.jpg';

type EmotionType = 'happiness' | 'sad' | 'love' | 'loss' | 'inconsistency' | 'fear-not-enough' | 'lack-self-belief';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: 'motivational' | 'alignment' | 'healing' | 'growth';
  mood: MoodType[];
  emotions: EmotionType[];
  rating: number;
  tags: string[];
  icon: typeof BookOpen;
  coverImage: string;
}

const bookDatabase: Book[] = [
  // Amazing mood books
  {
    id: '1',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    description: 'A guide to spiritual enlightenment that teaches the importance of living in the present moment.',
    category: 'alignment',
    mood: ['amazing', 'good'],
    emotions: ['happiness', 'love'],
    rating: 4.8,
    tags: ['mindfulness', 'spirituality', 'presence'],
    icon: Star,
    coverImage: powerOfNowCover
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'A comprehensive guide to building good habits and breaking bad ones through small changes.',
    category: 'motivational',
    mood: ['amazing', 'good', 'okay'],
    emotions: ['happiness', 'lack-self-belief', 'inconsistency'],
    rating: 4.9,
    tags: ['productivity', 'self-improvement', 'habits'],
    icon: TrendingUp,
    coverImage: atomicHabitsCover
  },
  
  // Good mood books
  {
    id: '3',
    title: 'Big Magic',
    author: 'Elizabeth Gilbert',
    description: 'Creative living beyond fear - a beautiful exploration of creativity and inspiration.',
    category: 'motivational',
    mood: ['good', 'amazing'],
    emotions: ['happiness', 'fear-not-enough', 'lack-self-belief'],
    rating: 4.6,
    tags: ['creativity', 'inspiration', 'courage'],
    icon: Lightbulb,
    coverImage: bigMagicCover
  },
  {
    id: '4',
    title: 'The Gifts of Imperfection',
    author: 'Brené Brown',
    description: 'Let go of who you think you\'re supposed to be and embrace who you are.',
    category: 'alignment',
    mood: ['good', 'okay'],
    emotions: ['love', 'fear-not-enough', 'lack-self-belief'],
    rating: 4.7,
    tags: ['self-acceptance', 'vulnerability', 'authenticity'],
    icon: Heart,
    coverImage: giftsOfImperfectionCover
  },

  // Okay mood books
  {
    id: '5',
    title: 'Maybe You Should Talk to Someone',
    author: 'Lori Gottlieb',
    description: 'A therapist, her therapist, and our lives revealed through intimate stories of healing.',
    category: 'alignment',
    mood: ['okay', 'down'],
    emotions: ['sad', 'loss', 'inconsistency'],
    rating: 4.7,
    tags: ['therapy', 'mental health', 'healing'],
    icon: Heart,
    coverImage: maybeYouShouldTalkCover
  },
  {
    id: '6',
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    description: 'A counterintuitive approach to living a good life by focusing on what truly matters.',
    category: 'motivational',
    mood: ['okay', 'down'],
    emotions: ['inconsistency', 'fear-not-enough', 'lack-self-belief'],
    rating: 4.5,
    tags: ['philosophy', 'priorities', 'mindset'],
    icon: Coffee,
    coverImage: subtleArtCover
  },

  // Down mood books
  {
    id: '7',
    title: 'When Things Fall Apart',
    author: 'Pema Chödrön',
    description: 'Heart advice for difficult times from a beloved Buddhist teacher.',
    category: 'healing',
    mood: ['down', 'tough'],
    emotions: ['sad', 'loss', 'fear-not-enough'],
    rating: 4.6,
    tags: ['resilience', 'Buddhism', 'comfort'],
    icon: Heart,
    coverImage: whenThingsFallApartCover
  },
  {
    id: '8',
    title: 'Option B',
    author: 'Sheryl Sandberg & Adam Grant',
    description: 'Facing adversity, building resilience, and finding joy after hardship.',
    category: 'healing',
    mood: ['down', 'tough'],
    emotions: ['sad', 'loss', 'lack-self-belief'],
    rating: 4.5,
    tags: ['resilience', 'grief', 'recovery'],
    icon: TrendingUp,
    coverImage: optionBCover
  },

  // Tough mood books
  {
    id: '9',
    title: 'The Body Keeps the Score',
    author: 'Bessel van der Kolk',
    description: 'Brain, mind, and body in the healing of trauma.',
    category: 'healing',
    mood: ['tough', 'down'],
    emotions: ['sad', 'loss', 'fear-not-enough'],
    rating: 4.8,
    tags: ['trauma', 'healing', 'recovery'],
    icon: Heart,
    coverImage: bodyKeepsScoreCover
  },
  {
    id: '10',
    title: 'Rising Strong',
    author: 'Brené Brown',
    description: 'How the ability to reset transforms the way we live, love, parent, and lead.',
    category: 'healing',
    mood: ['tough', 'down', 'okay'],
    emotions: ['sad', 'loss', 'lack-self-belief'],
    rating: 4.6,
    tags: ['resilience', 'courage', 'recovery'],
    icon: TrendingUp,
    coverImage: risingStrongCover
  }
];

interface BookRecommendationsProps {
  entries: JournalEntryData[];
  todaysMood?: MoodType;
}

export function BookRecommendations({ entries, todaysMood }: BookRecommendationsProps) {
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'motivational' | 'alignment' | 'healing'>('all');

  const analyzeMoodPattern = (): MoodType[] => {
    if (!entries.length && !todaysMood) return ['okay'];
    
    // Weight recent entries more heavily
    const recentEntries = entries.slice(0, 7); // Last 7 entries
    const moodCounts: Record<MoodType, number> = {
      amazing: 0,
      good: 0,
      okay: 0,
      down: 0,
      tough: 0
    };

    // Count mood frequencies
    recentEntries.forEach(entry => {
      moodCounts[entry.mood]++;
    });

    // Add today's mood with higher weight
    if (todaysMood) {
      moodCounts[todaysMood] += 2;
    }

    // Sort moods by frequency
    const sortedMoods = Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([mood]) => mood as MoodType)
      .filter((_, index) => index < 3); // Top 3 moods

    return sortedMoods.length > 0 ? sortedMoods : ['okay'];
  };

  const getRecommendations = (): Book[] => {
    const moodPattern = analyzeMoodPattern();
    const primaryMood = moodPattern[0];
    
    // Get books that match the mood pattern
    let matchingBooks = bookDatabase.filter(book => 
      book.mood.some(mood => moodPattern.includes(mood))
    );

    // If primarily negative moods, include healing books
    if (['down', 'tough'].includes(primaryMood)) {
      const healingBooks = bookDatabase.filter(book => 
        book.category === 'healing' || book.category === 'motivational'
      );
      matchingBooks = [...new Set([...matchingBooks, ...healingBooks])];
    }

    // If positive moods, include motivational and growth books
    if (['amazing', 'good'].includes(primaryMood)) {
      const growthBooks = bookDatabase.filter(book => 
        book.category === 'motivational' || book.category === 'alignment'
      );
      matchingBooks = [...new Set([...matchingBooks, ...growthBooks])];
    }

    // Sort by rating and limit to 6 recommendations
    return matchingBooks
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  };

  useEffect(() => {
    setRecommendedBooks(getRecommendations());
  }, [entries, todaysMood]);

  const filteredBooks = selectedCategory === 'all' 
    ? recommendedBooks 
    : recommendedBooks.filter(book => book.category === selectedCategory);

  const getMoodInsight = (): string => {
    const moodPattern = analyzeMoodPattern();
    const primaryMood = moodPattern[0];
    
    const insights: Record<MoodType, string> = {
      amazing: "You're feeling fantastic! Here are some books to maintain your positive energy and inspire further growth.",
      good: "You're in a positive headspace! These books will complement your good mood and provide inspiration.",
      okay: "You're in a neutral space, which is perfect for exploring new perspectives and gentle growth.",
      down: "It's okay to feel down sometimes. These books offer comfort, understanding, and gentle guidance.",
      tough: "You're going through a difficult time. These books provide healing, support, and hope for brighter days."
    };

    return insights[primaryMood];
  };

  const categories = [
    { id: 'all', label: 'All Recommendations', icon: BookOpen },
    { id: 'motivational', label: 'Motivational', icon: TrendingUp },
    { id: 'alignment', label: 'Self-Alignment', icon: Star },
    { id: 'healing', label: 'Healing & Recovery', icon: Heart }
  ] as const;

  return (
    <div className="space-y-6">
      <Card className="journal-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Book Recommendations</CardTitle>
          </div>
          <p className="text-muted-foreground">
            {getMoodInsight()}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id as any)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          <Separator />

          {/* Book Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => {
              const Icon = book.icon;
              return (
                <Card key={book.id} className="journal-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      {/* Book Cover */}
                      <div className="w-24 h-32 flex-shrink-0">
                        <img 
                          src={book.coverImage} 
                          alt={`${book.title} cover`}
                          className="w-full h-full object-cover rounded-lg shadow-md"
                        />
                      </div>
                      
                      {/* Book Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-semibold text-foreground leading-tight">
                              {book.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              by {book.author}
                            </p>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{book.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {book.description}
                        </p>
                        
                        {/* Emotions Tags */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Emotions:</span>
                            {book.emotions.map((emotion) => (
                              <Badge key={emotion} variant="outline" className="text-xs capitalize">
                                {emotion.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Tags:</span>
                            {book.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <Badge 
                          variant="outline" 
                          className={`text-xs capitalize w-fit ${
                            book.category === 'motivational' ? 'border-gentle-green text-gentle-green' :
                            book.category === 'alignment' ? 'border-calm-blue text-calm-blue' :
                            book.category === 'healing' ? 'border-warm-peach text-warm-peach' :
                            'border-primary text-primary'
                          }`}
                        >
                          {book.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-8 space-y-2">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                No books found for this category. Try selecting a different filter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}