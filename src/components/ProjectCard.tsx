import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Users, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProjectCardProps {
  id?: string;
  title: string;
  description: string;
  author: {
    id?: string;
    name: string;
    major: string;
    avatar?: string;
  };
  skills: string[];
  lookingFor: string[];
  timePosted: string;
  interested: number;
  messages: number;
  isInterested?: boolean;
  onInterestToggle?: () => void;
}

const ProjectCard = ({ 
  id,
  title, 
  description, 
  author, 
  skills, 
  lookingFor, 
  timePosted, 
  interested, 
  messages,
  isInterested = false,
  onInterestToggle
}: ProjectCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isInterestedState, setIsInterestedState] = useState(isInterested);

  const handleJoinProject = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join projects",
        variant: "destructive"
      });
      return;
    }

    if (!id) {
      toast({
        title: "Unavailable",
        description: "This project cannot be joined right now.",
        variant: "destructive"
      });
      return;
    }

    if (author.id === user.id) {
      toast({
        title: "Cannot join your own project",
        description: "You cannot join a project you created",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      if (isInterestedState) {
        // Remove interest
        const { error } = await supabase
          .from('project_interests')
          .delete()
          .eq('project_id', id)
          .eq('user_id', user.id);

        if (error) throw error;
        setIsInterestedState(false);
        toast({ title: "Removed from interested list" });
      } else {
        // Add interest
        const { error } = await supabase
          .from('project_interests')
          .insert([
            {
              project_id: id,
              user_id: user.id,
            },
          ]);

        if (error) throw error;
        setIsInterestedState(true);
        toast({ title: "Added to interested list!" });
      }
      
      onInterestToggle?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="bg-gradient-card border-border shadow-card hover:shadow-hover transition-all duration-300 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-primary text-white">
                {author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">
                by {author.name} • {author.major}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-foreground leading-relaxed">{description}</p>
        
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Project Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary" 
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Looking for:</h4>
          <div className="flex flex-wrap gap-2">
            {lookingFor.map((skill) => (
              <Badge 
                key={skill} 
                variant="outline" 
                className="border-secondary text-secondary-foreground hover:bg-secondary/10"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-border/50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{timePosted}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{interested} interested</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{messages} messages</span>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-primary text-white hover:shadow-primary"
            onClick={handleJoinProject}
            disabled={loading}
            variant={isInterestedState ? "outline" : "default"}
          >
            {loading ? "..." : isInterestedState ? "Interested ✓" : "Join Project"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export { ProjectCard };