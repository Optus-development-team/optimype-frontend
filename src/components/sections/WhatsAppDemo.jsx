import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Cpu, Scissors, Sparkles } from 'lucide-react';
import './WhatsAppDemo.css';

/* ─────────────── INDUSTRY FLOWS ─────────────── */

/* ── BARBERSHOP FLOW ── */
const barberiaFlow = {
  label: 'Barbería',
  icon: Scissors,
  agentName: 'Barbería - VIP',
  agentStatus: 'en línea',
  steps: [
    {
      id: 'welcome',
      type: 'agent',
      text: '¡Hola! Bienvenido a *Barbería VIP*. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      options: [
        { label: 'Agendar cita', value: 'schedule' },
        { label: 'Ver servicios', value: 'services' },
        { label: 'Ubicación y horarios', value: 'location_only' },
      ],
      isStart: true,
    },
    {
      id: 'services',
      trigger: 'schedule',
      type: 'agent',
      customerText: 'Quiero agendar una cita',
      text: '¡Perfecto! Contamos con los siguientes servicios. ¿Cuál te interesa?',
      options: [
        { label: 'Corte Clásico — Bs. 80', value: 'corte_clasico' },
        { label: 'Corte + Barba — Bs. 120', value: 'corte_barba' },
        { label: 'Coloración / Tinte — Bs. 180', value: 'coloracion' },
        { label: 'Tratamiento Capilar — Bs. 150', value: 'tratamiento' },
        { label: 'Pack VIP Completo — Bs. 280', value: 'pack_vip' },
      ],
    },
    {
      id: 'barbers',
      trigger: ['corte_clasico', 'corte_barba', 'coloracion', 'tratamiento', 'pack_vip'],
      type: 'agent',
      customerText: '{ serviceLabel }',
      text: 'Excelente elección. ¿Con qué barbero te gustaría agendar?',
      options: [
        { label: 'Carlos Mendoza — 4.9', value: 'carlos' },
        { label: 'Diego Rojas — 4.7', value: 'diego' },
        { label: 'Martín Vega — 4.8', value: 'martin' },
      ],
    },
    {
      id: 'barber_availability',
      trigger: ['carlos', 'diego', 'martin'],
      type: 'agent',
      customerText: '{ barberLabel }',
      text: '{ barberAvailability }',
      options: [
        { label: 'Lun 09:00', value: 'slot_lun9' },
        { label: 'Lun 11:00', value: 'slot_lun11' },
        { label: 'Mié 14:00', value: 'slot_mie14' },
        { label: 'Jue 10:00', value: 'slot_jue10' },
        { label: 'Vie 15:00', value: 'slot_vie15' },
        { label: 'Ver otro barbero', value: 'barbers' },
      ],
    },
    {
      id: 'payment',
      trigger: ['slot_lun9', 'slot_lun11', 'slot_mie14', 'slot_jue10', 'slot_vie15'],
      type: 'agent',
      customerText: '{ slotLabel }',
      text: '*{ slotLabel }* reservado. ¿Cómo prefieres pagar?',
      options: [
        { label: 'Adelantar 50% (Bs. { half })', value: 'pay_half' },
        { label: 'Pagar total (Bs. { full })', value: 'pay_full' },
        { label: 'Pagar en establecimiento', value: 'pay_onsite' },
      ],
    },
    {
      id: 'qr_payment',
      trigger: ['pay_half', 'pay_full'],
      type: 'agent',
      customerText: '{ paymentLabel }',
      text: '¡Perfecto! Escanea el código QR para completar tu pago.',
      image: 'qr',
    },
    {
      id: 'proof_request',
      trigger: 'qr_payment_sent',
      type: 'agent',
      customerText: 'Listo, ya pagué',
      text: 'Gracias por tu pago. ¿Puedes enviarnos el comprobante de la transacción?',
    },
    {
      id: 'confirmed_location',
      trigger: 'proof_sent',
      type: 'agent',
      customerText: 'Aquí está mi comprobante',
      text: '*¡Pago verificado!* Tu cita está confirmada. Te esperamos aquí.',
      location: true,
    },
    {
      id: 'email_request',
      trigger: 'location_shown',
      type: 'agent',
      text: 'Para enviarte recordatorios por *WhatsApp* y también agendar en *Google Calendar*, ¿cuál es tu correo electrónico?',
    },
    {
      id: 'farewell',
      trigger: 'email_provided',
      type: 'agent',
      customerText: '{ userEmail }',
      text: '¡Todo listo!\n\nRecibirás un recordatorio 2 hrs antes por WhatsApp.\nY una invitación de Google Calendar en tu correo.\n\n¡Nos vemos pronto en Barbería VIP!',
      isEnd: true,
    },
  ],
};

