import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const currentMood = hoveredMood || selectedMood;
  const currentMoodData = moodOptions.find(mood => mood.id === currentMood);

  const moodToNumber = (mood: MoodType): number => {
    const mapping = { tough: 1, down: 2, okay: 3, good: 4, amazing: 5 };
    return mapping[mood];
  };

  const saveMoodLog = async (mood: MoodType) => {
    if (!user) return;
    
    // Input validation for notes
    const sanitizedNotes = notes.trim();
    if (sanitizedNotes.length > 500) {
      toast({
        title: "Note too long",
        description: "Please keep your mood note under 500 characters.",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      // Check if user already logged mood today to prevent spam
      const today = new Date().toISOString().split('T')[0];
      const { data: existingMoods, error: checkError } = await supabase
        .from('mood_logs')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      if (checkError) throw checkError;

      // Allow up to 3 mood logs per day to prevent abuse
      if (existingMoods && existingMoods.length >= 3) {
        toast({
          title: "Daily limit reached",
          description: "You can log up to 3 moods per day.",
          variant: "destructive"
        });
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('mood_logs')
        .insert({
          user_id: user.id,
          mood: moodToNumber(mood),
          notes: sanitizedNotes || null
        });

      if (error) throw error;

      toast({
        title: "Mood logged",
        description: "Your mood has been recorded successfully."
      });
      
      setNotes('');
      onMoodSelect(mood);
    } catch (error) {
      console.error('Error saving mood log:', error);
      toast({
        title: "Error",
        description: "Failed to save mood log. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

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
              onClick={() => saveMoodLog(mood.id)}
              onMouseEnter={() => setHoveredMood(mood.id)}
              onMouseLeave={() => setHoveredMood(null)}
              disabled={saving}
              className={`mood-button flex flex-col items-center gap-2 p-4 disabled:opacity-50 ${
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

        {/* Optional notes section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Add a note about your mood (optional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How are you feeling? What's on your mind?"
            className="gentle-input min-h-[80px] resize-none"
            maxLength={500}
          />
          <div className="text-xs text-muted-foreground text-right">
            {notes.length}/500
          </div>
        </div>

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