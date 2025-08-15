import { useState, useEffect } from 'react';
import { Navigation, TabType } from '@/components/Navigation';
import { MoodTracker, MoodType } from '@/components/MoodTracker';
import { JournalEntry } from '@/components/JournalEntry';
import { JournalTimeline, JournalEntryData } from '@/components/JournalTimeline';
import { MoodAnalytics } from '@/components/MoodAnalytics';
import { AffirmationCard } from '@/components/AffirmationCard';
import { BreathingExercise } from '@/components/BreathingExercise';
import { AIChatbot } from '@/components/AIChatbot';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, Sun, Moon, PenTool, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BookRecommendations } from '@/components/BookRecommendations';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [todaysMood, setTodaysMood] = useState<MoodType | undefined>();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load data from Supabase on mount
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        // Load journal entries
        const { data: journalData, error: journalError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (journalError) throw journalError;

        // Transform to match expected format
        const transformedEntries: JournalEntryData[] = journalData?.map(entry => ({
          id: entry.id,
          date: new Date(entry.created_at),
          mood: entry.mood ? (['tough', 'down', 'okay', 'good', 'amazing'][entry.mood - 1] as MoodType) : 'okay',
          content: entry.content,
          prompt: '', // Add separate storage for prompt if needed
          tags: [] // Add separate storage for tags if needed
        })) || [];

        setEntries(transformedEntries);

        // Load today's mood
        const today = new Date().toISOString().split('T')[0];
        const { data: moodData, error: moodError } = await supabase
          .from('mood_logs')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lt('created_at', `${today}T23:59:59.999Z`)
          .order('created_at', { ascending: false })
          .limit(1);

        if (moodError) throw moodError;

        if (moodData && moodData.length > 0) {
          const moodValue = moodData[0].mood;
          const moodTypes: MoodType[] = ['tough', 'down', 'okay', 'good', 'amazing'];
          setTodaysMood(moodTypes[moodValue - 1] || 'okay');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: "Error loading data",
          description: "There was an issue loading your journal entries.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, toast]);

  const handleMoodSelect = (mood: MoodType) => {
    setTodaysMood(mood);
    toast({
      title: "Mood recorded",
      description: "Thank you for checking in with yourself today. 💙",
    });
  };

  const handleJournalSave = (entryData: { content: string; prompt: string; tags: string[] }) => {
    // Refresh entries list after successful save
    if (user) {
      const loadEntries = async () => {
        try {
          const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;

          const transformedEntries: JournalEntryData[] = data?.map(entry => ({
            id: entry.id,
            date: new Date(entry.created_at),
            mood: entry.mood ? (['tough', 'down', 'okay', 'good', 'amazing'][entry.mood - 1] as MoodType) : 'okay',
            content: entry.content,
            prompt: entryData.prompt,
            tags: entryData.tags
          })) || [];

          setEntries(transformedEntries);
        } catch (error) {
          console.error('Error refreshing entries:', error);
        }
      };

      loadEntries();
    }
    
    setActiveTab('timeline');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: Sun };
    if (hour < 17) return { text: "Good Afternoon", icon: Sun };
    return { text: "Good Evening", icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const renderHomeTab = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4 animate-slide-up">
        <div className="flex items-center justify-center gap-3">
          <GreetingIcon className="h-8 w-8 text-primary animate-gentle-pulse" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {greeting.text}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Welcome to your personal space for reflection and growth. 
          Take a moment to check in with yourself.
        </p>
      </div>

      {/* Today's Mood Check-in */}
      <div className="max-w-2xl mx-auto">
        <MoodTracker 
          selectedMood={todaysMood}
          onMoodSelect={handleMoodSelect}
        />
      </div>

      {/* Daily Affirmation */}
      <div className="max-w-xl mx-auto">
        <AffirmationCard />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="journal-card cursor-pointer group" onClick={() => setActiveTab('journal')}>
          <CardContent className="p-6 text-center space-y-3">
            <Sparkles className="h-8 w-8 text-primary mx-auto group-hover:animate-gentle-pulse" />
            <h3 className="font-semibold text-foreground">Start Writing</h3>
            <p className="text-sm text-muted-foreground">
              Capture your thoughts and feelings
            </p>
          </CardContent>
        </Card>

        <Card className="journal-card cursor-pointer group" onClick={() => setActiveTab('books')}>
          <CardContent className="p-6 text-center space-y-3">
            <BookOpen className="h-8 w-8 text-gentle-green mx-auto group-hover:animate-gentle-pulse" />
            <h3 className="font-semibold text-foreground">Book Recommendations</h3>
            <p className="text-sm text-muted-foreground">
              Discover books based on your mood
            </p>
          </CardContent>
        </Card>

        <Card className="journal-card cursor-pointer group" onClick={() => setActiveTab('breathe')}>
          <CardContent className="p-6 text-center space-y-3">
            <Heart className="h-8 w-8 text-accent mx-auto group-hover:animate-gentle-pulse" />
            <h3 className="font-semibold text-foreground">Breathe</h3>
            <p className="text-sm text-muted-foreground">
              Take a moment to center yourself
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries Preview */}
      {!loading && entries.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Reflections</h2>
            <Button variant="ghost" onClick={() => setActiveTab('timeline')}>
              View All
            </Button>
          </div>
          <JournalTimeline 
            entries={entries.slice(0, 3)} 
            onEntryClick={() => setActiveTab('timeline')}
          />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      case 'journal':
        return (
          <div className="max-w-2xl mx-auto">
            <JournalEntry onSave={handleJournalSave} />
          </div>
        );
      case 'timeline':
        return (
          <div className="max-w-4xl mx-auto">
            <JournalTimeline 
              entries={entries}
              onEntryClick={(entry) => console.log('View entry:', entry)}
            />
          </div>
        );
      case 'analytics':
        return (
          <div className="max-w-4xl mx-auto">
            <MoodAnalytics entries={entries} />
          </div>
        );
      case 'books':
        return (
          <div className="max-w-4xl mx-auto">
            <BookRecommendations entries={entries} todaysMood={todaysMood} />
          </div>
        );
      case 'chatbot':
        return (
          <div className="max-w-4xl mx-auto">
            <AIChatbot />
          </div>
        );
      case 'breathe':
        return (
          <div className="max-w-xl mx-auto">
            <Card className="journal-card">
              <CardContent className="p-0">
                <BreathingExercise onComplete={() => setActiveTab('home')} />
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderHomeTab();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header with Navigation */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PenTool className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground hidden sm:inline" style={{ fontFamily: 'cursive' }}>
              Heart Hues diary
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
