import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <nav className="bg-background border-b border-border px-6 py-3 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <MessageSquare className="size-6 text-primary" />
        </div>
        <span className="text-xl font-bold">ChatApp</span>
      </Link>

      <div className="flex items-center gap-4">
        {authUser && (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex items-center gap-2 hover:bg-accent px-3 py-2 rounded-lg transition cursor-pointer">
                <Avatar className="size-8">
                  <AvatarImage src={authUser.profilePic} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {authUser.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium hidden sm:inline">{authUser.username}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex items-center w-full">
                  <User className="mr-2 size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
