import React, { useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import { EventsProvider } from './useEvents';
import { InvoicesProvider } from './useInvoices';
import { NotificationsProvider, NotificationList } from './useNotifications';
import { LoginForm } from './LoginForm';
import { Header } from './Header';
import { Role } from './roles';
import { NotificationsPage } from './NotificationsPage';
import HomePage from './HomePage';
const Dashboard = React.lazy(() => import('./Dashboard').then(m => ({ default: m.Dashboard })));
const AvailabilityCalendar = React.lazy(() => import('./AvailabilityCalendar').then(m => ({ default: m.AvailabilityCalendar })));
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
const CalendarPage = React.lazy(() => import('./CalendarPage').then(m => ({ default: m.CalendarPage }))); 
const EventsPage = React.lazy(() => import('./EventsPage').then(m => ({ default: m.EventsPage })));
const InvoicePage = React.lazy(() => import('./InvoicePage').then(m => ({ default: m.InvoicePage })));
const ContactDirectory = React.lazy(() => import('./ContactDirectory').then(m => ({ default: m.ContactDirectory })));
const AdminPanel = React.lazy(() => import('./AdminPanel').then(m => ({ default: m.AdminPanel })));
const IdeaBoardPage = React.lazy(() => import('./IdeaBoardPage').then(m => ({ default: m.IdeaBoardPage })));
const DocumentsPage = React.lazy(() => import('./DocumentsPage').then(m => ({ default: m.DocumentsPage })));
import { BackToTop } from './BackToTop';

function AppContent() {
  const { state, dispatch } = useApp();
  const { currentUser, currentTab, isDarkMode } = state;
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (location.pathname === '/ressources/factures') {
      dispatch({ type: 'SET_TAB', payload: 'invoice' });
    } else if (location.pathname === '/dashboard') {
      dispatch({ type: 'SET_TAB', payload: 'dashboard' });
    }
  }, [location.pathname, dispatch]);

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
        return currentUser.role === Role.Leader ? <AdminPanel /> : <Dashboard />;
      case 'invoice':
        return <InvoicePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-light dark:bg-dark dark:text-light">
      <Header />
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
    <NotificationsProvider>
      <EventsProvider>
        <InvoicesProvider>
          <AppProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<AppContent />} />
              <Route path="/concerts/:eventId" element={<AppContent />} />
              <Route path="/ressources/factures" element={<AppContent />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <NotificationList />
          </AppProvider>
        </InvoicesProvider>
      </EventsProvider>
    </NotificationsProvider>
  );
}

export default App;
