import { useState } from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { useApp } from '../../contexts/AppContext';
import { translations } from '../../lib/translations';
import { Scale, Moon, Sun, Globe } from 'lucide-react';

export function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);
  const { language, setLanguage, theme, toggleTheme } = useApp();
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.appName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-md"
            title={t.language}
          >
            <Globe className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-md"
            title={theme === 'light' ? t.darkMode : t.lightMode}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto mt-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-start">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {language === 'ar'
                ? 'استشارات قانونية ذكية بلمسة واحدة'
                : 'Smart Legal Consultations at Your Fingertips'
              }
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {language === 'ar'
                ? 'احصل على استشارات قانونية متخصصة من 6 محامين ذكاء اصطناعي في مختلف المجالات القانونية. ابدأ الآن برصيد مجاني 100 استشارة!'
                : 'Get specialized legal consultations from 6 AI lawyers in various legal fields. Start now with 100 free consultation credits!'
              }
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">6</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? 'محامين متخصصين' : 'Specialized Lawyers'}
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">100</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {language === 'ar' ? 'رصيد مجاني' : 'Free Credits'}
                </div>
              </div>
            </div>
          </div>

          <div>
            {isSignIn ? (
              <SignIn onToggle={() => setIsSignIn(false)} />
            ) : (
              <SignUp onToggle={() => setIsSignIn(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
