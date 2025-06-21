import React, { useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import { LoginForm } from './LoginForm';
import { Navigation } from './Navigation';
import { Dashboard } from './Dashboard';
import { AvailabilityCalendar } from './AvailabilityCalendar';
const CalendarPage = React.lazy(() => import('./CalendarPage').then(m => ({ default: m.CalendarPage }))); 
const ConcertManagement = React.lazy(() => import('./ConcertManagement').then(m => ({ default: m.ConcertManagement })));
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
        return <ConcertManagement />;
      case 'contacts':
        return <ContactDirectory />;
      case 'ideas':
        return <IdeaBoardPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'admin':
        return currentUser.role === 'admin' ? <AdminPanel /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 dark:text-gray-100">
      <Navigation />
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
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;