/* ── SALON DE BELLEZA FLOW (skeleton) ── */
const salonFlow = {
  label: 'Salón de Belleza',
  icon: Sparkles,
  agentName: 'Salón Glam',
  agentStatus: 'en línea',
  steps: [
    {
      id: 'welcome',
      type: 'agent',
      text: '¡Hola! Bienvenida a *Salón Glam*. Soy tu asistente de belleza. ¿En qué te puedo ayudar?',
      options: [
        { label: 'Agendar servicio', value: 'schedule' },
        { label: 'Ver catálogo', value: 'catalog' },
        { label: 'Cómo llegar', value: 'location_only' },
      ],
      isStart: true,
    },
    {
      id: 'services',
      trigger: 'schedule',
      type: 'agent',
      customerText: 'Quiero agendar un servicio',
      text: '¡Con gusto! Estos son nuestros servicios destacados:',
      options: [
        { label: 'Corte de Cabello — Bs. 90', value: 'corte' },
        { label: 'Tinte / Balayage — Bs. 250', value: 'tinte' },
        { label: 'Manicure + Pedicure — Bs. 120', value: 'manicure' },
        { label: 'Tratamiento Facial — Bs. 200', value: 'facial' },
        { label: 'Maquillaje Evento — Bs. 350', value: 'maquillaje' },
      ],
    },
    {
      id: 'farewell',
      trigger: ['corte', 'tinte', 'manicure', 'facial', 'maquillaje'],
      type: 'agent',
      customerText: '{ serviceLabel }',
      text: '¡Excelente elección! Pronto nuestro equipo completará este flujo con disponibilidad de estilistas, pagos y confirmación.\n\n¡Estamos casi listas!',
      isEnd: true,
    },
  ],
};

/* ── TECH COMPONENTS FLOW (skeleton) ── */
const techFlow = {
  label: 'Componentes Tech',
  icon: Cpu,
  agentName: 'TechBot OPTUS',
  agentStatus: 'en línea',
  steps: [
    {
      id: 'welcome',
      type: 'agent',
      text: '¡Hola! Bienvenido a *Componentes Tech*. Soy tu asistente especializado. ¿Qué necesitas?',
      options: [
        { label: 'Ver catálogo', value: 'catalog' },
        { label: 'Soporte técnico', value: 'support' },
        { label: 'Estado de pedido', value: 'order_status' },
      ],
      isStart: true,
    },
    {
      id: 'catalog',
      trigger: 'catalog',
      type: 'agent',
      customerText: 'Quiero ver el catálogo',
      text: '¡Claro! ¿Qué tipo de componente buscas?',
      options: [
        { label: 'RAM / Memoria', value: 'ram' },
        { label: 'GPU / Tarjeta Gráfica', value: 'gpu' },
        { label: 'Procesador (CPU)', value: 'cpu' },
        { label: 'Almacenamiento SSD/HDD', value: 'storage' },
      ],
    },
    {
      id: 'farewell',
      trigger: ['ram', 'gpu', 'cpu', 'storage', 'support', 'order_status'],
      type: 'agent',
      customerText: '{ serviceLabel }',
      text: '¡Entendido! Este flujo está en construcción por el equipo de desarrollo. Pronto podrás ver disponibilidad, precios actualizados y métodos de pago.\n\n¡Gracias por tu paciencia!',
      isEnd: true,
    },
  ],
};

