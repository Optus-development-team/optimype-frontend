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
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

const navItems = [
  {
    titleKey: 'overview',
    path: '/dashboard/overview',
    icon: <LayoutDashboard size={20} />
  },
  {
    titleKey: 'calendar',
    icon: <Calendar size={20} />,
    subItems: [
      { titleKey: 'agenda', path: '/dashboard/calendar/agenda' },
      { titleKey: 'appointments', path: '/dashboard/calendar/appointments' },
      { titleKey: 'team', path: '/dashboard/calendar/team' },
    ]
  },
  {
    titleKey: 'commercial',
    icon: <Scissors size={20} />,
    subItems: [
      { titleKey: 'services', path: '/dashboard/commercial/services' },
      { titleKey: 'products', path: '/dashboard/commercial/products' },
      { titleKey: 'orders', path: '/dashboard/commercial/orders' },
    ]
  },
  {
    titleKey: 'customers',
    path: '/dashboard/customers/directory',
    icon: <Users size={20} />
  },
  {
    titleKey: 'agent',
    icon: <MessageSquare size={20} />,
    subItems: [
      { titleKey: 'knowledge', path: '/dashboard/bot-ai/knowledge' },
      { titleKey: 'liveChats', path: '/dashboard/bot-ai/live-chats' },
    ]
  },
  {
    titleKey: 'settings',
    path: '/dashboard/settings/business-profile',
    icon: <Settings size={20} />
  }
];

const SidebarItem = ({ item, isMobile, closeMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  if (item.subItems) {
    return (
      <div className="sidebar-group">
        <button 
          className={`sidebar-link ${isOpen ? 'active-group' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="sidebar-link-content">
            {item.icon}
            <span>{t(`dashboard.nav.${item.titleKey}`)}</span>
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
                {t(`dashboard.nav.${sub.titleKey}`)}
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
        <span>{t(`dashboard.nav.${item.titleKey}`)}</span>
      </div>
    </NavLink>
  );
};

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logout, user } = usePrivy();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
          <img src="/OPTUSLOGO.png" alt="Optimype" className="sidebar-logo" />
          <button className="mobile-close-btn" onClick={() => setIsMobileOpen(false)} aria-label={t('dashboard.user.closeMenu')}>
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
              <span className="user-name">{user?.email?.address || t('dashboard.user.fallbackName')}</span>
              <span className="user-role">{t('dashboard.user.role')}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>{t('dashboard.user.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
