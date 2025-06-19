import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginForm } from './components/LoginForm';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { ConcertManagement } from './components/ConcertManagement';
import { ContactDirectory } from './components/ContactDirectory';
import { AdminPanel } from './components/AdminPanel';

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
        {renderCurrentTab()}
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