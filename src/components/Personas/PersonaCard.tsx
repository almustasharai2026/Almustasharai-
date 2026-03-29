import { Scale, Users, Building, Briefcase, Building2, Shield, type LucideIcon } from 'lucide-react';
import type { Database } from '../../lib/database.types';
import { useApp } from '../../contexts/AppContext';

type Persona = Database['public']['Tables']['legal_personas']['Row'];

interface PersonaCardProps {
  persona: Persona;
  onSelect: (persona: Persona) => void;
}

const iconMap: Record<string, LucideIcon> = {
  'scale': Scale,
  'users': Users,
  'building': Building,
  'briefcase': Briefcase,
  'building-2': Building2,
  'shield': Shield,
};

export function PersonaCard({ persona, onSelect }: PersonaCardProps) {
  const { language } = useApp();
  const Icon = iconMap[persona.icon] || Scale;

  return (
    <button
      onClick={() => onSelect(persona)}
      className="w-full p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-start group"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
          <Icon className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {language === 'ar' ? persona.name_ar : persona.name_en}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {language === 'ar' ? persona.description_ar : persona.description_en}
          </p>
        </div>
      </div>
    </button>
  );
}
