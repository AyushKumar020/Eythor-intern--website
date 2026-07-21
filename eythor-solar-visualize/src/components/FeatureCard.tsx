
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  highlightColor?: 'blue' | 'white' | 'gradient' | 'purple';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  className = '',
  highlightColor = 'blue'
}) => {
  const getHighlightClasses = () => {
    switch (highlightColor) {
      case 'white':
        return 'feature-icon-white';
      case 'gradient':
        return 'bg-gradient-to-br from-eythor-blue/20 to-white/5 p-3.5 rounded-xl text-white';
      case 'purple':
        return 'bg-eythor-blue/20 p-3.5 rounded-xl text-eythor-blue';
      case 'blue':
      default:
        return 'feature-icon';
    }
  };
  
  return (
    <div className={`tech-card p-7 hover:translate-y-[-5px] group ${className}`}>
      <div className={`${getHighlightClasses()} w-16 h-16 flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300`}>
        <Icon size={26} />
      </div>
      <h3 className="text-xl font-heading font-semibold mb-3 group-hover:text-gradient transition-all duration-300">{title}</h3>
      <p className="text-white/70 group-hover:text-white/90 transition-all duration-300 leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
