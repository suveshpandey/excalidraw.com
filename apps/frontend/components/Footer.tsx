import { MousePointerSquareDashed, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/10">
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full"></div>
                <MousePointerSquareDashed className="h-6 w-6 text-blue-400 relative z-10" />
              </div>
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Excaliboard
              </span>
            </div>
            <p className="text-blue-100/80 text-sm mb-4">
              The collaborative canvas tool that brings your team's ideas to life in real-time.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-blue-100/60 hover:text-blue-300 transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-blue-100/60 hover:text-blue-300 transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-blue-100/60 hover:text-blue-300 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-blue-300 tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "Use Cases", "Integrations", "Updates"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-blue-100/80 hover:text-blue-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-blue-300 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Press", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-blue-100/80 hover:text-blue-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-blue-300 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {["Documentation", "Tutorials", "Support", "API", "Community"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-blue-100/80 hover:text-blue-300 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-blue-100/60 text-sm text-center">
            © {new Date().getFullYear()} Excaliboard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}