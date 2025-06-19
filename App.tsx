import React from 'react';
import { AppProvider, useApp } from './AppContext';
import { LoginForm } from './LoginForm';
import { Navigation } from './Navigation';
import { Dashboard } from './Dashboard';
import { AvailabilityCalendar } from './AvailabilityCalendar';
const ConcertManagement = React.lazy(() => import('./ConcertManagement').then(m => ({ default: m.ConcertManagement })));
const ContactDirectory = React.lazy(() => import('./ContactDirectory').then(m => ({ default: m.ContactDirectory })));
const AdminPanel = React.lazy(() => import('./AdminPanel').then(m => ({ default: m.AdminPanel })));
import { BackToTop } from './BackToTop';

function AppContent() {
  const { state } = useApp();
  const { currentUser, currentTab } = state;

  if (!currentUser) {
    return <LoginForm />;
  }

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'availability':
        return <AvailabilityCalendar />;
      case 'concerts':
        return <ConcertManagement />;
      case 'contacts':
        return <ContactDirectory />;
      case 'admin':
        return currentUser.role === 'admin' ? <AdminPanel /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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