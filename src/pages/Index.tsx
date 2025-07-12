
import { useState } from "react";
import { Header } from "@/components/Header";
import { QuestionList } from "@/components/QuestionList";
import { QuestionDetail } from "@/components/QuestionDetail";
import { AskQuestionModal } from "@/components/AskQuestionModal";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleQuestionClick = (id: string) => {
    setSelectedQuestionId(id);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedQuestionId(null);
  };

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAskQuestion={() => setShowAskModal(true)}
        onAuthClick={handleAuthClick}
      />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {currentView === 'list' ? (
          <QuestionList onQuestionClick={handleQuestionClick} />
        ) : (
          <QuestionDetail 
            questionId={selectedQuestionId!}
            onBack={handleBackToList}
          />
        )}
      </main>

      <AskQuestionModal 
        open={showAskModal}
        onClose={() => setShowAskModal(false)}
      />

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
      />
    </div>
  );
};

export default Index;
