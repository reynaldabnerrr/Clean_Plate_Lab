import React from 'react';
import { CplProvider } from './context/CplContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { OrderModal } from './components/OrderModal';
import { LanguageWelcomeModal } from './components/LanguageWelcomeModal';
import HomePage from './pages/HomePage';
import { analytics, trackEvent } from './lib/analytics';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Clean Plate Lab application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-[#F5F2EA] p-6 text-center">
          <div className="max-w-lg border-2 border-[#1E1E1E] bg-white p-8 shadow-[6px_6px_0_#1E1E1E]">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#647554]">System notice</p>
            <h1 className="mt-4 font-display text-3xl font-extrabold uppercase">This page could not be displayed.</h1>
            <button type="button" onClick={() => window.location.reload()} className="mt-7 min-h-12 bg-[#1E1E1E] px-6 text-xs font-bold uppercase tracking-wider text-white">Reload page</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [orderModalOpen, setOrderModalOpen] = React.useState(false);
  const [initialProteinTier, setInitialProteinTier] = React.useState(40);
  const [initialMealsPerDay, setInitialMealsPerDay] = React.useState(1);
  const [hasExplicitOrderDefaults, setHasExplicitOrderDefaults] = React.useState(false);

  React.useEffect(() => {
    trackEvent('page_view', { page_path: '/' });
  }, []);

  const handleBuild = (source, proteinTier, mealsPerDay = 1) => {
    analytics.builderOpened(source);
    if (proteinTier) setInitialProteinTier(proteinTier);
    setInitialMealsPerDay(mealsPerDay);
    setHasExplicitOrderDefaults(Boolean(proteinTier));
    setOrderModalOpen(true);
  };

  return (
    <ErrorBoundary>
      <CplProvider>
        <div className="min-h-screen bg-[var(--cpl-cream)] text-[var(--cpl-dark)]">
          <LanguageWelcomeModal />
          <Navbar onOpenOrder={() => handleBuild('navigation')} />
          <main id="main-content" tabIndex="-1" className="outline-none">
            <HomePage onBuild={handleBuild} />
          </main>
          <Footer />
          <OrderModal isOpen={orderModalOpen} onClose={() => setOrderModalOpen(false)} initialProteinTier={initialProteinTier} initialMealsPerDay={initialMealsPerDay} hasExplicitInitialValues={hasExplicitOrderDefaults} />
        </div>
      </CplProvider>
    </ErrorBoundary>
  );
}
