import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut, Search } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useState, useEffect } from 'react';

import logo from '../assets/logo.png';

export function TopHeader() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="Photoshare" className="size-8 object-contain dark:invert" />
          <span className="font-serif text-2xl font-bold tracking-tight" style={{ fontFamily: '"Aguafina Script", cursive' }}>MediaSharee</span>
        </div>

        {/* Search Bar Placeholder - will be functional later or only on search tab? 
            PRD says Search Bar in Header for Desktop. */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
             <div className="w-full relative">
                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                    type="search"
                    placeholder="Search users, tags, location..."
                    className="pl-8 bg-muted/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                        }
                    }}
                 />
             </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user.role === 'creator' && (
            <div className="flex items-center gap-2">
                <Button 
                    variant="default" 
                    size="sm" 
                    className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
                    onClick={() => navigate('/dashboard')}
                >
                    Dashboard
                </Button>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                  Creator
                </Badge>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.username || 'User'} />
                        <AvatarFallback>{(user.username || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.username || 'Unknown User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email || 'No email'}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
