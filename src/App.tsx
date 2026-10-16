import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PasswordAnalyzer } from './components/PasswordAnalyzer';
import { PassphraseGenerator } from './components/PassphraseGenerator';
import { SecurityChecklist } from './components/SecurityChecklist';
import { EducationalSection } from './components/EducationalSection';
import { PrivacyModal } from './components/PrivacyModal';
import { Footer } from './components/Footer';
import { initializePrivacyMonitor } from './services/privacy';

export function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'generator' | 'checklist' | 'education'>('analyzer');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [analyzerInitialPassword, setAnalyzerInitialPassword] = useState<string>('');

  useEffect(() => {
    // Start active privacy isolation monitor
    initializePrivacyMonitor();
  }, []);

  const handleTestInAnalyzer = (passphrase: string) => {
    setAnalyzerInitialPassword(passphrase);
    setActiveTab('analyzer');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Top sticky navigation bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Dynamic Tab Panes */}
        {activeTab === 'analyzer' && (
          <div key={analyzerInitialPassword || 'empty-analyzer'}>
            <PasswordAnalyzer
              onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
              onNavigateToGenerator={() => setActiveTab('generator')}
              initialPassword={analyzerInitialPassword}
            />
          </div>
        )}

        {activeTab === 'generator' && (
          <div>
            <PassphraseGenerator onTestInAnalyzer={handleTestInAnalyzer} />
          </div>
        )}

        {activeTab === 'checklist' && (
          <div>
            <SecurityChecklist />
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            <EducationalSection />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)} />

      {/* Privacy Verification Modal */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}

export default App;
