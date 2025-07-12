
import { Bell, Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onAskQuestion: () => void;
  onAuthClick: (mode: 'login' | 'register') => void;
}

export const Header = ({ onAskQuestion, onAuthClick }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">StackIt</h1>
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search questions..." 
                className="pl-10 w-80"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              onClick={onAskQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>

            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                3
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => onAuthClick('login')}
                className="text-gray-600 hover:text-gray-800"
              >
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => onAuthClick('register')}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
