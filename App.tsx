import React, { useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import { EventsProvider } from './useEvents';
import { LoginForm } from './LoginForm';
import { NavMenu } from './NavMenu';
import { Dashboard } from './Dashboard';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { Routes, Route } from 'react-router-dom';
const CalendarPage = React.lazy(() => import('./CalendarPage').then(m => ({ default: m.CalendarPage }))); 
const EventsPage = React.lazy(() => import('./EventsPage').then(m => ({ default: m.EventsPage })));
const InvoicePage = React.lazy(() => import('./InvoicePage').then(m => ({ default: m.InvoicePage })));
const ContactDirectory = React.lazy(() => import('./ContactDirectory').then(m => ({ default: m.ContactDirectory })));
const AdminPanel = React.lazy(() => import('./AdminPanel').then(m => ({ default: m.AdminPanel })));
const IdeaBoardPage = React.lazy(() => import('./IdeaBoardPage').then(m => ({ default: m.IdeaBoardPage })));
const DocumentsPage = React.lazy(() => import('./DocumentsPage').then(m => ({ default: m.DocumentsPage })));
import { BackToTop } from './BackToTop';

function AppContent() {
  const { state } = useApp();
  const { currentUser, currentTab, isDarkMode } = state;

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (!currentUser) {
    return <LoginForm />;
  }

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'availability':
        return <AvailabilityCalendar />;
      case 'calendar':
        return <CalendarPage />;
      case 'concerts':
        return <EventsPage />;
      case 'contacts':
        return <ContactDirectory />;
      case 'ideas':
        return <IdeaBoardPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'admin':
        return currentUser.role === 'admin' ? <AdminPanel /> : <Dashboard />;
      case 'invoice':
        return <InvoicePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 dark:text-gray-100">
      <NavMenu />
      <main className="pb-20 md:pb-0">
        <React.Suspense fallback={<div className="p-4">Chargement...</div>}>
          {renderCurrentTab()}
        </React.Suspense>
        <BackToTop />
      </main>
    </div>
  );
}

function App() {
  return (
    <EventsProvider>
      <AppProvider>
        <Routes>
          <Route path="/concerts/:eventId" element={<AppContent />} />
          <Route path="*" element={<AppContent />} />
        </Routes>
      </AppProvider>
    </EventsProvider>
  );
}

export default App;
