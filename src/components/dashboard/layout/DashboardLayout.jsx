import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';

import { Overview } from '../../../pages/dashboard/views/overview/Overview';
import { Knowledge } from '../../../pages/dashboard/views/bot-ai/knowledge/Knowledge';

// Views that are not built yet: a title and a one-line description, in the active language
const Placeholder = ({ view }) => {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <h1>{t(`dashboard.views.${view}.title`)}</h1>
      <p>{t(`dashboard.views.${view}.text`)}</p>
    </div>
  );
};

export const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0a1628]">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <main className="flex-1 overflow-y-auto w-full relative">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1a2f4a] border-b border-gray-200 dark:border-gray-800">
          <img src="/OPTUSLOGO.png" alt="Optimype" className="h-8" />
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label={t('dashboard.user.openMenu')}
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            
            {/* Calendar Module */}
            <Route path="calendar/agenda" element={<Placeholder view="agenda" />} />
            <Route path="calendar/appointments" element={<Placeholder view="appointments" />} />
            <Route path="calendar/team" element={<Placeholder view="team" />} />

            {/* Commercial Module */}
            <Route path="commercial/services" element={<Placeholder view="services" />} />
            <Route path="commercial/products" element={<Placeholder view="products" />} />
            <Route path="commercial/orders" element={<Placeholder view="orders" />} />

            {/* Customers Module */}
            <Route path="customers/directory" element={<Placeholder view="customers" />} />

            {/* Bot AI Module */}
            <Route path="bot-ai/knowledge" element={<Knowledge />} />
            <Route path="bot-ai/live-chats" element={<Placeholder view="liveChats" />} />

            {/* Settings Module */}
            <Route path="settings/business-profile" element={<Placeholder view="businessProfile" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};
