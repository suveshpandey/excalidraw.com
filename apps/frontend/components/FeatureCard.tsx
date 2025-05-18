import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all duration-300">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-blue-100/80">{description}</p>
    </div>
  );
}