import { Button } from "../components/ui/button";
import { MousePointerSquareDashed, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <MousePointerSquareDashed className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg text-gray-900">Excaliboard</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              The collaborative whiteboard tool that brings your team's ideas to life in real-time.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              {["Features", "Pricing", "Use Cases", "Integrations", "Updates"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Press", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              {["Documentation", "Tutorials", "Support", "API", "Community"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Excaliboard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}