import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  DollarSign, 
  MessageCircle, 
  RefreshCcw,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  CircleDashed,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Overview.css';

const KPICard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className={`kpi-card ${colorClass}`}>
    <div className="kpi-icon-wrapper">
      <Icon size={24} />
    </div>
    <div className="kpi-content">
      <h3 className="kpi-title">{title}</h3>
      <div className="kpi-value">{value}</div>
      <p className="kpi-subtitle">{subtitle}</p>
    </div>
  </div>
);

const AppointmentItem = ({ time, customer, service, staff, status }) => {
  const { t } = useTranslation();

  return (
  <div className="appointment-item">
    <div className="appointment-time">
      <Clock size={16} />
      <span>{time}</span>
    </div>
    <div className="appointment-details">
      <h4 className="customer-name">{customer}</h4>
      <div className="service-info">
        <Scissors size={14} />
        <span>{service} {t('dashboard.overview.upcoming.with')} {staff}</span>
      </div>
    </div>
    <div className="appointment-status">
      {status === 'confirmed' ? (
        <span className="badge badge-success"><CheckCircle2 size={14}/> {t('dashboard.overview.upcoming.confirmed')}</span>
      ) : (
        <span className="badge badge-warning"><CircleDashed size={14}/> {t('dashboard.overview.upcoming.pending')}</span>
      )}
    </div>
  </div>
  );
};

const BotFeedItem = ({ time, action, description, type }) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'booking': return <CalendarCheck size={16} />;
      case 'query': return <MessageCircle size={16} />;
      case 'payment': return <DollarSign size={16} />;
      default: return <MessageCircle size={16} />;
    }
  };

  return (
    <div className={`bot-feed-item type-${type}`}>
      <div className="feed-icon">{getTypeIcon()}</div>
      <div className="feed-content">
        <div className="feed-header">
          <span className="feed-action">{action}</span>
          <span className="feed-time">{time}</span>
        </div>
        <p className="feed-description">{description}</p>
      </div>
    </div>
  );
};

export const Overview = () => {
  const [isConnected, setIsConnected] = useState(true);
  const { t } = useTranslation();
  const feed = t('dashboard.overview.feed.items', { returnObjects: true });
  const feedTypes = ['booking', 'query', 'payment', 'query'];

  // Simulación de reconexión SSE
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(prev => !prev);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overview-container">
      {/* Top Bar Status */}
      <div className="overview-header">
        <div>
          <h1 className="page-title">{t('dashboard.overview.title')}</h1>
          <p className="page-subtitle">{t('dashboard.overview.subtitle')}</p>
        </div>
        <div className="status-indicators">
          <div className={`sse-status ${isConnected ? 'connected' : 'reconnecting'}`}>
            <span className="status-dot"></span>
            {isConnected ? t('dashboard.overview.connected') : t('dashboard.overview.reconnecting')}
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="kpi-grid">
        <KPICard 
          title={t('dashboard.overview.kpis.appointments.title')}
          value="24" 
          subtitle={t('dashboard.overview.kpis.appointments.subtitle')}
          icon={CalendarCheck}
          colorClass="kpi-blue"
        />
        <KPICard 
          title={t('dashboard.overview.kpis.revenue.title')}
          value="$1,240.00" 
          subtitle={t('dashboard.overview.kpis.revenue.subtitle')}
          icon={DollarSign}
          colorClass="kpi-green"
        />
        <KPICard 
          title={t('dashboard.overview.kpis.bot.title')}
          value="142" 
          subtitle={t('dashboard.overview.kpis.bot.subtitle')}
          icon={MessageCircle}
          colorClass="kpi-purple"
        />
        <KPICard 
          title={t('dashboard.overview.kpis.sync.title')}
          value={t('dashboard.overview.kpis.sync.value')}
          subtitle={t('dashboard.overview.kpis.sync.subtitle')}
          icon={RefreshCcw}
          colorClass="kpi-orange"
        />
      </div>

      {/* Main Content Split */}
      <div className="overview-main-split">
        
        {/* Left Column: Upcoming Appointments */}
        <div className="card-panel">
          <div className="panel-header">
            <h2 className="panel-title">{t('dashboard.overview.upcoming.title')}</h2>
            <button className="btn-link">{t('dashboard.overview.upcoming.viewAll')}</button>
          </div>
          <div className="appointments-list">
            <AppointmentItem time="16:30" customer="Carlos Ruiz" service={t('dashboard.overview.upcoming.services.classicCut')} staff="Marco" status="confirmed" />
            <AppointmentItem time="17:00" customer="Ana Silva" service={t('dashboard.overview.upcoming.services.colorStyle')} staff="Lucia" status="pending" />
            <AppointmentItem time="17:15" customer="Jorge Lopez" service={t('dashboard.overview.upcoming.services.beardTrim')} staff="Marco" status="confirmed" />
            <AppointmentItem time="18:00" customer="Sofia Castro" service={t('dashboard.overview.upcoming.services.manicure')} staff="Andrea" status="confirmed" />
          </div>
        </div>

        {/* Right Column: Bot Activity Feed */}
        <div className="card-panel bot-feed-panel">
          <div className="panel-header">
            <h2 className="panel-title">{t('dashboard.overview.feed.title')}</h2>
            <span className="live-badge">{t('dashboard.overview.feed.live')}</span>
          </div>
          <div className="bot-feed-list">
            {Array.isArray(feed) && feed.map((item, index) => (
              <BotFeedItem key={index} time={item.time} action={item.action} description={item.description} type={feedTypes[index]} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
