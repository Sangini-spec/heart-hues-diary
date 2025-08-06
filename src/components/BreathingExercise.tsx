import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface BreathingExerciseProps {
  onComplete?: () => void;
}

export function BreathingExercise({ onComplete }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case 'inhale':
                return 'hold';
              case 'hold':
                return 'exhale';
              case 'exhale':
                return 'inhale';
            }
          });
          return getPhaseTime(phase === 'inhale' ? 'hold' : phase === 'hold' ? 'exhale' : 'inhale');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const getPhaseTime = (currentPhase: 'inhale' | 'hold' | 'exhale') => {
    switch (currentPhase) {
      case 'inhale':
        return 4;
      case 'hold':
        return 4;
      case 'exhale':
        return 6;
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out gently...';
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-110';
      case 'hold':
        return 'scale-110';
      case 'exhale':
        return 'scale-100';
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">Take a moment to breathe</h3>
        <p className="text-muted-foreground">Find your center with this guided breathing exercise</p>
      </div>

      <div className="relative">
        <div 
          className={`breathing-circle transition-transform duration-1000 ${
            isActive ? getCircleScale() : ''
          }`}
        />
        
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary-foreground">
              {countdown}
            </span>
          </div>
        )}
      </div>

      {isActive && (
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">{getPhaseInstruction()}</p>
          <p className="text-sm text-muted-foreground capitalize">{phase} phase</p>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={() => setIsActive(!isActive)}
          variant="default"
          size="lg"
          className="flex items-center gap-2"
        >
          {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {isActive ? 'Pause' : 'Start Breathing'}
        </Button>

        {isActive && (
          <Button
            onClick={() => {
              setIsActive(false);
              onComplete?.();
            }}
            variant="outline"
            size="lg"
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}