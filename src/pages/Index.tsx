import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, TrendingUp } from "lucide-react";

const mockProjects = [
  {
    title: "AI-Powered Sustainability Tracker",
    description: "Building a mobile app that uses machine learning to help students track and reduce their carbon footprint on campus. Looking for passionate developers and environmental science students!",
    author: {
      name: "Sarah Chen",
      major: "Computer Science",
      avatar: "/placeholder.svg"
    },
    skills: ["React Native", "Python", "ML"],
    lookingFor: ["Environmental Science", "UI/UX Design", "Data Analysis"],
    timePosted: "2 days ago",
    interested: 12,
    messages: 5
  },
  {
    title: "Campus Food Waste Reduction Platform",
    description: "Creating a platform to connect dining halls with student organizations to redistribute surplus food. Need business students for market research and CS students for development.",
    author: {
      name: "Marcus Johnson",
      major: "Business Administration",
      avatar: "/placeholder.svg"
    },
    skills: ["Business Strategy", "Market Research"],
    lookingFor: ["Web Development", "Social Impact", "Operations"],
    timePosted: "1 week ago",
    interested: 8,
    messages: 3
  },
  {
    title: "VR Campus Tour for Prospective Students",
    description: "Developing an immersive VR experience showcasing our university to prospective students worldwide. This project combines cutting-edge technology with storytelling.",
    author: {
      name: "Alex Rivera",
      major: "Media Arts",
      avatar: "/placeholder.svg"
    },
    skills: ["3D Modeling", "Video Production"],
    lookingFor: ["Unity Development", "VR Programming", "Marketing"],
    timePosted: "3 days ago", 
    interested: 15,
    messages: 8
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      {/* Featured Projects Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending Projects
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Discover Amazing Collaborations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join innovative projects that are making a real impact on campus and beyond
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search projects by skills, keywords, or majors..." 
                className="pl-10 h-12"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 h-12 px-6">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              Load More Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-card rounded-3xl p-8 md:p-12 shadow-card">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Active Projects</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
                <div className="text-muted-foreground">Students Connected</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
