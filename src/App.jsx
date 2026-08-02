import React, { useState, useEffect } from 'react';
import { CplProvider } from './context/CplContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { BrandPillars } from './components/BrandPillars';
import { LabelGenerator } from './components/LabelGenerator';
import { MenuSection } from './components/MenuSection';
import { PackagingSection } from './components/PackagingSection';
import { MacroCalculator } from './components/MacroCalculator';
import { CorporateCatering } from './components/CorporateCatering';
import { OrderModal } from './components/OrderModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

function MainApp() {
  const [orderOpen, setOrderOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Check URL pathname for /admin routing
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setAdminOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    return () => window.removeEventListener('popstate', checkAdminRoute);
  }, []);

  const handleCloseAdmin = () => {
    setAdminOpen(false);
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleOpenAdminFromUrl = () => {
    setAdminOpen(true);
    window.history.pushState({}, '', '/admin');
  };

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

      {/* CPL Packaging & Freshness Standard */}
      <PackagingSection />

      {/* Harris-Benedict Clinical Macro Calculator */}
      <MacroCalculator 
        onOpenOrder={() => setOrderOpen(true)}
      />

      {/* B2B & Office Corporate Catering Estimator */}
      <CorporateCatering 
        onOpenOrder={() => setOrderOpen(true)}
      />

      {/* Footer */}
      <Footer 
        onOpenOrder={() => setOrderOpen(true)}
        onOpenAdmin={handleOpenAdminFromUrl}
      />

      {/* Order Inquiry Modal */}
      <OrderModal 
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
      />

      {/* Admin CMS Dashboard Modal - Accessible via /admin URL */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={handleCloseAdmin}
      />

    </div>
  );
}

export default function App() {
  return (
    <CplProvider>
      <MainApp />
    </CplProvider>
  );
}
