import { useState, useEffect } from 'react';
import { PersonaCard } from './PersonaCard';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../contexts/AppContext';
import { translations } from '../../lib/translations';
import type { Database } from '../../lib/database.types';

type Persona = Database['public']['Tables']['legal_personas']['Row'];

interface PersonaSelectorProps {
  onSelect: (persona: Persona, title: string) => void;
  onCancel: () => void;
}

export function PersonaSelector({ onSelect, onCancel }: PersonaSelectorProps) {
  const { language } = useApp();
  const t = translations[language];
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    loadPersonas();
  }, []);

  const loadPersonas = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_personas')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setPersonas(data || []);
    } catch (error) {
      console.error('Error loading personas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPersona && title.trim()) {
      onSelect(selectedPersona, title.trim());
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-600 dark:text-gray-400">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.newConsultation}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t.selectPersona}
        </p>
      </div>

      {!selectedPersona ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onSelect={setSelectedPersona}
            />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ar' ? 'المحامي المختار' : 'Selected Lawyer'}
              </label>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {language === 'ar' ? selectedPersona.name_ar : selectedPersona.name_en}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.consultationTitle}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                placeholder={language === 'ar' ? 'مثال: استشارة حول عقد عمل' : 'Example: Employment contract consultation'}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {t.startConsultation}
              </button>
              <button
                type="button"
                onClick={() => setSelectedPersona(null)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition"
              >
                {t.back}
              </button>
            </div>
          </div>
        </form>
      )}

      {!selectedPersona && (
        <div className="mt-6 text-center">
          <button
            onClick={onCancel}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition"
          >
            {t.cancel}
          </button>
        </div>
      )}
    </div>
  );
}
