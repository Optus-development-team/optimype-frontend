import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import './Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  useEffect(() => {
    // === ANIMACIÓN MALLA DE PUNTOS CON EL NOMBRE, EN HORIZONTAL ===
    const WORDMARK = 'OPTIMYPE';
    const x_max = 47;
    const y_max = 8;
    const grid_el = document.getElementById('dot-grid');
    
    if (!grid_el) return;

    const generateGrid = () => {
      grid_el.innerHTML = ''; // Limpiar grid existente
      for (let y = 0; y < y_max; y++) {
        const row_el = document.createElement('div');
        row_el.classList.add('row');
        for (let x = 0; x < x_max; x++) {
          const cell_el = document.createElement('div');
          cell_el.classList.add('cell');
          cell_el.setAttribute('data-x', x);
          cell_el.setAttribute('data-y', y);
          row_el.appendChild(cell_el);
        }
        grid_el.appendChild(row_el);
      }
    };
    generateGrid();

    const rows = [...document.querySelectorAll('#dot-grid .row')];
    const cells = [...document.querySelectorAll('#dot-grid .cell')];

    // Matriz horizontal: y (filas) x (columnas). Cada letra es una rejilla de 6 filas.
    const GLYPHS = {
      O: ['.###.', '#...#', '#...#', '#...#', '#...#', '.###.'],
      P: ['####.', '#...#', '#...#', '####.', '#....', '#....'],
      T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..'],
      I: ['###', '.#.', '.#.', '.#.', '.#.', '###'],
      M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#'],
      Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..'],
      E: ['#####', '#....', '####.', '#....', '#....', '#####'],
    };
    const TEXT_SHAPE = [];
    for (let y = 0; y < y_max; y++) {
      TEXT_SHAPE[y] = Array(x_max).fill(0);
    }
    // Una columna de margen, una entre letras y la fila superior e inferior libres
    let column = 1;
    for (const letter of WORDMARK) {
      const glyph = GLYPHS[letter];
      glyph.forEach((line, row) => {
        [...line].forEach((dot, offset) => {
          if (dot === '#') TEXT_SHAPE[row + 1][column + offset] = 1;
        });
      });
      column += glyph[0].length + 1;
    }

    let clicked = false;
    let reset_all = false;
    const pull_distance = 120;

    const updateCellPositions = () => {
      cells.forEach((cell) => {
        const rect = cell.getBoundingClientRect();
        cell.center_position = {
          x: (rect.left + rect.right) / 2,
          y: (rect.top + rect.bottom) / 2,
        };
      });
    };

    const handleCellClick = (e, i) => {
      if (clicked) return;
      clicked = true;
      
      // Animación de dispersión sin physics2D
      cells.forEach((cell, index) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 400 + Math.random() * 600;
        const distance = velocity / 2;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        gsap.to(cell, {
          duration: 1.6,
          x: tx,
          y: ty + 800, // Simula gravedad
          rotation: Math.random() * 360,
          opacity: 0,
          ease: "power2.out",
          delay: ((x_max * y_max) - Math.abs(index - i)) / (x_max * y_max) * 0.3,
          onComplete: function() {
            // Revertir animación
            gsap.to(cell, {
              duration: 1.3,
              x: 0,
              y: 0,
              rotation: 0,
              opacity: cell.classList.contains('cell-text') ? 0.9 : 
                      cell.classList.contains('cell-bg') ? 0.5 : 0.05,
              ease: "elastic.out(1, 0.3)",
              onComplete: () => {
                if (index === cells.length - 1) {
                  clicked = false;
                  reset_all = true;
                  handlePointerMove();
                }
              }
            });
          }
        });
      });
    };

    const handlePointerMove = (e = { pageX: -pull_distance, pageY: -pull_distance }) => {
      if (clicked) return;
      const pointer_x = e.pageX || -pull_distance;
      const pointer_y = e.pageY || -pull_distance;
      cells.forEach((cell, i) => {
        const diff_x = pointer_x - cell.center_position.x;
        const diff_y = pointer_y - cell.center_position.y;
        const distance = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
        if (distance < pull_distance) {
          const percent = distance / pull_distance;
          cell.pulled = true;
          gsap.to(cell, {
            duration: 0.2,
            x: diff_x * percent,
            y: diff_y * percent,
          });
        } else {
          if (!cell.pulled) return;
          cell.pulled = false;
          gsap.to(cell, {
            duration: 1,
            x: 0,
            y: 0,
            ease: "elastic.out(1, 0.3)",
          });
        }
      });
      if (reset_all) {
        reset_all = false;
        cells.forEach((cell) => {
          const cell_x = parseInt(cell.getAttribute('data-x'));
          const cell_y = parseInt(cell.getAttribute('data-y'));
          const shape_val = TEXT_SHAPE[cell_y] ? TEXT_SHAPE[cell_y][cell_x] : 0;
          const is_part_of_text = shape_val === 1;
          const is_part_of_bg = shape_val === 2;
          gsap.to(cell, {
            duration: 1,
            x: 0,
            y: 0,
            ease: "elastic.out(1, 0.3)",
            opacity: is_part_of_text ? 0.9 : (is_part_of_bg ? 0.5 : 0.05),
            scale: is_part_of_text || is_part_of_bg ? 1 : 0.2
          });
        });
      }
    };

    const init = () => {
      updateCellPositions();
      window.addEventListener('resize', updateCellPositions);
      window.addEventListener('pointermove', handlePointerMove);
      document.body.addEventListener('pointerleave', () => handlePointerMove());
      cells.forEach((cell, i) => {
        const cell_x = parseInt(cell.getAttribute('data-x'));
        const cell_y = parseInt(cell.getAttribute('data-y'));
        const shape_val = TEXT_SHAPE[cell_y] ? TEXT_SHAPE[cell_y][cell_x] : 0;
        cell.classList.remove('cell-text', 'cell-bg');
        if (shape_val === 1) {
          cell.classList.add('cell-text');
          gsap.set(cell, { opacity: 0.9, scale: 1 });
        } else if (shape_val === 2) {
          cell.classList.add('cell-bg');
          gsap.set(cell, { opacity: 0.5, scale: 1 });
        } else {
          gsap.set(cell, { opacity: 0.05, scale: 0.2 });
        }
        cell.addEventListener('pointerup', (e) => handleCellClick(e, i));
      });
    };

    init();

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCellPositions);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-content">
          <h2 data-aos="fade-up">{t('contact.title')}</h2>
          <p data-aos="fade-up" data-aos-delay="100">
            {t('contact.subtitle')}
          </p>
          <div className="contact-cta-group" data-aos="fade-up" data-aos-delay="200">
            <a href="https://wa.me/59177379190" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              <i className="fab fa-whatsapp"></i> {t('contact.whatsappBtn')}
            </a>
            <a href="mailto:optus.aut@gmail.com" className="btn btn-secondary btn-lg">
              <i className="fas fa-envelope"></i> {t('contact.emailBtn')}
            </a>
          </div>
          
          <div className="contact-info" data-aos="fade-up" data-aos-delay="300">
            <div className="contact-info-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>La Paz, Bolivia</span>
            </div>
            <div className="contact-info-item">
              <i className="fas fa-phone"></i>
              <a href="tel:+59177379190">+591 77379190</a>
            </div>
            <div className="contact-info-item">
              <i className="fas fa-envelope"></i>
              <a href="mailto:optus.aut@gmail.com">optus.aut@gmail.com</a>
            </div>
          </div>

          <div id="dot-grid" className="dot-grid-container" data-aos="fade-up" data-aos-delay="400"></div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
