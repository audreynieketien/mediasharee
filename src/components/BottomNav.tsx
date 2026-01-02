import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, PlusSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function BottomNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;

  const isCreator = user.role === 'creator';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background pb-safe">
      <div className={`grid h-full ${isCreator ? 'grid-cols-4' : 'grid-cols-3'}`}>
        <NavLink
            to="/"
            end
            className={({ isActive }) =>
                cn(
                    "inline-flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "text-foreground"
                )
            }
        >
            <Home className="h-6 w-6" />
            <span className="text-xs font-medium">Home</span>
        </NavLink>
        
        <NavLink
            to="/search"
            className={({ isActive }) =>
                cn(
                    "inline-flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "text-foreground"
                )
            }
        >
            <Search className="h-6 w-6" />
            <span className="text-xs font-medium">Search</span>
        </NavLink>
        
        {isCreator && (
            <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    cn(
                        "inline-flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
                        isActive && "text-foreground"
                    )
                }
            >
                <PlusSquare className="h-6 w-6" />
                <span className="text-xs font-medium">Dashboard</span>
            </NavLink>
        )}

        <div className="inline-flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground">
            <DropdownMenu>
                <DropdownMenuTrigger className="flex flex-col items-center justify-center gap-1 outline-none">
                     <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatarUrl} alt={user.username || 'User'} />
                        <AvatarFallback>{(user.username || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                     <span className="text-xs font-medium">Account</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="top" className="w-56 mb-2">
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
    </nav>
  );
}
