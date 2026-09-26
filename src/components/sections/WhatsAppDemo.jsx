import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Cpu, LayoutDashboard, Scissors, Sparkles } from 'lucide-react';
import './WhatsAppDemo.css';

/* ─────────────── INDUSTRY FLOWS ─────────────── */

/* ── BARBERSHOP FLOW ── */
const barberiaFlow = {
  label: 'Barbería',
  icon: Scissors,
  agentName: 'Barbería - VIP',
  agentStatus: 'en línea',
  stepEvents: {
    welcome: [{ title: 'Agente conectado', desc: 'WhatsApp Business activo' }],
    services: [{ title: 'Consultando catálogo', desc: '5 servicios disponibles' }],
    barbers: [{ title: 'Consultando equipo', desc: '3 barberos activos' }],
    barber_availability: [{ title: 'Revisando agenda', desc: 'Horarios libres de esta semana' }],
    payment: [{ title: 'Reserva creada', desc: 'Horario bloqueado 15 min' }],
    qr_payment: [{ title: 'Generando QR', desc: 'Cobro bancario listo' }],
    proof_request: [{ title: 'Esperando comprobante', desc: 'Pago pendiente de verificar' }],
    confirmed_location: [
      { title: 'Pago verificado', desc: 'Comprobante validado por IA' },
      { title: 'Cita confirmada', desc: 'Agenda actualizada' },
    ],
    email_request: [{ title: 'Solicitando correo', desc: 'Para recordatorio y calendario' }],
    farewell: [
      { title: 'Google Calendar', desc: 'Invitación enviada' },
      { title: 'Recordatorio programado', desc: 'WhatsApp 2 hrs antes' },
    ],
  },
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

const MENU_OPTIONS = [
        { label: 'Pagos', value: 'pagos' },
        { label: 'Notificaciones', value: 'notificaciones' },
        { label: 'Reportes', value: 'reportes' },
        { label: 'KPIs', value: 'kpis' },
      ];

/* ── GESTIÓN DEL NEGOCIO FLOW (pagos, notificaciones, reportes, KPIs) ── */
const gestionFlow = {
  label: 'Gestión',
  icon: LayoutDashboard,
  agentName: 'OPTUS Admin',
  agentStatus: 'en línea',
  stepEvents: {
    welcome: [{ title: 'Agente conectado', desc: 'Panel de gestión activo' }],
    menu: [{ title: 'Menú principal', desc: 'Esperando selección' }],
    pagos: [
      { title: 'Consultando pagos', desc: 'Movimientos del día' },
      { title: 'Conciliación bancaria', desc: '18 movimientos revisados' },
    ],
    pagos_pend: [{ title: 'Buscando pendientes', desc: '3 comprobantes por validar' }],
    pagos_verif: [
      { title: 'Verificando comprobantes', desc: 'IA + banco' },
      { title: 'Clientes notificados', desc: '3 mensajes de WhatsApp' },
    ],
    notif: [{ title: 'Consultando automatizaciones', desc: '3 notificaciones activas' }],
    notif_send: [
      { title: 'Preparando mensajes', desc: '8 clientes con cita mañana' },
      { title: 'Enviando por WhatsApp', desc: 'Recordatorios entregados' },
    ],
    reportes: [{ title: 'Catálogo de reportes', desc: '2 reportes disponibles' }],
    rep_ventas: [{ title: 'Generando reporte', desc: 'Ventas de la semana' }],
    rep_citas: [{ title: 'Generando reporte', desc: 'Citas del mes' }],
    rep_mail: [
      { title: 'Creando PDF', desc: 'Reporte con gráficos' },
      { title: 'Enviando por correo', desc: 'Entrega confirmada' },
    ],
    kpis: [
      { title: 'Calculando KPIs', desc: 'Ventas, conversión y respuesta' },
      { title: 'Comparando con el mes anterior', desc: 'Tendencias listas' },
    ],
    kpi_canal: [{ title: 'Agrupando por canal', desc: 'WhatsApp, Instagram y Web' }],
  },
  steps: [
    {
      id: 'welcome',
      type: 'agent',
      text: '¡Hola! Soy *OPTUS Admin*, tu asistente de gestión. ¿Qué quieres revisar hoy?',
      options: MENU_OPTIONS,
      isStart: true,
    },
    {
      id: 'menu',
      trigger: 'menu',
      type: 'agent',
      text: '¿Qué más quieres revisar?',
      options: MENU_OPTIONS,
    },

    /* Pagos */
    {
      id: 'pagos',
      trigger: 'pagos',
      type: 'agent',
      text: '*Resumen de pagos de hoy*\n\n✅ 14 verificados — Bs. 2.350\n⏳ 3 pendientes — Bs. 480\n❌ 1 rechazado — Bs. 120',
      options: [
        { label: 'Ver pendientes', value: 'pagos_pend' },
        { label: 'Volver al menú', value: 'menu' },
      ],
    },
    {
      id: 'pagos_pend',
      trigger: 'pagos_pend',
      type: 'agent',
      text: '*Pendientes de verificar*\n\n• Ana P. — Bs. 150 (QR)\n• Luis M. — Bs. 200 (transferencia)\n• Rosa T. — Bs. 130 (QR)\n\nPuedo validarlos con el comprobante que enviaron.',
      options: [
        { label: 'Verificar todos', value: 'pagos_verif' },
        { label: 'Volver al menú', value: 'menu' },
      ],
    },
    {
      id: 'pagos_verif',
      trigger: 'pagos_verif',
      type: 'agent',
      text: '*¡Listo!* Los 3 pagos quedaron verificados y cada cliente ya recibió su confirmación por WhatsApp.',
      options: [{ label: 'Volver al menú', value: 'menu' }],
    },

    /* Notificaciones */
    {
      id: 'notif',
      trigger: 'notificaciones',
      type: 'agent',
      text: '*Notificaciones automáticas activas*\n\n🔔 Recordatorio de cita — 2 hrs antes\n💳 Aviso de pago pendiente — a las 24 hrs\n📦 Pedido listo para recoger\n\n¿Qué quieres hacer?',
      options: [
        { label: 'Enviar recordatorios ahora', value: 'notif_send' },
        { label: 'Volver al menú', value: 'menu' },
      ],
    },
    {
      id: 'notif_send',
      trigger: 'notif_send',
      type: 'agent',
      text: '*Recordatorios enviados* a 8 clientes con cita mañana. Tasa de lectura estimada: 96%.',
      options: [{ label: 'Volver al menú', value: 'menu' }],
    },

    /* Reportes */
    {
      id: 'reportes',
      trigger: 'reportes',
      type: 'agent',
      text: '¿Qué reporte necesitas?',
      options: [
        { label: 'Ventas de la semana', value: 'rep_ventas' },
        { label: 'Citas del mes', value: 'rep_citas' },
        { label: 'Volver al menú', value: 'menu' },
      ],
    },
    {
      id: 'rep_ventas',
      trigger: 'rep_ventas',
      type: 'agent',
      text: '*Ventas de la semana*\n\nLun — Bs. 1.200\nMar — Bs. 1.450\nMié — Bs. 1.300\nJue — Bs. 1.980\nVie — Bs. 3.550\n\n*Total: Bs. 9.480* (+12% vs semana anterior)',
      options: [
        { label: 'Enviar por correo', value: 'rep_mail' },
        { label: 'Volver al menú', value: 'menu' },
      ],
    },
    {
      id: 'rep_citas',
      trigger: 'rep_citas',
      type: 'agent',
      text: '*Citas del mes*\n\n📅 Agendadas: 142\n✅ Completadas: 128\n🚫 Canceladas: 9\n⚠️ No asistieron: 5',
      options: [
        { label: 'Enviar por correo', value: 'rep_mail' },
        { label: 'Volver al menú', value: 'menu' },
      ],
    },
    {
      id: 'rep_mail',
      trigger: 'rep_mail',
      type: 'agent',
      text: '*Reporte enviado* a tu correo en PDF. Si quieres, puedo programarlo para que llegue cada lunes.',
      options: [{ label: 'Volver al menú', value: 'menu' }],
    },

    /* KPIs */
    {
      id: 'kpis',
      trigger: 'kpis',
      type: 'agent',
      text: '*KPIs del mes*\n\n📈 Ventas: Bs. 38.900 (+12%)\n💬 Conversaciones: 1.247\n⚡ Respuesta media: 3 seg\n🎯 Conversión: 24%\n🔁 Clientes recurrentes: 61%',
      options: [
        { label: 'Ver por canal', value: 'kpi_canal' },
        { label: 'Volver al menú', value: 'menu' },
      ],
    },
    {
      id: 'kpi_canal',
      trigger: 'kpi_canal',
      type: 'agent',
      text: '*Ventas por canal*\n\n🟢 WhatsApp — 78%\n🟣 Instagram — 14%\n🔵 Web — 8%\n\nWhatsApp es tu canal más fuerte.',
      options: [{ label: 'Volver al menú', value: 'menu' }],
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

const getTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const normalize = (str) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// Elige la opción cuyo texto comparte más palabras con lo que escribió el visitante
function matchOption(text, options = []) {
  const words = normalize(text).split(/\W+/).filter((w) => w.length > 2);
  let best = null;
  let bestScore = 0;
  options.forEach((opt) => {
    const label = normalize(opt.label);
    const score = words.filter((w) => label.includes(w)).length;
    if (score > bestScore) {
      best = opt;
      bestScore = score;
    }
  });
  return best;
}

function resolveText(template, context) {
  return template.replace(/\{ (\w+) \}/g, (_, key) => context[key] ?? `{${key}}`);
}

/* ──────────────────── MAIN COMPONENT ──────────────────── */

const FLOWS = [barberiaFlow, salonFlow, techFlow, gestionFlow];

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

      <DemoStage key={activeTab} flow={flow} />
    </div>
  );
};

/* Teléfono + panel de actividad; se reinicia al cambiar de industria */
const DemoStage = ({ flow }) => {
  const [events, setEvents] = useState([]);
  const timers = useRef([]);
  const nextId = useRef(0);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const addEvent = useCallback(({ title, desc }, delay = 0) => {
    const id = nextId.current++;
    const start = setTimeout(() => {
      setEvents((prev) => [...prev, { id, title, desc, status: 'processing' }]);
      const finish = setTimeout(() => {
        setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'done' } : e)));
      }, 900);
      timers.current.push(finish);
    }, delay);
    timers.current.push(start);
  }, []);

  return (
    <div className="wa-demo-stage">
      <PhoneMockup flow={flow} onEvent={addEvent} />
      <ActivityPanel events={events} />
    </div>
  );
};

