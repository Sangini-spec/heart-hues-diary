import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type MoodType = 'amazing' | 'good' | 'okay' | 'down' | 'tough';

interface MoodOption {
  id: MoodType;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  {
    id: 'amazing',
    emoji: '😄',
    label: 'Amazing',
    description: 'Feeling fantastic and energized',
    color: 'gentle-green'
  },
  {
    id: 'good',
    emoji: '😊',
    label: 'Good',
    description: 'Positive and content',
    color: 'calm-blue'
  },
  {
    id: 'okay',
    emoji: '😐',
    label: 'Okay',
    description: 'Neutral, neither up nor down',
    color: 'primary'
  },
  {
    id: 'down',
    emoji: '😔',
    label: 'Down',
    description: 'Feeling a bit low today',
    color: 'warm-peach'
  },
  {
    id: 'tough',
    emoji: '😢',
    label: 'Tough',
    description: 'Having a difficult time',
    color: 'soft-rose'
  }
];

interface MoodTrackerProps {
  selectedMood?: MoodType;
  onMoodSelect: (mood: MoodType) => void;
  showDescription?: boolean;
}

export function MoodTracker({ selectedMood, onMoodSelect, showDescription = true }: MoodTrackerProps) {
  const [hoveredMood, setHoveredMood] = useState<MoodType | null>(null);

  const currentMood = hoveredMood || selectedMood;
  const currentMoodData = moodOptions.find(mood => mood.id === currentMood);

  return (
    <Card className="journal-card">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">How are you feeling today?</CardTitle>
        <p className="text-sm text-muted-foreground">
          Take a moment to check in with yourself
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-5 gap-3">
          {moodOptions.map((mood) => (
            <button
              key={mood.id}
              onClick={() => onMoodSelect(mood.id)}
              onMouseEnter={() => setHoveredMood(mood.id)}
              onMouseLeave={() => setHoveredMood(null)}
              className={`mood-button flex flex-col items-center gap-2 p-4 ${
                selectedMood === mood.id ? 'selected' : ''
              }`}
              aria-label={`Select ${mood.label} mood`}
            >
              <span className="text-3xl" role="img" aria-label={mood.label}>
                {mood.emoji}
              </span>
              <span className="text-xs font-medium text-foreground/80">
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        {showDescription && currentMoodData && (
          <div 
            className="text-center p-4 rounded-2xl border border-border/30 animate-slide-up"
            style={{
              background: `linear-gradient(135deg, hsl(var(--${currentMoodData.color}) / 0.1), hsl(var(--${currentMoodData.color}) / 0.05))`
            }}
          >
            <p className="text-sm text-muted-foreground">
              {currentMoodData.description}
            </p>
          </div>
        )}

        {selectedMood && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Your mood has been recorded. Remember, all feelings are valid. 💙
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}