import { Navigation } from "@/components/Navigation";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Helper to format relative time
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export type ProjectRow = {
  id: string;
  title: string;
  description: string;
  author_id: string;
  required_skills: string[] | null;
  looking_for_skills: string[] | null;
  created_at: string;
};

type AuthorInfo = {
  id: string;
  full_name: string | null;
  major: string | null;
  avatar_url: string | null;
};

const popularSkills = [
  "Web Development", "Machine Learning", "UI/UX Design", "Data Science", 
  "Marketing", "Business Strategy", "Mobile Development", "Graphic Design"
];

const Discover = () => {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [authors, setAuthors] = useState<Record<string, AuthorInfo>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, description, author_id, required_skills, looking_for_skills, created_at")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching projects", error);
        setLoading(false);
        return;
      }
      setProjects(data || []);

      // Fetch author info for each unique author_id
      const uniqueAuthors = Array.from(new Set((data || []).map((p) => p.author_id)));
      const entries: [string, AuthorInfo][] = [];
      await Promise.all(
        uniqueAuthors.map(async (author_id) => {
          const { data: author } = await supabase.rpc("get_author_info", { author_id });
          if (author && author.length > 0) {
            const a = author[0] as AuthorInfo;
            entries.push([author_id, a]);
          } else {
            entries.push([author_id, { id: author_id, full_name: null, major: null, avatar_url: null }]);
          }
        })
      );
      setAuthors(Object.fromEntries(entries));
      setLoading(false);
    };

    fetchProjects();

    // Realtime: refresh on new projects
    const channel = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "projects" },
        (payload: any) => {
          setProjects((prev) => [payload.new as ProjectRow, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const projectCards = useMemo(() => {
    return projects.map((p) => {
      const author = authors[p.author_id];
      return (
        <ProjectCard
          key={p.id}
          id={p.id}
          title={p.title}
          description={p.description}
          author={{
            id: p.author_id,
            name: author?.full_name || "Unknown",
            major: author?.major || "",
            avatar: author?.avatar_url || undefined,
          }}
          skills={p.required_skills || []}
          lookingFor={p.looking_for_skills || []}
          timePosted={timeAgo(p.created_at)}
          interested={0}
          messages={0}
        />
      );
    });
  }, [projects, authors]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Projects</h1>
          <p className="text-muted-foreground">Find the perfect collaboration opportunity that matches your skills and interests</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search by keywords, skills, or project titles..." className="pl-10 h-12" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-48 h-12"><SelectValue placeholder="Project Stage" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea Stage</SelectItem>
                  <SelectItem value="development">In Development</SelectItem>
                  <SelectItem value="testing">Testing Phase</SelectItem>
                  <SelectItem value="launch">Ready to Launch</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-48 h-12"><SelectValue placeholder="Time Commitment" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">1-5 hours/week</SelectItem>
                  <SelectItem value="medium">5-15 hours/week</SelectItem>
                  <SelectItem value="high">15+ hours/week</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-12 px-4">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Popular Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">{skill}</Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">{loading ? "Loading projects..." : `Showing ${projects.length} projects`}</p>
          <Select defaultValue="recent">
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="relevant">Most Relevant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projectCards}
        </div>

        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Previous</Button>
            <Button variant="outline" size="sm" className="bg-primary text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;