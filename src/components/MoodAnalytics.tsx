import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, TrendingUp, Calendar, Heart } from 'lucide-react';
import { MoodType } from './MoodTracker';
import { JournalEntryData } from './JournalTimeline';

interface MoodAnalyticsProps {
  entries: JournalEntryData[];
}

const moodLabels: Record<MoodType, string> = {
  amazing: 'Amazing',
  good: 'Good',
  okay: 'Okay',
  down: 'Down',
  tough: 'Tough'
};

const moodEmojis: Record<MoodType, string> = {
  amazing: '😄',
  good: '😊',
  okay: '😐',
  down: '😔',
  tough: '😢'
};

const moodColors: Record<MoodType, string> = {
  amazing: 'gentle-green',
  good: 'calm-blue',
  okay: 'primary',
  down: 'warm-peach',
  tough: 'soft-rose'
};

export function MoodAnalytics({ entries }: MoodAnalyticsProps) {
  // Calculate mood distribution
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<MoodType, number>);

  const totalEntries = entries.length;
  const moodData = Object.entries(moodCounts).map(([mood, count]) => ({
    mood: mood as MoodType,
    count,
    percentage: totalEntries > 0 ? (count / totalEntries) * 100 : 0
  })).sort((a, b) => b.count - a.count);

  // Calculate recent trend (last 7 days vs previous 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const recentEntries = entries.filter(entry => entry.date >= sevenDaysAgo);
  const previousEntries = entries.filter(entry => 
    entry.date >= fourteenDaysAgo && entry.date < sevenDaysAgo
  );

  // Calculate average mood score (5 = amazing, 1 = tough)
  const getMoodScore = (mood: MoodType): number => {
    const scores: Record<MoodType, number> = {
      amazing: 5,
      good: 4,
      okay: 3,
      down: 2,
      tough: 1
    };
    return scores[mood];
  };

  const recentAverage = recentEntries.length > 0 
    ? recentEntries.reduce((sum, entry) => sum + getMoodScore(entry.mood), 0) / recentEntries.length
    : 0;

  const previousAverage = previousEntries.length > 0
    ? previousEntries.reduce((sum, entry) => sum + getMoodScore(entry.mood), 0) / previousEntries.length
    : 0;

  const trend = recentAverage - previousAverage;

  // Get streak information
  const getStreak = () => {
    if (entries.length === 0) return { type: 'none', count: 0 };
    
    const sortedByDate = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const entry of sortedByDate) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (entryDate.getTime() < currentDate.getTime()) {
        break;
      }
    }
    
    return { type: 'journal', count: streak };
  };

  const streak = getStreak();

  if (totalEntries === 0) {
    return (
      <Card className="journal-card">
        <CardContent className="p-12 text-center space-y-4">
          <BarChart className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">No data yet</h3>
            <p className="text-muted-foreground">
              Keep journaling to see your mood patterns and insights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="journal-card">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{totalEntries}</div>
            <div className="text-sm text-muted-foreground">Total Entries</div>
          </CardContent>
        </Card>

        <Card className="journal-card">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{streak.count}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>

        <Card className="journal-card">
          <CardContent className="p-6 text-center">
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${
              trend > 0 ? 'text-gentle-green' : trend < 0 ? 'text-warm-peach' : 'text-primary'
            }`} />
            <div className="text-2xl font-bold text-foreground">
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Weekly Trend</div>
          </CardContent>
        </Card>
      </div>

      {/* Mood Distribution */}
      <Card className="journal-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Mood Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {moodData.map((item) => (
            <div key={item.mood} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{moodEmojis[item.mood]}</span>
                  <span className="font-medium text-foreground">
                    {moodLabels[item.mood]}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.count} times ({item.percentage.toFixed(1)}%)
                </div>
              </div>
              
              <div className="w-full bg-secondary/30 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    background: `linear-gradient(90deg, hsl(var(--${moodColors[item.mood]})), hsl(var(--${moodColors[item.mood]}) / 0.7))`
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Insights */}
      <Card className="journal-card">
        <CardHeader>
          <CardTitle>Recent Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-muted-foreground">
                You've been journaling for {streak.count} consecutive days
              </span>
            </div>
            
            {recentEntries.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                <span className="text-muted-foreground">
                  This week you felt {moodLabels[recentEntries[0].mood].toLowerCase()} most recently
                </span>
              </div>
            )}
            
            {trend !== 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${
                  trend > 0 ? 'bg-gentle-green' : 'bg-warm-peach'
                }`}></span>
                <span className="text-muted-foreground">
                  Your mood has been {trend > 0 ? 'improving' : 'more challenging'} compared to last week
                </span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border/30">
            <p className="text-sm text-foreground">
              Remember: Every emotion is valid, and tracking your feelings helps you understand yourself better. 
              You're doing great by taking time for self-reflection. 💙
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}