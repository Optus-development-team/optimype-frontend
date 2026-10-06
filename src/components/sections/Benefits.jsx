import FinisherBackground from '../ui/FinisherBackground';
import './Benefits.css';

const benefits = [
  {
    id: 1,
    icon: 'fas fa-bolt',
    title: 'Productividad x10',
    description: 'Libera a tu equipo de tareas repetitivas. Dedica el tiempo a la estrategia y la creatividad, no a la operación manual.'
  },
  {
    id: 2,
    icon: 'fas fa-hand-holding-usd',
    title: 'Reducción de Costos',
    description: 'Menos errores, menos personal operativo. La IA trabaja sin descanso por una fracción del costo de un empleado tradicional.'
  },
  {
    id: 3,
    icon: 'fas fa-rocket',
    title: 'Escalabilidad Sin Límites',
    description: 'Tu agente de IA atiende a 10 o a 10,000 clientes con la misma eficiencia. Escala tu negocio sin preocuparte por la infraestructura.'
  },
  {
    id: 4,
    icon: 'fas fa-lightbulb',
    title: 'Innovación Continua',
    description: 'Accede a las últimas tendencias en IA y automatización sin código. Mantente siempre un paso adelante de la competencia.'
  },
  {
    id: 5,
    icon: 'fas fa-clock',
    title: 'Disponibilidad 24/7',
    description: 'Tus agentes de IA nunca duermen. Atiende clientes, cierra ventas y resuelve dudas a cualquier hora, incluso fines de semana y feriados.'
  },
  {
    id: 6,
    icon: 'fas fa-code',
    title: 'Sin Conocimientos Técnicos',
    description: 'Diseñado para emprendedores y MYPES. No necesitas programar ni contratar desarrolladores. Implementación simple con WhatsApp que ya conoces.'
  }
];

const Benefits = () => {
  return (
    <FinisherBackground 
      className="benefits" 
      id="benefits"
    >
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">Beneficios Inmediatos de Optimype</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
          Más que una herramienta, una palanca para el crecimiento.
        </p>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.id} 
              className="benefit-card" 
              data-aos="fade-right" 
              data-aos-delay={200 + (index * 100)}
            >
              <div className="benefit-icon">
                <i className={benefit.icon}></i>
              </div>
              <h4>{benefit.title}</h4>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </FinisherBackground>
  );
};

export default Benefits;
