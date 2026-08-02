import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CplProvider } from './context/CplContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandPillars } from './components/BrandPillars';
import { LabelGenerator } from './components/LabelGenerator';
import { MenuSection } from './components/MenuSection';
import { MacroCalculator } from './components/MacroCalculator';
import { CorporateCatering } from './components/CorporateCatering';
import { OrderModal } from './components/OrderModal';
import { BrandGuidelineModal } from './components/BrandGuidelineModal';
import { Footer } from './components/Footer';

function MainApp() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [guidelineOpen, setGuidelineOpen] = useState(false);

  const scrollToLabel = () => {
    const el = document.getElementById('label-generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cpl-cream)] text-[var(--cpl-dark)] font-sans">
      
      {/* Clean Navigation Bar */}
      <Navbar 
        onOpenOrder={() => setOrderOpen(true)}
        onOpenGuideline={() => setGuidelineOpen(true)}
      />

      {/* Hero Section */}
      <Hero 
        onOpenOrder={() => setOrderOpen(true)}
        onScrollToLabel={scrollToLabel}
      />

      {/* Brand 3 Core Pillars Section */}
      <BrandPillars />

      {/* Interactive CPL Product Label & Macro Inspector */}
      <LabelGenerator 
        onOpenOrder={() => setOrderOpen(true)}
      />

      {/* High Protein Weekly Menu Showcase */}
      <MenuSection 
        onSelectMeal={() => setOrderOpen(true)}
      />

      {/* Harris-Benedict Clinical Macro Calculator */}
      <MacroCalculator 
        onOpenOrder={() => setOrderOpen(true)}
      />

      {/* B2B & Office Corporate Catering Estimator */}
      <CorporateCatering 
        onOpenOrder={() => setOrderOpen(true)}
      />

      {/* Footer */}
      <Footer />

      {/* Order Inquiry Modal */}
      <OrderModal 
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
      />

      {/* Brand Guidelines Modal */}
      <BrandGuidelineModal
        isOpen={guidelineOpen}
        onClose={() => setGuidelineOpen(false)}
      />

      {/* Vercel Web Analytics */}
      <Analytics />

    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CPL App Error caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', background: '#F5F2EA', color: '#1E1E1E', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyCenter: 'center' }}>
          <div style={{ maxWidth: '600px', width: '100%', padding: '24px', background: '#FFFFFF', border: '2px solid #1E1E1E', boxShadow: '4px 4px 0px 0px #1E1E1E' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#647554', textTransform: 'uppercase', marginBottom: '8px' }}>
              Clean Plate Lab • System Diagnostic
            </h2>
            <p style={{ fontSize: '14px', color: '#1E1E1E', fontWeight: 'bold', marginBottom: '12px' }}>
              {this.state.error?.toString()}
            </p>
            <pre style={{ padding: '12px', background: '#EBF0E6', border: '1px solid #8A9C7A', fontSize: '11px', overflowX: 'auto', whiteSpace: 'pre-wrap', marginBottom: '16px', color: '#647554' }}>
              {this.state.errorInfo?.componentStack || this.state.error?.stack}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              style={{ padding: '10px 20px', background: '#8A9C7A', color: '#FFFFFF', border: '2px solid #1E1E1E', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <CplProvider>
        <MainApp />
      </CplProvider>
    </ErrorBoundary>
  );
}
