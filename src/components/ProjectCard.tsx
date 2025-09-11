import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageSquare, Users, Calendar } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  author: {
    name: string;
    major: string;
    avatar?: string;
  };
  skills: string[];
  lookingFor: string[];
  timePosted: string;
  interested: number;
  messages: number;
}

const ProjectCard = ({ 
  title, 
  description, 
  author, 
  skills, 
  lookingFor, 
  timePosted, 
  interested, 
  messages 
}: ProjectCardProps) => {
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
          <Button size="sm" className="bg-gradient-primary text-white hover:shadow-primary">
            Join Project
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;