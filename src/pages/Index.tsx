import { useState, useEffect } from 'react';
import { Navigation, TabType } from '@/components/Navigation';
import { MoodTracker, MoodType } from '@/components/MoodTracker';
import { JournalEntry } from '@/components/JournalEntry';
import { JournalTimeline, JournalEntryData } from '@/components/JournalTimeline';
import { MoodAnalytics } from '@/components/MoodAnalytics';
import { AffirmationCard } from '@/components/AffirmationCard';
import { BreathingExercise } from '@/components/BreathingExercise';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [todaysMood, setTodaysMood] = useState<MoodType | undefined>();
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journal-entries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      const entriesWithDates = parsed.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
      setEntries(entriesWithDates);
    }

    const savedMood = localStorage.getItem('todays-mood');
    if (savedMood) {
      setTodaysMood(savedMood as MoodType);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('journal-entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (todaysMood) {
      localStorage.setItem('todays-mood', todaysMood);
    }
  }, [todaysMood]);

  const handleMoodSelect = (mood: MoodType) => {
    setTodaysMood(mood);
    toast({
      title: "Mood recorded",
      description: "Thank you for checking in with yourself today. 💙",
    });
  };

  const handleJournalSave = (entryData: { content: string; prompt: string; tags: string[] }) => {
    const newEntry: JournalEntryData = {
      id: Date.now().toString(),
      date: new Date(),
      mood: todaysMood || 'okay',
      content: entryData.content,
      prompt: entryData.prompt,
      tags: entryData.tags
    };

    setEntries(prev => [newEntry, ...prev]);
    
    toast({
      title: "Entry saved",
      description: "Your thoughts have been safely recorded. 🌟",
    });
    
    setActiveTab('timeline');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: Sun };
    if (hour < 17) return { text: "Good afternoon", icon: Sun };
    return { text: "Good evening", icon: Moon };
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        <Card className="journal-card cursor-pointer group" onClick={() => setActiveTab('journal')}>
          <CardContent className="p-6 text-center space-y-3">
            <Sparkles className="h-8 w-8 text-primary mx-auto group-hover:animate-gentle-pulse" />
            <h3 className="font-semibold text-foreground">Start Writing</h3>
            <p className="text-sm text-muted-foreground">
              Capture your thoughts and feelings
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
      {entries.length > 0 && (
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
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground hidden sm:inline">
              Mindful Moments
            </span>
          </div>
          
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
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
