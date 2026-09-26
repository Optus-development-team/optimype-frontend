import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

import { Overview } from '../../../pages/dashboard/views/overview/Overview';
const Agenda = () => <div className="p-6"><h1>Agenda Operativa</h1><p>Grilla diaria y semanal por barbero/estilista.</p></div>;
const Appointments = () => <div className="p-6"><h1>Listado de Citas</h1><p>Histórico con filtros y estados.</p></div>;
const Team = () => <div className="p-6"><h1>Equipo & Horarios</h1><p>Barberos, especialidades y sincronización con Google Calendar.</p></div>;
const Services = () => <div className="p-6"><h1>Catálogo de Servicios</h1><p>Duración, precio, comisiones.</p></div>;
const Products = () => <div className="p-6"><h1>Inventario de Productos</h1><p>Productos físicos y stock.</p></div>;
const Orders = () => <div className="p-6"><h1>Órdenes & Cobros</h1><p>Historial de cobros y generación express de QR.</p></div>;
const Customers = () => <div className="p-6"><h1>Directorio de Clientes</h1><p>Clientes registrados por WhatsApp.</p></div>;
import { Knowledge } from '../../../pages/dashboard/views/bot-ai/knowledge/Knowledge';
const LiveChats = () => <div className="p-6"><h1>Chats en Vivo</h1><p>Registro de conversaciones activas del bot.</p></div>;
const BusinessProfile = () => <div className="p-6"><h1>Perfil del Negocio</h1><p>Nombre del local, logo, zona horaria y moneda.</p></div>;

export const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0a1628]">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <main className="flex-1 overflow-y-auto w-full relative">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#1a2f4a] border-b border-gray-200 dark:border-gray-800">
          <img src="/OPTUSLOGO.png" alt="Optus Logo" className="h-8" />
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            
            {/* Calendar Module */}
            <Route path="calendar/agenda" element={<Agenda />} />
            <Route path="calendar/appointments" element={<Appointments />} />
            <Route path="calendar/team" element={<Team />} />

            {/* Commercial Module */}
            <Route path="commercial/services" element={<Services />} />
            <Route path="commercial/products" element={<Products />} />
            <Route path="commercial/orders" element={<Orders />} />

            {/* Customers Module */}
            <Route path="customers/directory" element={<Customers />} />

            {/* Bot AI Module */}
            <Route path="bot-ai/knowledge" element={<Knowledge />} />
            <Route path="bot-ai/live-chats" element={<LiveChats />} />

            {/* Settings Module */}
            <Route path="settings/business-profile" element={<BusinessProfile />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};
