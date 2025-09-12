import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { CreateProjectModal } from "./CreateProjectModal";
import { useState } from "react";
import { 
  Users, 
  FolderPlus, 
  Search, 
  User, 
  Home,
  MessageSquare,
  Plus,
  LogOut
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createProjectModalOpen, setCreateProjectModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">CampusCollab</h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 ${location.pathname === '/' ? 'bg-primary/10 text-primary' : ''}`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Link to="/discover">
              <Button 
                variant="ghost" 
                className={`flex items-center space-x-2 ${location.pathname === '/discover' ? 'bg-primary/10 text-primary' : ''}`}
              >
                <Search className="w-4 h-4" />
                <span>Discover</span>
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2"
              onClick={() => setCreateProjectModalOpen(true)}
            >
              <FolderPlus className="w-4 h-4" />
              <span>Post Project</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
            </Button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {profile?.full_name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setAuthModalOpen(true)}>
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-primary text-white hover:shadow-primary"
                  onClick={() => setAuthModalOpen(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
      />

      <CreateProjectModal
        open={createProjectModalOpen}
        onOpenChange={setCreateProjectModalOpen}
      />
    </nav>
  );
};

export { Navigation };