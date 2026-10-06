import { useTranslation } from 'react-i18next';
import FinisherBackground from '../ui/FinisherBackground';
import './Services.css';

const Services = () => {
  const { t } = useTranslation();
  
  const servicesData = [
    {
      id: 1,
      icon: 'fas fa-cogs',
      title: 'Automatización Empresarial',
      description: 'Flujos de trabajo completos sin código: desde la captación de leads hasta el cierre de ventas y la facturación automática.'
    },
    {
      id: 2,
      icon: 'fas fa-brain',
      title: 'Agentes de IA Personalizados',
      description: 'Entrena a tu Agente de WhatsApp con la información de tu negocio para que sea tu vendedor o soporte 24/7 más eficiente.'
    },
    {
      id: 3,
      icon: 'fas fa-network-wired',
      title: 'Integración de Sistemas Inteligentes',
      description: 'Conecta Optimype con tus sistemas de pago, CRM, inventario y más para tener un ecosistema digital totalmente sincronizado.'
    },
    {
      id: 4,
      icon: 'fas fa-chart-line',
      title: 'Consultoría en Digitalización Ágil',
      description: 'Asesoría estratégica para identificar y optimizar los puntos débiles de tu flujo comercial con tecnología de punta.'
    },
    {
      id: 5,
      icon: 'fas fa-comments',
      title: 'Asistentes Virtuales Multicanal',
      description: 'Implementa chatbots inteligentes en WhatsApp, Messenger, Instagram y tu sitio web con una sola plataforma centralizada.'
    },
    {
      id: 6,
      icon: 'fas fa-rocket',
      title: t('services.title'),
      description: t('services.subtitle'),
      isSpecial: true
    }
  ];

  return (
    <FinisherBackground 
      className="services" 
      id="services"
    >
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">Nuestros Servicios de Impacto</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
          Soluciones modulares que se integran a tu flujo de trabajo de manera inmediata.
        </p>

        <div className="services-grid">
          {servicesData.map((service, index) => (
            <div 
              key={service.id} 
              className={`service-card ${service.isSpecial ? 'service-card-special' : ''}`}
              data-aos="zoom-in" 
              data-aos-delay={200 + (index * 100)}
              onClick={service.isSpecial ? () => window.location.href='#contact' : undefined}
              style={service.isSpecial ? {
                background: 'linear-gradient(135deg, var(--color-accent) 0%, #4A90E2 100%)',
                color: 'white',
                cursor: 'pointer'
              } : {}}
            >
              <div className="service-icon" style={service.isSpecial ? {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white'
              } : {}}>
                <i className={service.icon}></i>
              </div>
              <h4 style={service.isSpecial ? {color: 'white'} : {}}>{service.title}</h4>
              <p style={service.isSpecial ? {color: 'rgba(255, 255, 255, 0.95)'} : {}}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </FinisherBackground>
  );
};

export default Services;
