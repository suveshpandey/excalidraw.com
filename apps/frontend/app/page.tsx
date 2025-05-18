"use client"

import { Button } from "../components/ui/button";
import { MousePointerSquareDashedIcon, PencilRuler, Share2, Users, Zap } from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "../components/FeatureCard";
import { HeroSection } from "../components/HeroSection";
import { Footer } from "../components/Footer";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if(token !== null && token !== "") {
      router.push("/dashboard");
    }
  
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <div className="w-full md:w-[80%] lg:w-[70%] mx-auto flex justify-between px-4 sm:px-6 lg:px-8 py-4 z-50">
        <div className="flex items-center">
          <div>
            <MousePointerSquareDashedIcon className="h-8 w-8 text-blue-400 relative z-10" />
          </div>
          <span className="ml-3 font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 cursor-pointer">
            Excaliboard
          </span>
        </div>
        <div>
          <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white">
            <Link href="/auth">Sign Up</Link>
          </Button>
        </div>
      </div>

      <HeroSection />
      
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Why Choose Excaliboard?
          </h2>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto">
            The perfect whiteboard tool for teams and individuals to bring ideas to life
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<PencilRuler className="h-8 w-8 text-blue-400" />}
            title="Intuitive Drawing"
            description="Create sketches, diagrams, and illustrations with our easy-to-use tools. No learning curve required."
          />
          <FeatureCard 
            icon={<Share2 className="h-8 w-8 text-blue-400" />}
            title="Real-time Sharing"
            description="Collaborate with teammates in real-time. See changes as they happen, no matter where you are."
          />
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-blue-400" />}
            title="Team Collaboration"
            description="Perfect for remote teams, brainstorming sessions, and collaborative design work."
          />
        </div>
      </section>
      
      <section className="py-16 px-4 bg-white/5 backdrop-blur-md border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 transform transition-all duration-500 hover:scale-105">
                <div className="aspect-video bg-blue-900/20 rounded-xl overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-4/5 h-4/5 border-2 border-dashed border-blue-400/50 rounded-lg flex items-center justify-center">
                        <p className="text-blue-300 font-medium">Canvas Preview</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Live
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-4 text-white">Experience Seamless Collaboration</h2>
              <p className="text-blue-100/80 mb-6">
                No more emailing files back and forth or waiting for someone to finish their part. With Excaliboard, everyone can contribute simultaneously, making teamwork efficient and enjoyable.
              </p>
              <ul className="space-y-3 mb-8">
                {["Create and share boards instantly", "Leave comments and feedback", "Export in multiple formats", "Access history and revisions"].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
                      <span className="text-blue-400 text-sm">✓</span>
                    </div>
                    <span className="text-blue-100">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all">
                <Link href="/auth">Try It For Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            Ready to Transform Your Ideas?
          </h2>
          <p className="text-xl text-blue-100/80 mb-8">
            Join thousands of teams who use Excaliboard to collaborate and create amazing things together.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all transform hover:scale-105">
            <Link href="/auth">Get Started Now</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}