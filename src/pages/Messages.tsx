import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Send, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Project = {
  id: string;
  title: string;
  description: string;
  author_id: string;
  required_skills: string[] | null;
  looking_for_skills: string[] | null;
  created_at: string;
};

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender_name?: string;
};

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [joinedProjects, setJoinedProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchJoinedProjects = async () => {
      // Get projects where user is either the author or has expressed interest
      const { data: ownedProjects } = await supabase
        .from("projects")
        .select("*")
        .eq("author_id", user.id);

      const { data: interestedProjects } = await supabase
        .from("project_interests")
        .select("project_id")
        .eq("user_id", user.id);

      if (interestedProjects?.length) {
        const projectIds = interestedProjects.map(pi => pi.project_id);
        const { data: interestProjects } = await supabase
          .from("projects")
          .select("*")
          .in("id", projectIds);

        const allProjects = [...(ownedProjects || []), ...(interestProjects || [])];
        // Remove duplicates
        const uniqueProjects = allProjects.filter((project, index, self) => 
          index === self.findIndex(p => p.id === project.id)
        );
        setJoinedProjects(uniqueProjects);
      } else {
        setJoinedProjects(ownedProjects || []);
      }
      setLoading(false);
    };

    fetchJoinedProjects();
  }, [user]);

  useEffect(() => {
    if (!selectedProject) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("project_messages")
        .select(`
          id,
          content,
          sender_id,
          created_at
        `)
        .eq("project_id", selectedProject.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      // Get sender names for messages
      const senderIds = Array.from(new Set(data.map(m => m.sender_id)));
      const messagesWithNames = await Promise.all(
        data.map(async (message) => {
          const { data: authorData } = await supabase.rpc("get_author_info", { 
            author_id: message.sender_id 
          });
          return {
            ...message,
            sender_name: authorData?.[0]?.full_name || "Unknown User"
          };
        })
      );

      setMessages(messagesWithNames);
    };

    fetchMessages();

    // Real-time subscription for new messages
    const channel = supabase
      .channel(`messages-${selectedProject.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "project_messages",
          filter: `project_id=eq.${selectedProject.id}`
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          const { data: authorData } = await supabase.rpc("get_author_info", { 
            author_id: newMessage.sender_id 
          });
          
          setMessages(prev => [...prev, {
            ...newMessage,
            sender_name: authorData?.[0]?.full_name || "Unknown User"
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedProject]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject || !user || sendingMessage) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase
        .from("project_messages")
        .insert([{
          project_id: selectedProject.id,
          sender_id: user.id,
          content: newMessage.trim()
        }]);

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">Sign in to view messages</h2>
              <p className="text-muted-foreground">Join projects and start collaborating with other users.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">
            Chat with your project collaborators
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Projects List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Your Projects ({joinedProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">Loading...</div>
                ) : joinedProjects.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                    <p>No projects yet</p>
                    <p className="text-sm">Join a project to start messaging</p>
                  </div>
                ) : (
                  joinedProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-4 cursor-pointer hover:bg-accent border-b border-border ${
                        selectedProject?.id === project.id ? "bg-accent" : ""
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <h3 className="font-medium text-sm mb-1 truncate">{project.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {(project.required_skills || []).slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {(project.required_skills?.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(project.required_skills?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            {selectedProject ? (
              <>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedProject.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[500px]">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${
                              message.sender_id === user?.id ? "flex-row-reverse" : ""
                            }`}
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs">
                                {message.sender_name?.charAt(0) || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`max-w-[70%] ${
                              message.sender_id === user?.id ? "text-right" : ""
                            }`}>
                              <div className="text-xs text-muted-foreground mb-1">
                                {message.sender_name} • {new Date(message.created_at).toLocaleTimeString()}
                              </div>
                              <div className={`p-3 rounded-lg text-sm ${
                                message.sender_id === user?.id
                                  ? "bg-primary text-white"
                                  : "bg-muted"
                              }`}>
                                {message.content}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  <Separator />

                  {/* Message Input */}
                  <div className="p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        disabled={sendingMessage}
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={!newMessage.trim() || sendingMessage}
                        size="sm"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a project</h3>
                  <p>Choose a project from the left to view its messages</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;