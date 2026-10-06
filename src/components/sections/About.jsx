import { useEffect } from 'react';
import gsap from 'gsap';
import FinisherBackground from '../ui/FinisherBackground';
import './About.css';

const About = () => {
  useEffect(() => {
    let oldX = 0;
    let oldY = 0;
    let deltaX = 0;
    let deltaY = 0;

    const root = document.querySelector('.mwg_effect000');
    if (!root) return;

    const handleMouseMove = (e) => {
      deltaX = e.clientX - oldX;
      deltaY = e.clientY - oldY;
      oldX = e.clientX;
      oldY = e.clientY;
    };

    root.addEventListener('mousemove', handleMouseMove);

    const mediaElements = root.querySelectorAll('.media');
    
    mediaElements.forEach(el => {
      const handleMouseEnter = () => {
        const image = el.querySelector('img');
        if (!image) return;

        const tl = gsap.timeline({ 
          onComplete: () => {
            tl.kill();
          }
        });
        tl.timeScale(1.2);

        // Efecto de "lanzamiento" con velocidad multiplicada
        const velocityX = deltaX * 30;
        const velocityY = deltaY * 30;

        // Animación de lanzamiento con física
        tl.to(image, {
          x: velocityX,
          y: velocityY,
          duration: 1.5,
          ease: 'power3.out'
        }).to(image, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: 'elastic.out(1, 0.4)'
        }, '-=0.8');

        // Rotación aleatoria simultánea
        tl.fromTo(image, 
          { rotate: 0, scale: 1 },
          {
            duration: 0.4,
            rotate: (Math.random() - 0.5) * 30,
            scale: 1.15,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut'
          }, 
          '<'
        );
      };

      el.addEventListener('mouseenter', handleMouseEnter);
    });

    // Cleanup
    return () => {
      root.removeEventListener('mousemove', handleMouseMove);
      mediaElements.forEach(el => {
        el.removeEventListener('mouseenter', () => {});
      });
    };
  }, []);

  return (
    <FinisherBackground 
      className="about" 
      id="about"
    >
      <div className="container about-content">
        <div className="about-text" data-aos="fade-right">
          <h3>
            Transformación Digital hecha en <span className="bolivia-badge"> Bolivia</span>
          </h3>
          <p>
            <strong>Optimype</strong> es la plataforma de <strong>agentes inteligentes</strong> diseñada para que emprendedores, jóvenes y <em>startups</em> puedan <strong>automatizar su negocio sin conocimientos técnicos</strong>.
          </p>
          <p>
            Mediante APIs de mensajería y servicios en la nube, convertimos <strong>WhatsApp en un asistente digital 24/7</strong> que vende, agenda, cobra, responde clientes y genera reportes con la misma facilidad con la que se envía un mensaje.
          </p>
          <p>
            Diseñamos esta propuesta para dueños de MYPES y nuevos emprendimientos que necesitan <strong>resultados inmediatos</strong>, escalabilidad y una herramienta moderna lista para la nueva generación que exige soluciones <strong>ágiles, intuitivas y efectivas</strong>.
          </p>
          <a href="#contact" className="btn btn-secondary" style={{marginTop: '1rem'}}>Conoce a nuestro equipo</a>
        </div>
        <div className="about-image" data-aos="fade-left">
          <section className="mwg_effect000">
            <div className="medias">
              <div className="media"><img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400" alt="WhatsApp Business" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400" alt="Chatbot AI" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400" alt="Automatización" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400" alt="Emprendedores" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" alt="MYPES Bolivia" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400" alt="Startups" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400" alt="Cloud Services" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400" alt="Digital Team" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400" alt="Mobile Business" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" alt="Data Analytics" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400" alt="Customer Service" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400" alt="Ventas Online" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400" alt="Equipo Remoto" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400" alt="Innovación Digital" /></div>
              <div className="media"><img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400" alt="Colaboración" /></div>
            </div>
          </section>
        </div>
      </div>
    </FinisherBackground>
  );
};

export default About;