/* ──────────────────── HELPERS ──────────────────── */

const barberAvailabilityMap = {
  carlos: {
    name: 'Carlos Mendoza',
    text: '*Carlos Mendoza* (4.9) está disponible los siguientes horarios esta semana. ¿Cuál prefieres?',
  },
  diego: {
    name: 'Diego Rojas',
    text: '*Diego Rojas* (4.7) tiene estas horas disponibles esta semana:',
  },
  martin: {
    name: 'Martín Vega',
    text: '*Martín Vega* (4.8) tiene los siguientes turnos libres:',
  },
};

const slotLabelMap = {
  slot_lun9: 'Lunes 09:00',
  slot_lun11: 'Lunes 11:00',
  slot_mie14: 'Miércoles 14:00',
  slot_jue10: 'Jueves 10:00',
  slot_vie15: 'Viernes 15:00',
};

const servicePriceMap = {
  corte_clasico: { full: 80, label: 'Corte Clásico' },
  corte_barba: { full: 120, label: 'Corte + Barba' },
  coloracion: { full: 180, label: 'Coloración / Tinte' },
  tratamiento: { full: 150, label: 'Tratamiento Capilar' },
  pack_vip: { full: 280, label: 'Pack VIP Completo' },
};

function resolveText(template, context) {
  return template.replace(/\{ (\w+) \}/g, (_, key) => context[key] ?? `{${key}}`);
}

/* ──────────────────── MAIN COMPONENT ──────────────────── */

const FLOWS = [barberiaFlow, salonFlow, techFlow];

