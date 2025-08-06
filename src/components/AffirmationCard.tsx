import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Heart } from 'lucide-react';

const affirmations = [
  "You are worthy of love and kindness, especially from yourself.",
  "Your feelings are valid, and it's okay to feel whatever you're feeling right now.",
  "You have overcome challenges before, and you have the strength to do it again.",
  "Progress isn't always linear, and that's perfectly okay.",
  "You are enough, exactly as you are in this moment.",
  "Your mental health matters, and taking care of yourself is not selfish.",
  "Every small step forward is still progress worth celebrating.",
  "You deserve patience and compassion, especially from yourself.",
  "It's okay to rest. It's okay to take breaks. It's okay to not be productive today.",
  "You are not alone in this journey, even when it feels like you are.",
  "Your story isn't over yet. There are beautiful chapters still to be written.",
  "You have permission to put your wellbeing first.",
  "Healing is not a destination, it's a journey, and you're exactly where you need to be.",
  "You are brave for facing each day, especially the difficult ones.",
  "Your worth is not determined by your productivity or achievements."
];

export function AffirmationCard() {
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Set initial affirmation
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentAffirmation(affirmations[randomIndex]);
  }, []);

  const getNewAffirmation = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      let newAffirmation;
      do {
        const randomIndex = Math.floor(Math.random() * affirmations.length);
        newAffirmation = affirmations[randomIndex];
      } while (newAffirmation === currentAffirmation && affirmations.length > 1);
      
      setCurrentAffirmation(newAffirmation);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <Card className="affirmation-card border-0 relative overflow-hidden">
      {/* Floating heart decoration */}
      <div className="absolute top-4 right-4 text-primary/20 animate-float">
        <Heart className="h-6 w-6" />
      </div>
      
      <CardContent className="p-8 text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground flex items-center justify-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Daily Affirmation
          </h3>
          <p className="text-sm text-muted-foreground">
            A gentle reminder for your journey
          </p>
        </div>

        <div 
          className={`transition-all duration-300 ${
            isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <blockquote className="text-lg leading-relaxed text-foreground italic">
            "{currentAffirmation}"
          </blockquote>
        </div>

        <Button
          onClick={getNewAffirmation}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 mx-auto rounded-full"
          disabled={isAnimating}
        >
          <RefreshCw className={`h-4 w-4 ${isAnimating ? 'animate-spin' : ''}`} />
          New Affirmation
        </Button>

        <div className="text-xs text-muted-foreground">
          Take a deep breath and let these words sink in 🌸
        </div>
      </CardContent>
    </Card>
  );
}