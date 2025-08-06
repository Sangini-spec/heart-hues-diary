import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { MoodType } from './MoodTracker';

export interface JournalEntryData {
  id: string;
  date: Date;
  mood: MoodType;
  content: string;
  prompt: string;
  tags: string[];
}

interface JournalTimelineProps {
  entries: JournalEntryData[];
  onEntryClick?: (entry: JournalEntryData) => void;
}

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

export function JournalTimeline({ entries, onEntryClick }: JournalTimelineProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const entriesPerPage = 6;
  
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);
  const currentEntries = sortedEntries.slice(
    currentPage * entriesPerPage,
    (currentPage + 1) * entriesPerPage
  );

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  if (entries.length === 0) {
    return (
      <Card className="journal-card">
        <CardContent className="p-12 text-center space-y-4">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">No entries yet</h3>
            <p className="text-muted-foreground">
              Start your journaling journey by writing your first entry
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="journal-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Your Journey
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {currentEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => onEntryClick?.(entry)}
              className="group p-4 rounded-2xl border border-border/30 hover:border-border/60 
                         hover:shadow-md transition-all duration-300 cursor-pointer
                         bg-gradient-to-r from-card to-card/50"
            >
              <div className="flex items-start gap-4">
                {/* Mood indicator */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg
                             border-2 border-border/20 group-hover:scale-110 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--${moodColors[entry.mood]}) / 0.2), hsl(var(--${moodColors[entry.mood]}) / 0.1))`
                  }}
                >
                  {moodEmojis[entry.mood]}
                </div>

                <div className="flex-1 space-y-3">
                  {/* Date and time */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium text-foreground">
                        {formatDate(entry.date)}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(entry.date)}
                      </div>
                    </div>
                  </div>

                  {/* Content preview */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground italic">
                      "{entry.prompt}"
                    </p>
                    <p className="text-foreground line-clamp-2">
                      {entry.content}
                    </p>
                  </div>

                  {/* Tags */}
                  {entry.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      {entry.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs rounded-full"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {entry.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs rounded-full">
                          +{entry.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={index === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(index)}
                  className="w-8 h-8 p-0"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}