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

const AppointmentItem = ({ time, customer, service, staff, status }) => (
  <div className="appointment-item">
    <div className="appointment-time">
      <Clock size={16} />
      <span>{time}</span>
    </div>
    <div className="appointment-details">
      <h4 className="customer-name">{customer}</h4>
      <div className="service-info">
        <Scissors size={14} />
        <span>{service} con {staff}</span>
      </div>
    </div>
    <div className="appointment-status">
      {status === 'confirmed' ? (
        <span className="badge badge-success"><CheckCircle2 size={14}/> Confirmada</span>
      ) : (
        <span className="badge badge-warning"><CircleDashed size={14}/> Pendiente</span>
      )}
    </div>
  </div>
);

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
          <h1 className="page-title">Resumen de Hoy</h1>
          <p className="page-subtitle">Monitoreo en tiempo real de tu sucursal principal</p>
        </div>
        <div className="status-indicators">
          <div className={`sse-status ${isConnected ? 'connected' : 'reconnecting'}`}>
            <span className="status-dot"></span>
            {isConnected ? 'Conectado (Live)' : 'Reconectando...'}
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="kpi-grid">
        <KPICard 
          title="Citas del Día" 
          value="24" 
          subtitle="18 confirmadas, 6 pendientes"
          icon={CalendarCheck}
          colorClass="kpi-blue"
        />
        <KPICard 
          title="Ingresos Estimados" 
          value="$1,240.00" 
          subtitle="$850 pagados, $390 por cobrar"
          icon={DollarSign}
          colorClass="kpi-green"
        />
        <KPICard 
          title="Actividad Bot IA" 
          value="142" 
          subtitle="Mensajes procesados, 12 citas auto-agendadas"
          icon={MessageCircle}
          colorClass="kpi-purple"
        />
        <KPICard 
          title="Google Sync" 
          value="Sincronizado" 
          subtitle="Última act. hace 2 min. 0 conflictos."
          icon={RefreshCcw}
          colorClass="kpi-orange"
        />
      </div>

      {/* Main Content Split */}
      <div className="overview-main-split">
        
        {/* Left Column: Upcoming Appointments */}
        <div className="card-panel">
          <div className="panel-header">
            <h2 className="panel-title">Próximas Citas (Siguientes 2 hrs)</h2>
            <button className="btn-link">Ver Agenda Completa</button>
          </div>
          <div className="appointments-list">
            <AppointmentItem time="16:30" customer="Carlos Ruiz" service="Corte Clásico" staff="Marco" status="confirmed" />
            <AppointmentItem time="17:00" customer="Ana Silva" service="Tinte + Peinado" staff="Lucia" status="pending" />
            <AppointmentItem time="17:15" customer="Jorge Lopez" service="Arreglo de Barba" staff="Marco" status="confirmed" />
            <AppointmentItem time="18:00" customer="Sofia Castro" service="Manicura" staff="Andrea" status="confirmed" />
          </div>
        </div>

        {/* Right Column: Bot Activity Feed */}
        <div className="card-panel bot-feed-panel">
          <div className="panel-header">
            <h2 className="panel-title">Feed del Agente IA</h2>
            <span className="live-badge">En Vivo</span>
          </div>
          <div className="bot-feed-list">
            <BotFeedItem time="Hace 1 min" action="Nueva cita agendada" description="El bot agendó un 'Corte Degradé' para mañana a las 10:00 AM con Marco." type="booking" />
            <BotFeedItem time="Hace 5 min" action="Consulta de precios" description="Cliente consultó sobre el precio del tratamiento capilar. Bot respondió exitosamente." type="query" />
            <BotFeedItem time="Hace 12 min" action="Pago Recibido (QR)" title="Pago Recibido" description="Orden #ORD-892 pagada vía QR. $45.00 acreditados." type="payment" />
            <BotFeedItem time="Hace 28 min" action="Recordatorio enviado" description="Se enviaron 4 recordatorios automáticos por WhatsApp para las citas de la tarde." type="query" />
          </div>
        </div>

      </div>
    </div>
  );
};