const WhatsAppDemo = () => {
  const [activeTab, setActiveTab] = useState(0);
  const flow = FLOWS[activeTab];

  return (
    <div className="wa-demo-wrapper">
      {/* Industry Tabs */}
      <div className="industry-tabs">
        {FLOWS.map((f, i) => {
          const Icon = f.icon;
          return (
            <button
              key={i}
              className={`industry-tab-btn ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              <Icon className="tab-icon" aria-hidden="true" />
              <span className="tab-label">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Phone */}
      <PhoneMockup key={activeTab} flow={flow} />
    </div>
  );
};

/* ──────────────────── PHONE MOCKUP ──────────────────── */

const PhoneMockup = ({ flow }) => {
  const [messages, setMessages] = useState([]);
  const [currentStepId, setCurrentStepId] = useState('welcome');
  const [context, setContext] = useState({});
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputMode, setInputMode] = useState(null); // 'email' | 'proof'
  const [typedInput, setTypedInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  // ── show initial agent message with a small delay ──
  useEffect(() => {
    setMessages([]);
    setCurrentStepId('welcome');
    setContext({});
    setWaitingForInput(false);
    setInputMode(null);
    setTypedInput('');
    setIsTyping(false);

    const timer = setTimeout(() => {
      const startStep = flow.steps.find(s => s.isStart);
      if (startStep) showAgentStep(startStep, {});
    }, 800);
    return () => clearTimeout(timer);
  }, [flow]);

  function showAgentStep(step, ctx) {
    setIsTyping(true);
    const delay = Math.min(1000, Math.max(650, step.text.length * 7));
    setTimeout(() => {
      setIsTyping(false);
      const text = resolveText(step.text, ctx);
      addMessage({ type: 'agent', text, options: step.options, image: step.image, location: step.location });

      if (step.options) {
        setCurrentStepId(step.id);
        setWaitingForInput(true);
      } else if (step.id === 'qr_payment') {
        // After showing QR, wait for "I paid" confirmation
        setCurrentStepId('qr_payment');
        setWaitingForInput(true);
        setInputMode('confirm_payment');
      } else if (step.id === 'proof_request') {
        setCurrentStepId('proof_request');
        setWaitingForInput(true);
        setInputMode('proof');
      } else if (step.id === 'email_request') {
        setCurrentStepId('email_request');
        setWaitingForInput(true);
        setInputMode('email');
      } else if (step.location) {
        // After location, trigger email request
        setTimeout(() => {
          const emailStep = flow.steps.find(s => s.id === 'email_request');
          if (emailStep) showAgentStep(emailStep, ctx);
        }, 1500);
      } else if (step.isEnd) {
        setWaitingForInput(false);
        setInputMode(null);
      }
    }, delay);
  }

  function addMessage(msg) {
    setMessages(prev => [...prev, { ...msg, id: Date.now() + Math.random() }]);
  }

  function handleOptionClick(option) {
    if (!waitingForInput) return;
    setWaitingForInput(false);

    // ── resolve customer text ──
    let customerText = option.label;
    const newCtx = { ...context };

    // Persist service for price lookup
    if (['corte_clasico', 'corte_barba', 'coloracion', 'tratamiento', 'pack_vip'].includes(option.value)) {
      newCtx.selectedService = option.value;
      newCtx.serviceLabel = option.label.replace(/^[\w\W]{2} /, '').split(' — ')[0];
      customerText = option.label;
    }

    if (['carlos', 'diego', 'martin'].includes(option.value)) {
      newCtx.selectedBarber = option.value;
      newCtx.barberLabel = option.label;
      const info = barberAvailabilityMap[option.value];
      newCtx.barberAvailability = info.text;
    }

    if (Object.keys(slotLabelMap).includes(option.value)) {
      const slotLabel = slotLabelMap[option.value];
      newCtx.slotLabel = slotLabel;
      const svc = servicePriceMap[newCtx.selectedService];
      if (svc) {
        newCtx.full = svc.full;
        newCtx.half = Math.round(svc.full / 2);
        newCtx.serviceLabel = svc.label.replace(/^[\w\W]{2} /, '').split(' — ')[0];
      }
    }

    if (['pay_half', 'pay_full', 'pay_onsite'].includes(option.value)) {
      newCtx.paymentLabel = option.label;
    }

    if (option.value === 'barbers') {
      // Go back to barbers step
      setContext(newCtx);
      addMessage({ type: 'customer', text: 'Ver otro barbero', id: Date.now() });
      const barberStep = flow.steps.find(s => s.id === 'barbers');
      if (barberStep) {
        setTimeout(() => showAgentStep(barberStep, newCtx), 600);
      }
      return;
    }

    setContext(newCtx);
    addMessage({ type: 'customer', text: customerText, id: Date.now() });

    // Find next step
    const nextStep = flow.steps.find(s => {
      if (!s.trigger) return false;
      if (Array.isArray(s.trigger)) return s.trigger.includes(option.value);
      return s.trigger === option.value;
    });

    if (nextStep) {
      setTimeout(() => showAgentStep(nextStep, newCtx), 700);
    } else if (option.value === 'pay_onsite') {
      // Skip QR, go to proof request
      setTimeout(() => {
        const proofStep = flow.steps.find(s => s.id === 'proof_request');
        if (proofStep) {
          // For on-site, skip proof and go straight to location
          const locStep = flow.steps.find(s => s.id === 'confirmed_location');
          if (locStep) showAgentStep(locStep, newCtx);
        }
      }, 700);
    }
  }

  function handleSpecialInput() {
    if (!typedInput.trim()) return;

    if (inputMode === 'confirm_payment') {
      const text = typedInput.trim();
      setTypedInput('');
      setWaitingForInput(false);
      setInputMode(null);
      addMessage({ type: 'customer', text, id: Date.now() });
      const proofStep = flow.steps.find(s => s.id === 'proof_request');
      if (proofStep) setTimeout(() => showAgentStep(proofStep, context), 700);
      return;
    }

    if (inputMode === 'proof') {
      const text = typedInput.trim();
      setTypedInput('');
      setWaitingForInput(false);
      setInputMode(null);
      addMessage({ type: 'customer', text, id: Date.now() });
      const locStep = flow.steps.find(s => s.id === 'confirmed_location');
      if (locStep) setTimeout(() => showAgentStep(locStep, context), 700);
      return;
    }

    if (inputMode === 'email') {
      const email = typedInput.trim();
      setTypedInput('');
      setWaitingForInput(false);
      setInputMode(null);
      const newCtx = { ...context, userEmail: email };
      setContext(newCtx);
      addMessage({ type: 'customer', text: email, id: Date.now() });
      const farewellStep = flow.steps.find(s => s.id === 'farewell');
      if (farewellStep) setTimeout(() => showAgentStep(farewellStep, newCtx), 700);
    }
  }

  const inputPlaceholders = {
    confirm_payment: 'Escribe "Listo, ya pagué"…',
    proof: 'Escribe el número de transacción…',
    email: 'tucorreo@ejemplo.com',
    default: 'Selecciona una opción ↑',
  };

  return (
    <div className="phone-mockup-3d">
      <div className="phone-chassis">
        <div className="phone-screen">

          {/* Notch */}
          <div className="phone-notch">
            <div className="notch-camera"></div>
            <div className="notch-speaker"></div>
          </div>

          {/* Status Bar */}
          <div className="whatsapp-status-bar">
            <span className="status-time">14:28</span>
            <div className="status-icons">
              <i className="fas fa-signal"></i>
              <i className="fas fa-wifi"></i>
              <i className="fas fa-battery-full"></i>
            </div>
          </div>

          {/* Header */}
          <div className="whatsapp-header">
            <div className="header-back">
              <i className="fas fa-chevron-left"></i>
            </div>
            <div className="wa-header-contact">
              <div className="wa-contact-avatar">
                <img src="/OPTUSLOGO.png" alt="Agent" />
              </div>
              <div className="wa-contact-info">
                <div className="wa-contact-name">{flow.agentName}</div>
                <div className="wa-contact-status">{flow.agentStatus}</div>
              </div>
            </div>
            <div className="header-menu">
              <i className="fas fa-video"></i>
              <i className="fas fa-phone"></i>
            </div>
          </div>

          {/* Chat */}
          <div className="whatsapp-chat-bg" ref={chatRef}>
            <div className="chat-date-pill">Hoy</div>

            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-wrapper ${msg.type}`}>
                <div className={`chat-bubble ${msg.type}`}>
                  {msg.text && (
                    <div
                      className="bubble-text"
                      dangerouslySetInnerHTML={{
                        __html: msg.text
                          .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>'),
                      }}
                    />
                  )}

                  {msg.options && (
                    <div className="bubble-options">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          className={`bubble-option-btn ${!waitingForInput ? 'used' : ''}`}
                          onClick={() => handleOptionClick(opt)}
                          disabled={!waitingForInput}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.image === 'qr' && (
                    <div className="bubble-image qr-image">
                      <i className="fas fa-qrcode"></i>
                      <span>Bs. {context.full || '—'}</span>
                      <span className="qr-detail">Escanear para pagar</span>
                    </div>
                  )}

                  {msg.location && (
                    <div className="bubble-location">
                      <div className="map-placeholder">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="location-info">
                        <strong>Barbería VIP Central</strong>
                        <span>Av. Principal #123, Santa Cruz</span>
                      </div>
                    </div>
                  )}

                  <span className="bubble-time">
                    14:28{' '}
                    {msg.type === 'customer' && (
                      <i className="fas fa-check-double read"></i>
                    )}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-wrapper agent">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="whatsapp-input-bar">
            <i className="fas fa-plus text-gray"></i>
            {inputMode ? (
              <input
                className="input-box-active"
                type={inputMode === 'email' ? 'email' : 'text'}
                placeholder={inputPlaceholders[inputMode] || inputPlaceholders.default}
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSpecialInput()}
              />
            ) : (
              <div className="input-box">
                <span>{inputPlaceholders.default}</span>
                <i className="far fa-face-smile text-gray"></i>
              </div>
            )}
            <button
              className="send-button"
              onClick={inputMode ? handleSpecialInput : undefined}
              disabled={!inputMode}
            >
              <i className={`fas ${inputMode ? 'fa-paper-plane' : 'fa-microphone'}`}></i>
            </button>
          </div>

          <div className="home-indicator"></div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDemo;
