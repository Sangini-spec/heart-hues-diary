import { Button } from '@/components/ui/button';
import { 
  Home, 
  PenTool, 
  Calendar, 
  BarChart3, 
  Heart,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export type TabType = 'home' | 'journal' | 'timeline' | 'analytics' | 'breathe';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems = [
  { id: 'home' as TabType, label: 'Home', icon: Home },
  { id: 'journal' as TabType, label: 'Journal', icon: PenTool },
  { id: 'timeline' as TabType, label: 'Timeline', icon: Calendar },
  { id: 'analytics' as TabType, label: 'Insights', icon: BarChart3 },
  { id: 'breathe' as TabType, label: 'Breathe', icon: Heart },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: TabType) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-center space-x-1 p-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabClick(item.id)}
              className="flex items-center gap-2 rounded-full px-4 py-2"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 right-4 z-50 rounded-full w-10 h-10 p-0"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 flex items-center justify-center">
            <nav className="grid grid-cols-1 gap-4 p-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleTabClick(item.id)}
                    className="flex items-center gap-3 w-48 justify-start rounded-2xl"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-30">
        <nav className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTabClick(item.id)}
                className="flex flex-col items-center gap-1 h-12 w-12 p-1 rounded-xl"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </>
  );
}