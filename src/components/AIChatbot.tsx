import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Music, Film, MapPin, UtensilsCrossed, BookOpen } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'recommendation';
  category?: string;
}

interface Recommendation {
  type: 'songs' | 'movies' | 'places' | 'food' | 'books';
  items: string[];
}

const recommendations: Record<string, Recommendation> = {
  songs: {
    type: 'songs',
    items: [
      "Here Comes The Sun - The Beatles",
      "Good as Hell - Lizzo",
      "Can't Stop the Feeling - Justin Timberlake",
      "Shake It Off - Taylor Swift",
      "Uptown Funk - Bruno Mars",
      "Happy - Pharrell Williams",
      "Roar - Katy Perry",
      "Confident - Demi Lovato"
    ]
  },
  movies: {
    type: 'movies',
    items: [
      "The Pursuit of Happyness",
      "Inside Out",
      "Paddington",
      "Chef",
      "Julie & Julia",
      "The Grand Budapest Hotel",
      "Soul",
      "La La Land",
      "Amélie",
      "The Secret Life of Walter Mitty"
    ]
  },
  places: {
    type: 'places',
    items: [
      "Local parks for peaceful walks",
      "Art galleries and museums",
      "Cozy coffee shops with books",
      "Botanical gardens",
      "Scenic hiking trails",
      "Quiet beaches at sunset",
      "Mountain viewpoints",
      "Historic libraries",
      "Local farmers markets",
      "Meditation gardens"
    ]
  },
  food: {
    type: 'food',
    items: [
      "Dark chocolate for mood boost",
      "Green tea for relaxation",
      "Avocado toast with everything bagel seasoning",
      "Comfort soup like chicken noodle",
      "Fresh fruit smoothie bowls",
      "Homemade cookies",
      "Warm herbal tea with honey",
      "Grilled salmon with vegetables",
      "Quinoa Buddha bowls",
      "Fresh berries with yogurt"
    ]
  },
  books: {
    type: 'books',
    items: [
      "The Alchemist by Paulo Coelho",
      "Atomic Habits by James Clear",
      "The Power of Now by Eckhart Tolle",
      "Big Magic by Elizabeth Gilbert",
      "Mindset by Carol Dweck",
      "The Happiness Project by Gretchen Rubin",
      "Daring Greatly by Brené Brown",
      "Self-Compassion by Kristin Neff"
    ]
  }
};

const getIcon = (category: string) => {
  switch (category) {
    case 'songs': return Music;
    case 'movies': return Film;
    case 'places': return MapPin;
    case 'food': return UtensilsCrossed;
    case 'books': return BookOpen;
    default: return Bot;
  }
};

export function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. I can help you with recommendations for songs, movies, places, food, and books. What would you like to explore today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): { text: string; category?: string } => {
    const message = userMessage.toLowerCase();
    
    // Check for specific recommendation requests
    if (message.includes('song') || message.includes('music')) {
      const items = recommendations.songs.items.slice(0, 4);
      return {
        text: `Here are some uplifting songs I recommend:\n\n${items.map(item => `🎵 ${item}`).join('\n')}`,
        category: 'songs'
      };
    }
    
    if (message.includes('movie') || message.includes('film')) {
      const items = recommendations.movies.items.slice(0, 4);
      return {
        text: `Here are some feel-good movies to watch:\n\n${items.map(item => `🎬 ${item}`).join('\n')}`,
        category: 'movies'
      };
    }
    
    if (message.includes('place') || message.includes('visit') || message.includes('go')) {
      const items = recommendations.places.items.slice(0, 4);
      return {
        text: `Here are some peaceful places you might enjoy:\n\n${items.map(item => `📍 ${item}`).join('\n')}`,
        category: 'places'
      };
    }
    
    if (message.includes('food') || message.includes('eat') || message.includes('recipe')) {
      const items = recommendations.food.items.slice(0, 4);
      return {
        text: `Here are some mood-boosting food suggestions:\n\n${items.map(item => `🍽️ ${item}`).join('\n')}`,
        category: 'food'
      };
    }
    
    if (message.includes('book') || message.includes('read')) {
      const items = recommendations.books.items.slice(0, 4);
      return {
        text: `Here are some inspiring books to read:\n\n${items.map(item => `📚 ${item}`).join('\n')}`,
        category: 'books'
      };
    }

    // Mood-based responses
    if (message.includes('sad') || message.includes('down') || message.includes('depressed')) {
      return {
        text: "I understand you're going through a tough time. Would you like some uplifting music, comforting food suggestions, or inspiring books to help lift your spirits?"
      };
    }
    
    if (message.includes('happy') || message.includes('good') || message.includes('great')) {
      return {
        text: "That's wonderful to hear! Since you're feeling good, would you like some recommendations to keep the positive vibes going? I can suggest celebratory music, fun movies, or exciting places to visit!"
      };
    }
    
    if (message.includes('stressed') || message.includes('anxious') || message.includes('overwhelmed')) {
      return {
        text: "I hear you're feeling stressed. Let me help you relax. Would you like some calming music, peaceful places to visit, or soothing food recommendations?"
      };
    }

    // General responses
    if (message.includes('help') || message.includes('what can you do')) {
      return {
        text: "I can help you with recommendations for:\n\n🎵 Songs to match your mood\n🎬 Movies for entertainment\n📍 Places to visit and explore\n🍽️ Food to comfort and nourish\n📚 Books for inspiration\n\nJust ask me about any of these categories!"
      };
    }

    // Default response
    return {
      text: "I'd love to help you with recommendations! You can ask me about songs, movies, places to visit, food, or books. For example, try asking 'recommend some songs' or 'suggest a good movie'."
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        type: response.category ? 'recommendation' : undefined,
        category: response.category
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get personalized recommendations for music, movies, places, food, and books
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const Icon = message.isUser ? User : (message.category ? getIcon(message.category) : Bot);
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isUser && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  {message.isUser && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2 mt-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask for songs, movies, places, food, or books..."
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}