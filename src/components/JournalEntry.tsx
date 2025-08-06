import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Star } from 'lucide-react';

const journalPrompts = [
  "What made you smile today?",
  "What are you grateful for right now?",
  "What challenged you today and how did you handle it?",
  "What would you like to let go of?",
  "What are you looking forward to?",
  "Describe a moment when you felt peaceful today.",
  "What's one thing you learned about yourself today?",
  "What would you tell a friend who was feeling like you are now?",
  "What small victory can you celebrate today?",
  "How did you show kindness today?"
];

interface JournalEntryProps {
  onSave: (entry: { content: string; prompt: string; tags: string[] }) => void;
  initialContent?: string;
  initialPrompt?: string;
  initialTags?: string[];
}

export function JournalEntry({ onSave, initialContent = '', initialPrompt = '', initialTags = [] }: JournalEntryProps) {
  const [content, setContent] = useState(initialContent);
  const [selectedPrompt, setSelectedPrompt] = useState(initialPrompt || journalPrompts[0]);
  const [showPrompts, setShowPrompts] = useState(!initialPrompt);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');

  const suggestedTags = ['grateful', 'peaceful', 'anxious', 'hopeful', 'reflective', 'energized', 'calm'];

  const handleSave = () => {
    if (content.trim()) {
      onSave({ content: content.trim(), prompt: selectedPrompt, tags });
      setContent('');
      setTags([]);
      setSelectedPrompt(journalPrompts[Math.floor(Math.random() * journalPrompts.length)]);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getRandomPrompt = () => {
    const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    setSelectedPrompt(randomPrompt);
    setShowPrompts(false);
  };

  return (
    <Card className="journal-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Today's Reflection
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Journal Prompt Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">Writing Prompt</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={getRandomPrompt}
              className="text-primary hover:text-primary/80"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              New Prompt
            </Button>
          </div>
          
          <div className="p-4 rounded-2xl border border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
            <p className="text-foreground font-medium">{selectedPrompt}</p>
          </div>

          {showPrompts && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {journalPrompts.slice(0, 4).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setShowPrompts(false);
                  }}
                  className="text-left p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Writing Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Your thoughts
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing... there's no right or wrong way to express yourself."
            className="gentle-input min-h-[200px] resize-none"
            maxLength={2000}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Write freely and authentically</span>
            <span>{content.length}/2000</span>
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">How would you tag this entry?</h4>
          
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <Button
                key={tag}
                variant={tags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => addTag(tag)}
                className="rounded-full text-xs"
              >
                {tag}
              </Button>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1 rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleSave}
            disabled={!content.trim()}
            size="lg"
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Save Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}