const ActivityPanel = ({ events }) => {
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [events]);

  return (
    <div className="wa-demo-side">
      <div className="wa-try-card">
        <h3>Pruébalo tú mismo</h3>
        <p>Toca una opción o escribe tu mensaje como en WhatsApp.</p>
      </div>

      <div className="wa-activity-card">
        <div className="wa-activity-head">
          <strong>Actividad del sistema</strong>
          <span className="wa-activity-live">
            <span className="wa-live-dot"></span> en vivo
          </span>
        </div>
        <div className="wa-activity-list" ref={listRef}>
          {events.length === 0 && <small className="wa-activity-empty">Esperando actividad…</small>}
          {events.map((ev) => (
            <div key={ev.id} className={`wa-activity-item ${ev.status}`}>
              <span className="wa-activity-icon">
                <i className={ev.status === 'processing' ? 'fas fa-spinner fa-spin' : 'fas fa-check'}></i>
              </span>
              <div>
                <strong>{ev.title}</strong>
                <small>{ev.desc}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ──────────────────── PHONE MOCKUP ──────────────────── */

const PhoneMockup = ({ flow, onEvent }) => {
  const [messages, setMessages] = useState([]);
  const [currentStepId, setCurrentStepId] = useState('welcome');
  const [context, setContext] = useState({});
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputMode, setInputMode] = useState(null); // 'email' | 'proof'
  const [typedInput, setTypedInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const [clock, setClock] = useState(getTime);

  useEffect(() => {
    const tick = setInterval(() => setClock(getTime()), 30000);
    return () => clearInterval(tick);
  }, []);

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
    const stepEvents = flow.stepEvents?.[step.id] ?? [{ title: 'Respuesta generada', desc: 'Agente IA' }];
    stepEvents.forEach((ev, i) => onEvent(ev, i * 500));
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
    setMessages(prev => [...prev, { ...msg, time: getTime(), id: Date.now() + Math.random() }]);
  }

  function handleOptionClick(option, typedText) {
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
      onEvent({ title: 'Mensaje recibido', desc: 'Ver otro barbero' });
      addMessage({ type: 'customer', text: typedText ?? 'Ver otro barbero' });
      const barberStep = flow.steps.find(s => s.id === 'barbers');
      if (barberStep) {
        setTimeout(() => showAgentStep(barberStep, newCtx), 600);
      }
      return;
    }

    setContext(newCtx);
    onEvent({ title: 'Mensaje recibido', desc: customerText });
    addMessage({ type: 'customer', text: typedText ?? customerText });

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
      addMessage({ type: 'customer', text });
      const proofStep = flow.steps.find(s => s.id === 'proof_request');
      if (proofStep) setTimeout(() => showAgentStep(proofStep, context), 700);
      return;
    }

    if (inputMode === 'proof') {
      const text = typedInput.trim();
      setTypedInput('');
      setWaitingForInput(false);
      setInputMode(null);
      addMessage({ type: 'customer', text });
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
      addMessage({ type: 'customer', text: email });
      const farewellStep = flow.steps.find(s => s.id === 'farewell');
      if (farewellStep) setTimeout(() => showAgentStep(farewellStep, newCtx), 700);
    }
  }

  // Texto libre cuando el agente espera que se elija una opción
  function handleFreeText() {
    const text = typedInput.trim();
    if (!text || !waitingForInput) return;
    setTypedInput('');

    const lastOptions = [...messages].reverse().find((m) => m.options)?.options;
    const match = matchOption(text, lastOptions);
    if (match) {
      handleOptionClick(match, text);
      return;
    }

    addMessage({ type: 'customer', text });
    onEvent({ title: 'Mensaje recibido', desc: 'Sin coincidencia, pidiendo aclaración' });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        type: 'agent',
        text: 'No estoy seguro de haberte entendido 🤔 Elige una de las opciones o escribe con otras palabras.',
      });
    }, 900);
  }

  const inputPlaceholders = {
    confirm_payment: 'Escribe "Listo, ya pagué"…',
    proof: 'Escribe el número de transacción…',
    email: 'tucorreo@ejemplo.com',
    default: 'Escribe o elige una opción ↑',
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
            <span className="status-time">{clock}</span>
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
                    {msg.time}{' '}
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
            {inputMode || waitingForInput ? (
              <input
                className="input-box-active"
                type={inputMode === 'email' ? 'email' : 'text'}
                placeholder={inputPlaceholders[inputMode] || inputPlaceholders.default}
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (inputMode ? handleSpecialInput() : handleFreeText())}
              />
            ) : (
              <div className="input-box">
                <span>{inputPlaceholders.default}</span>
                <i className="far fa-face-smile text-gray"></i>
              </div>
            )}
            <button
              className="send-button"
              onClick={inputMode ? handleSpecialInput : handleFreeText}
              disabled={!inputMode && !waitingForInput}
              aria-label="Enviar"
            >
              <i className={`fas ${inputMode || waitingForInput ? 'fa-paper-plane' : 'fa-microphone'}`}></i>
            </button>
          </div>

          <div className="home-indicator"></div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDemo;
