import Navigation from "@/components/Navigation";
import ProjectCard from "@/components/ProjectCard";
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

const allProjects = [
  {
    title: "AI-Powered Sustainability Tracker",
    description: "Building a mobile app that uses machine learning to help students track and reduce their carbon footprint on campus.",
    author: { name: "Sarah Chen", major: "Computer Science" },
    skills: ["React Native", "Python", "ML"],
    lookingFor: ["Environmental Science", "UI/UX Design", "Data Analysis"],
    timePosted: "2 days ago",
    interested: 12,
    messages: 5
  },
  {
    title: "Campus Mental Health Support Chatbot",
    description: "Developing an AI chatbot to provide 24/7 mental health resources and support for university students.",
    author: { name: "Emily Watson", major: "Psychology" },
    skills: ["Psychology", "Research", "Content Writing"],
    lookingFor: ["Natural Language Processing", "Backend Development", "UI/UX"],
    timePosted: "1 day ago",
    interested: 18,
    messages: 7
  },
  {
    title: "Blockchain Voting System for Student Government",
    description: "Creating a secure, transparent voting platform for student elections using blockchain technology.",
    author: { name: "David Kim", major: "Political Science" },
    skills: ["Political Science", "Research", "Project Management"],
    lookingFor: ["Blockchain Development", "Cybersecurity", "Frontend"],
    timePosted: "4 days ago",
    interested: 9,
    messages: 3
  },
  {
    title: "Smart Campus Navigation AR App",
    description: "Building an augmented reality app to help students navigate campus buildings and find resources.",
    author: { name: "Maria Garcia", major: "Computer Engineering" },
    skills: ["AR Development", "Unity", "Mobile Development"],
    lookingFor: ["3D Modeling", "UX Research", "Marketing"],
    timePosted: "1 week ago",
    interested: 14,
    messages: 6
  },
  {
    title: "Sustainable Fashion Marketplace",
    description: "Creating a platform for students to buy, sell, and trade sustainable clothing and accessories.",
    author: { name: "Jordan Lee", major: "Business" },
    skills: ["Business Strategy", "Marketing", "E-commerce"],
    lookingFor: ["Web Development", "Graphic Design", "Supply Chain"],
    timePosted: "5 days ago",
    interested: 11,
    messages: 4
  },
  {
    title: "Campus Energy Monitoring Dashboard",
    description: "Developing a real-time dashboard to track and optimize energy usage across campus buildings.",
    author: { name: "Alex Thompson", major: "Environmental Engineering" },
    skills: ["Data Analysis", "Environmental Science", "IoT"],
    lookingFor: ["Full Stack Development", "Data Visualization", "Hardware"],
    timePosted: "3 days ago",
    interested: 7,
    messages: 2
  }
];

const popularSkills = [
  "Web Development", "Machine Learning", "UI/UX Design", "Data Science", 
  "Marketing", "Business Strategy", "Mobile Development", "Graphic Design"
];

const Discover = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Discover Projects</h1>
          <p className="text-muted-foreground">
            Find the perfect collaboration opportunity that matches your skills and interests
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Main Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search by keywords, skills, or project titles..." 
                className="pl-10 h-12"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Project Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea Stage</SelectItem>
                  <SelectItem value="development">In Development</SelectItem>
                  <SelectItem value="testing">Testing Phase</SelectItem>
                  <SelectItem value="launch">Ready to Launch</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Time Commitment" />
                </SelectTrigger>
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

          {/* Popular Skills */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Popular Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {allProjects.length} projects
          </p>
          <Select defaultValue="recent">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="relevant">Most Relevant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {allProjects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>

        {/* Pagination */}
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