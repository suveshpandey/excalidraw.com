"use client";

import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-50 rounded-bl-[100px] opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-50 rounded-tr-[100px] opacity-70"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className={`lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 transition-all duration-1000 transform ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
              Collaborate on Ideas <span className="text-blue-600">Together</span>, in Real-time
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Experience the power of real-time canvas sharing. Draw, design, and collaborate with your team, no matter where they are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg shadow-lg transition-all transform hover:translate-y-[-2px]">
                <Link href="/auth">Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="group border-blue-200 hover:border-blue-400 px-8 py-6 rounded-lg text-lg">
                <Link href="#demo" className="flex items-center">
                  See Demo
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
          
          <div className={`lg:w-1/2 transition-all duration-1000 delay-300 transform ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
              
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <div className="h-10 bg-gray-50 flex items-center px-4 border-b border-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                <div className="aspect-video bg-blue-50 p-4 relative">
                  {/* Simulated canvas with drawing elements */}
                  <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full border-2 border-blue-400"></div>
                  <div className="absolute bottom-1/4 right-1/3 w-32 h-16 rounded-lg border-2 border-blue-500"></div>
                  <div className="absolute top-1/2 right-1/4 w-24 h-2 bg-blue-600 rounded"></div>
                  <div className="absolute top-1/4 right-1/2 w-2 h-24 bg-blue-600 rounded"></div>
                  
                  {/* Cursor indicators */}
                  <div className="absolute top-1/3 left-1/4 w-5 h-5 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-70">
                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs bg-red-500 text-white px-1 rounded">User 1</span>
                  </div>
                  <div className="absolute bottom-1/4 right-1/3 w-5 h-5 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-70">
                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs bg-green-500 text-white px-1 rounded">User 2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}