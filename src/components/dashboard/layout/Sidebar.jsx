import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Clock, 
  Scissors, 
  Package, 
  CreditCard, 
  MessageSquare, 
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import './Sidebar.css';

const navItems = [
  {
    title: 'Overview',
    path: '/dashboard/overview',
    icon: <LayoutDashboard size={20} />
  },
  {
    title: 'Agenda',
    icon: <Calendar size={20} />,
    subItems: [
      { title: 'Agenda Diaria', path: '/dashboard/calendar/agenda' },
      { title: 'Citas', path: '/dashboard/calendar/appointments' },
      { title: 'Equipo & Horarios', path: '/dashboard/calendar/team' },
    ]
  },
  {
    title: 'Comercial',
    icon: <Scissors size={20} />,
    subItems: [
      { title: 'Servicios', path: '/dashboard/commercial/services' },
      { title: 'Productos', path: '/dashboard/commercial/products' },
      { title: 'Órdenes', path: '/dashboard/commercial/orders' },
    ]
  },
  {
    title: 'Clientes',
    path: '/dashboard/customers/directory',
    icon: <Users size={20} />
  },
  {
    title: 'Agente IA',
    icon: <MessageSquare size={20} />,
    subItems: [
      { title: 'Base de Conocimiento', path: '/dashboard/bot-ai/knowledge' },
      { title: 'Chats en Vivo', path: '/dashboard/bot-ai/live-chats' },
    ]
  },
  {
    title: 'Configuración',
    path: '/dashboard/settings/business-profile',
    icon: <Settings size={20} />
  }
];

const SidebarItem = ({ item, isMobile, closeMobile }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (item.subItems) {
    return (
      <div className="sidebar-group">
        <button 
          className={`sidebar-link ${isOpen ? 'active-group' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="sidebar-link-content">
            {item.icon}
            <span>{item.title}</span>
          </div>
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {isOpen && (
          <div className="sidebar-subitems">
            {item.subItems.map((sub, index) => (
              <NavLink 
                key={index} 
                to={sub.path} 
                className={({isActive}) => `sidebar-sublink ${isActive ? 'active' : ''}`}
                onClick={isMobile ? closeMobile : undefined}
              >
                {sub.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink 
      to={item.path} 
      className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
      onClick={isMobile ? closeMobile : undefined}
    >
      <div className="sidebar-link-content">
        {item.icon}
        <span>{item.title}</span>
      </div>
    </NavLink>
  );
};

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logout, user } = usePrivy();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>
      )}
      
      <aside className={`dashboard-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <img src="/OPTUSLOGO.png" alt="Optus Logo" className="sidebar-logo" />
          <button className="mobile-close-btn" onClick={() => setIsMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <SidebarItem 
              key={index} 
              item={item} 
              isMobile={true} 
              closeMobile={() => setIsMobileOpen(false)} 
            />
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.email?.address?.charAt(0).toUpperCase() || 'O'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.email?.address || 'Admin'}</span>
              <span className="user-role">Administrador</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
