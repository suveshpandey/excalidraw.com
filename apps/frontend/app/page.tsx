import { Button } from "../components/ui/button";
import { PencilRuler, Share2, Users, Zap } from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "../components/feature-card";
import { HeroSection } from "../components/hero-section";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Choose Excaliboard?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The perfect whiteboard tool for teams and individuals to bring ideas to life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<PencilRuler className="h-8 w-8 text-blue-500" />}
            title="Intuitive Drawing"
            description="Create sketches, diagrams, and illustrations with our easy-to-use tools. No learning curve required."
          />
          <FeatureCard 
            icon={<Share2 className="h-8 w-8 text-blue-500" />}
            title="Real-time Sharing"
            description="Collaborate with teammates in real-time. See changes as they happen, no matter where you are."
          />
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-blue-500" />}
            title="Team Collaboration"
            description="Perfect for remote teams, brainstorming sessions, and collaborative design work."
          />
        </div>
      </section>
      
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-white p-4 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-105">
                <div className="aspect-video bg-blue-100 rounded-md overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-4/5 h-4/5 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center">
                        <p className="text-blue-500 font-medium">Canvas Preview</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Live
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Experience Seamless Collaboration</h2>
              <p className="text-gray-600 mb-6">
                No more emailing files back and forth or waiting for someone to finish their part. With Excaliboard, everyone can contribute simultaneously, making teamwork efficient and enjoyable.
              </p>
              <ul className="space-y-3 mb-8">
                {["Create and share boards instantly", "Leave comments and feedback", "Export in multiple formats", "Access history and revisions"].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <span className="text-blue-500 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all">
                <Link href="/auth">Try It For Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to Transform Your Ideas?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of teams who use Excaliboard to collaborate and create amazing things together.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all transform hover:scale-105">
            <Link href="/auth">Get Started Now</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}