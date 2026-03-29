import { useState, useEffect } from 'react';
import { MessageSquare, Archive, Trash2, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { translations } from '../../lib/translations';
import type { Database } from '../../lib/database.types';

type Consultation = Database['public']['Tables']['consultations']['Row'];

interface ConsultationsListProps {
  onSelectConsultation: (consultation: Consultation) => void;
  onNewConsultation: () => void;
}

export function ConsultationsList({ onSelectConsultation, onNewConsultation }: ConsultationsListProps) {
  const { user } = useAuth();
  const { language } = useApp();
  const t = translations[language];
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    if (user) {
      loadConsultations();
    }
  }, [user, showArchived]);

  const loadConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', showArchived ? 'archived' : 'active')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status: 'archived' })
        .eq('id', id);

      if (error) throw error;
      await loadConsultations();
    } catch (error) {
      console.error('Error archiving consultation:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm(t.confirmDelete)) return;

    try {
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadConsultations();
    } catch (error) {
      console.error('Error deleting consultation:', error);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.consultations}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowArchived(false)}
              className={`text-sm font-medium transition ${
                !showArchived
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t.activeConsultations}
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`text-sm font-medium transition ${
                showArchived
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t.archivedConsultations}
            </button>
          </div>
        </div>

        <button
          onClick={onNewConsultation}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          {t.newConsultation}
        </button>
      </div>

      {consultations.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t.noConsultations}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t.startFirst}
          </p>
          <button
            onClick={onNewConsultation}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            {t.newConsultation}
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              onClick={() => onSelectConsultation(consultation)}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex gap-1">
                  {!showArchived && (
                    <button
                      onClick={(e) => handleArchive(e, consultation.id)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition opacity-0 group-hover:opacity-100"
                      title={t.archive}
                    >
                      <Archive className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, consultation.id)}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition opacity-0 group-hover:opacity-100"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {consultation.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(consultation.updated_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
