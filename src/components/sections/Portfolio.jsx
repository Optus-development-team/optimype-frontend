import FinisherBackground from '../ui/FinisherBackground';
import './Portfolio.css';

const portfolioItems = [
  {
    id: 1,
    title: 'Retail: Soporte 24/7',
    description: 'Reducción del 80% en tickets de soporte manual tras implementar Agente de IA para preguntas frecuentes y seguimiento de pedidos.',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tag: 'Caso de Éxito Chatbot'
  },
  {
    id: 2,
    title: 'Servicios: Crecimiento de Leads',
    description: 'Doble de leads calificados al mes gracias a la automatización del formulario de contacto y seguimiento inicial por IA.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tag: 'Caso de Éxito Dashboard'
  },
  {
    id: 3,
    title: 'E-commerce: Cobros y Facturación',
    description: 'Automatización completa del proceso de cobro y emisión de facturas, eliminando errores humanos y optimizando el tiempo.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tag: 'Caso de Éxito Pagos'
  }
];

const Portfolio = () => {
  return (
    <FinisherBackground 
      className="portfolio" 
      id="portfolio"
    >
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">Casos de Éxito Instantáneo</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
          Resultados tangibles. Ve cómo Optimype transforma negocios reales.
        </p>

        <div className="portfolio-grid">
          {portfolioItems.map((item, index) => (
            <div 
              key={item.id} 
              className="portfolio-item" 
              data-aos="zoom-in-up" 
              data-aos-delay={200 + (index * 100)}
            >
              <img src={item.image} alt={item.title} className="portfolio-item-image" />
              <div className="portfolio-item-info">
                <span className="portfolio-tag">{item.tag}</span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FinisherBackground>
  );
};

export default Portfolio;
