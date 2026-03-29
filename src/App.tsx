import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { AuthPage } from './components/Auth/AuthPage';
import { Header } from './components/Layout/Header';
import { PersonaSelector } from './components/Personas/PersonaSelector';
import { ConsultationsList } from './components/Consultations/ConsultationsList';
import { ChatInterface } from './components/Chat/ChatInterface';
import { supabase } from './lib/supabase';
import type { Database } from './lib/database.types';

type Consultation = Database['public']['Tables']['consultations']['Row'];
type Persona = Database['public']['Tables']['legal_personas']['Row'];

type View = 'list' | 'new' | 'chat';

function MainApp() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>('list');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  const handleNewConsultation = async (persona: Persona, title: string) => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert({
          user_id: user!.id,
          persona_id: persona.id,
          title,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      setSelectedConsultation(data);
      setView('chat');
    } catch (error) {
      console.error('Error creating consultation:', error);
    }
  };

  const handleSelectConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setView('chat');
  };

  const handleBackToList = () => {
    setSelectedConsultation(null);
    setView('list');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main>
        {view === 'list' && (
          <ConsultationsList
            onSelectConsultation={handleSelectConsultation}
            onNewConsultation={() => setView('new')}
          />
        )}
        {view === 'new' && (
          <PersonaSelector
            onSelect={handleNewConsultation}
            onCancel={handleBackToList}
          />
        )}
        {view === 'chat' && selectedConsultation && (
          <ChatInterface
            consultation={selectedConsultation}
            onBack={handleBackToList}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </AppProvider>
  );
}
