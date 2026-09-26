import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
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
    pay_method: [{ title: 'Calculando monto', desc: 'Bs. y equivalente en USDT/USDC' }],
    qr_simple: [
      { title: 'Generando QR Simple', desc: 'Interoperable con todos los bancos' },
      { title: 'Cobro registrado', desc: 'QR válido por 15 min' },
    ],
    binance: [
      { title: 'Creando orden Binance Pay', desc: 'Monto convertido a stablecoin' },
      { title: 'QR Binance listo', desc: 'Sin comisión para el cliente' },
    ],
    proof_request: [{ title: 'Esperando comprobante', desc: 'Pago pendiente de verificar' }],
    confirmed_location: [
      { title: 'Pago verificado', desc: 'Comprobante validado por IA' },
      { title: 'Cita confirmada', desc: 'Agenda actualizada' },
    ],
    onsite_confirmed: [
      { title: 'Reserva confirmada', desc: 'Pago pendiente en tienda' },
      { title: 'Agenda actualizada', desc: 'Cobro marcado para caja' },
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
      text: '*{ slotLabel }* reservado para *{ serviceLabel }*. ¿Cómo prefieres pagar?',
      options: [
        { label: 'Pago completo (Bs. { full })', value: 'pay_full' },
        { label: 'Adelanto 50% (Bs. { half })', value: 'pay_half' },
        { label: 'Pagar en tienda', value: 'pay_onsite' },
      ],
    },
    {
      id: 'pay_method',
      trigger: ['pay_full', 'pay_half'],
      type: 'agent',
      text: 'Monto a pagar: *Bs. { amount }* ({ payKind }).\n\n¿Con qué método quieres pagar?',
      options: [
        { label: 'QR Simple (cualquier banco)', value: 'qr_simple' },
        { label: 'Binance Pay — USDT', value: 'binance_usdt' },
        { label: 'Binance Pay — USDC', value: 'binance_usdc' },
      ],
    },
    {
      id: 'qr_simple',
      trigger: 'qr_simple',
      type: 'agent',
      text: 'Escanea este *QR Simple* desde la app de tu banco o billetera. Cuando termines, avísame.',
      payCard: 'qr_simple',
      options: [{ label: 'Listo, ya pagué', value: 'paid' }],
    },
    {
      id: 'binance',
      trigger: ['binance_usdt', 'binance_usdc'],
      type: 'agent',
      text: 'Abre *Binance* → *Pay* → *Escanear* y paga *{ cryptoAmount } { coin }*. Cuando termines, avísame.',
      payCard: 'binance',
      options: [{ label: 'Listo, ya pagué', value: 'paid' }],
    },
    {
      id: 'proof_request',
      trigger: 'paid',
      type: 'agent',
      text: '¡Gracias! Envíame la captura del comprobante para verificar tu pago.',
      options: [{ label: 'Enviar comprobante', value: 'proof_sent' }],
    },
    {
      id: 'confirmed_location',
      trigger: 'proof_sent',
      type: 'agent',
      text: '*¡Pago verificado!* { paymentSummary }\n\nTu cita está confirmada. Te esperamos aquí.',
      location: true,
    },
    {
      id: 'onsite_confirmed',
      trigger: 'pay_onsite',
      type: 'agent',
      text: '*¡Reserva confirmada!* Pagarás *Bs. { full }* al llegar, en efectivo, QR Simple o tarjeta.\n\nTe guardamos el horario con 10 min de tolerancia.',
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
      text: '*Pendientes de verificar*\n\n• Ana P. — Bs. 150 (QR Simple)\n• Luis M. — 28.74 USDT (Binance Pay)\n• Rosa T. — Bs. 65 (adelanto, QR Simple)\n\nPuedo validarlos con el comprobante que enviaron.',
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

// Tipo de cambio referencial Bs. → USDT/USDC para la demo
const BOB_PER_USD = 6.96;
const BINANCE_PAY_ID = '482913607';
const BUSINESS_NAME = 'Barbería VIP SRL';

const getTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const normalize = (str) =>
  str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

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

const formatBs = (n) => Number(n).toLocaleString('es-BO', { maximumFractionDigits: 2 });

// Actualiza el contexto de la conversación según la opción elegida
function applyChoice(ctx, option) {
  const next = { ...ctx };
  const { value } = option;

  if (servicePriceMap[value]) {
    next.selectedService = value;
    next.serviceLabel = servicePriceMap[value].label;
  }

  if (barberAvailabilityMap[value]) {
    next.selectedBarber = value;
    next.barberLabel = option.label;
    next.barberAvailability = barberAvailabilityMap[value].text;
  }

  if (slotLabelMap[value]) {
    next.slotLabel = slotLabelMap[value];
    const svc = servicePriceMap[next.selectedService];
    if (svc) {
      next.full = svc.full;
      next.half = Math.round(svc.full / 2);
    }
  }

  if (value === 'pay_full' || value === 'pay_half') {
    next.payType = value === 'pay_full' ? 'full' : 'half';
    next.amount = value === 'pay_full' ? next.full : next.half;
    next.payKind = value === 'pay_full' ? 'pago completo' : 'adelanto 50%';
  }

  if (value === 'pay_onsite') next.payType = 'onsite';

  if (value === 'qr_simple' || value.startsWith('binance_')) {
    next.payRef = `OPT-${Math.floor(100000 + Math.random() * 900000)}`;
    if (value === 'qr_simple') {
      next.method = 'QR Simple';
      next.coin = null;
    } else {
      next.method = 'Binance Pay';
      next.coin = value === 'binance_usdt' ? 'USDT' : 'USDC';
      next.cryptoAmount = (next.amount / BOB_PER_USD).toFixed(2);
    }
  }

  if (value === 'proof_sent') {
    const paid = next.coin
      ? `Recibimos *${next.cryptoAmount} ${next.coin}* (≈ Bs. ${formatBs(next.amount)}) vía Binance Pay.`
      : `Recibimos *Bs. ${formatBs(next.amount)}* vía QR Simple.`;
    const balance = next.payType === 'half'
      ? `\nSaldo pendiente: *Bs. ${formatBs(next.full - next.amount)}*, a pagar en tienda.`
      : '\nTu servicio quedó pagado al 100%.';
    next.paymentSummary = paid + balance;
  }

  return next;
}

const findStepFor = (flow, value) =>
  flow.steps.find((s) => (Array.isArray(s.trigger) ? s.trigger.includes(value) : s.trigger === value));

const noop = () => {};

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
        <Link to="/demo/whatsapp" className="wa-fullscreen-link">
          <i className="fas fa-expand"></i> Ver en pantalla completa
        </Link>
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

/* ──────────────────── PAYMENT CARDS ──────────────────── */

const PayCard = ({ kind, ctx }) => {
  if (kind === 'binance') {
    return (
      <div className="wa-pay-card binance">
        <div className="wa-pay-head">
          <i className="fas fa-coins"></i>
          <span>Binance Pay</span>
          <em>{ctx.coin}</em>
        </div>
        <div className="wa-pay-qr">
          <QRCodeSVG
            value={`BINANCEPAY|${BINANCE_PAY_ID}|${ctx.coin}|${ctx.cryptoAmount}|${ctx.payRef}`}
            size={128}
            level="M"
          />
        </div>
        <div className="wa-pay-amount">{ctx.cryptoAmount} {ctx.coin}</div>
        <div className="wa-pay-sub">≈ Bs. {formatBs(ctx.amount)} · T/C {BOB_PER_USD}</div>
        <dl className="wa-pay-rows">
          <dt>Pay ID</dt><dd>{BINANCE_PAY_ID}</dd>
          <dt>Referencia</dt><dd>{ctx.payRef}</dd>
          <dt>Comisión</dt><dd>Sin costo</dd>
        </dl>
      </div>
    );
  }

  return (
    <div className="wa-pay-card qr-simple">
      <div className="wa-pay-head">
        <i className="fas fa-qrcode"></i>
        <span>QR Simple</span>
        <em>BOB</em>
      </div>
      <div className="wa-pay-qr">
        <QRCodeSVG
          value={`QRSIMPLE|${BUSINESS_NAME}|BOB|${ctx.amount}|${ctx.payRef}`}
          size={128}
          level="M"
        />
      </div>
      <div className="wa-pay-amount">Bs. {formatBs(ctx.amount)}</div>
      <div className="wa-pay-sub">{ctx.payType === 'half' ? 'Adelanto 50%' : 'Pago completo'}</div>
      <dl className="wa-pay-rows">
        <dt>Beneficiario</dt><dd>{BUSINESS_NAME}</dd>
        <dt>Referencia</dt><dd>{ctx.payRef}</dd>
        <dt>Vence</dt><dd>en 15 min</dd>
      </dl>
      <small className="wa-pay-note">Válido para todos los bancos y billeteras de Bolivia</small>
    </div>
  );
};

/* ──────────────────── CHAT WINDOW ──────────────────── */

const inputPlaceholders = {
  email: 'tucorreo@ejemplo.com',
  default: 'Escribe o elige una opción ↑',
};

const ChatWindow = ({ flow, onEvent, onBack, variant = 'phone' }) => {
  const [messages, setMessages] = useState([]);
  const [context, setContext] = useState({});
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [inputMode, setInputMode] = useState(null); // 'email'
  const [typedInput, setTypedInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const timers = useRef([]);
  const nextMsgId = useRef(0);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = useCallback((msg) => {
    const id = nextMsgId.current++;
    setMessages((prev) => [...prev, { ...msg, time: getTime(), id }]);
  }, []);

  const showAgentStep = useCallback(function show(step, ctx) {
    setIsTyping(true);
    const stepEvents = flow.stepEvents?.[step.id] ?? [{ title: 'Respuesta generada', desc: 'Agente IA' }];
    stepEvents.forEach((ev, i) => onEvent(ev, i * 500));
    const delay = Math.min(1000, Math.max(650, step.text.length * 7));

    later(() => {
      setIsTyping(false);
      addMessage({
        type: 'agent',
        text: resolveText(step.text, ctx),
        options: step.options?.map((o) => ({ ...o, label: resolveText(o.label, ctx) })),
        payCard: step.payCard,
        ctx: step.payCard ? ctx : undefined,
        location: step.location,
      });

      if (step.options) {
        setWaitingForInput(true);
      } else if (step.id === 'email_request') {
        setWaitingForInput(true);
        setInputMode('email');
      } else if (step.location) {
        const emailStep = flow.steps.find((s) => s.id === 'email_request');
        if (emailStep) later(() => show(emailStep, ctx), 1500);
      }
    }, delay);
  }, [flow, onEvent, later, addMessage]);

  // Mensaje inicial del agente
  useEffect(() => {
    const startStep = flow.steps.find((s) => s.isStart);
    if (startStep) later(() => showAgentStep(startStep, {}), 800);
  }, [flow, later, showAgentStep]);

  function handleOptionClick(option, typedText) {
    if (!waitingForInput) return;
    setWaitingForInput(false);

    const newCtx = applyChoice(context, option);
    setContext(newCtx);
    onEvent({ title: 'Mensaje recibido', desc: option.label });

    if (option.value === 'proof_sent') {
      addMessage({ type: 'customer', text: typedText ?? 'Aquí está mi comprobante', attachment: 'receipt' });
    } else {
      addMessage({ type: 'customer', text: typedText ?? option.label });
    }

    const nextStep = option.value === 'barbers'
      ? flow.steps.find((s) => s.id === 'barbers')
      : findStepFor(flow, option.value);
    if (nextStep) later(() => showAgentStep(nextStep, newCtx), 700);
  }

  function handleEmailInput() {
    const email = typedInput.trim();
    if (!email) return;
    setTypedInput('');
    setWaitingForInput(false);
    setInputMode(null);
    const newCtx = { ...context, userEmail: email };
    setContext(newCtx);
    addMessage({ type: 'customer', text: email });
    const farewellStep = flow.steps.find((s) => s.id === 'farewell');
    if (farewellStep) later(() => showAgentStep(farewellStep, newCtx), 700);
  }

  // Última burbuja con opciones: sólo esa acepta clics
  const activeOptionsMsg = [...messages].reverse().find((m) => m.options);

  // Texto libre cuando el agente espera que se elija una opción
  function handleFreeText() {
    const text = typedInput.trim();
    if (!text || !waitingForInput) return;
    setTypedInput('');

    const match = matchOption(text, activeOptionsMsg?.options);
    if (match) {
      handleOptionClick(match, text);
      return;
    }

    addMessage({ type: 'customer', text });
    onEvent({ title: 'Mensaje recibido', desc: 'Sin coincidencia, pidiendo aclaración' });
    setIsTyping(true);
    later(() => {
      setIsTyping(false);
      addMessage({
        type: 'agent',
        text: 'No estoy seguro de haberte entendido 🤔 Elige una de las opciones o escribe con otras palabras.',
      });
    }, 900);
  }

  const submit = inputMode === 'email' ? handleEmailInput : handleFreeText;

  return (
    <div className={`wa-chat-window ${variant}`}>
      {/* Header */}
      <div className="whatsapp-header">
        <button className="header-back" onClick={onBack} aria-label="Volver" disabled={!onBack}>
          <i className={variant === 'full' ? 'fas fa-arrow-left' : 'fas fa-chevron-left'}></i>
        </button>
        <div className="wa-header-contact">
          <div className="wa-contact-avatar">
            <img src="/OPTUSLOGO.png" alt="Agent" />
          </div>
          <div className="wa-contact-info">
            <div className="wa-contact-name">{flow.agentName}</div>
            <div className="wa-contact-status">{isTyping ? 'escribiendo…' : flow.agentStatus}</div>
          </div>
        </div>
        <div className="header-menu">
          <i className="fas fa-video"></i>
          <i className="fas fa-phone"></i>
          {variant === 'full' && <i className="fas fa-ellipsis-vertical"></i>}
        </div>
      </div>

      {/* Chat */}
      <div className="whatsapp-chat-bg" ref={chatRef}>
        <div className="chat-date-pill">Hoy</div>
        {variant === 'full' && (
          <div className="chat-e2e-pill">
            <i className="fas fa-lock"></i> Los mensajes están cifrados de extremo a extremo.
          </div>
        )}

        {messages.map((msg) => {
          const optionsActive = waitingForInput && msg === activeOptionsMsg;
          return (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.type}`}>
              <div className={`chat-bubble ${msg.type}`}>
                {msg.attachment === 'receipt' && (
                  <div className="wa-attachment">
                    <div className="wa-attachment-thumb">
                      <i className="fas fa-receipt"></i>
                    </div>
                    <div>
                      <strong>comprobante.jpg</strong>
                      <small>JPG · 184 KB</small>
                    </div>
                  </div>
                )}

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

                {msg.payCard && <PayCard kind={msg.payCard} ctx={msg.ctx} />}

                {msg.options && (
                  <div className="bubble-options">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        className={`bubble-option-btn ${!optionsActive ? 'used' : ''}`}
                        onClick={() => handleOptionClick(opt)}
                        disabled={!optionsActive}
                      >
                        {opt.label}
                      </button>
                    ))}
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
          );
        })}

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
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        ) : (
          <div className="input-box">
            <span>{inputPlaceholders.default}</span>
            <i className="far fa-face-smile text-gray"></i>
          </div>
        )}
        <button
          className="send-button"
          onClick={submit}
          disabled={!inputMode && !waitingForInput}
          aria-label="Enviar"
        >
          <i className={`fas ${inputMode || waitingForInput ? 'fa-paper-plane' : 'fa-microphone'}`}></i>
        </button>
      </div>
    </div>
  );
};

/* ──────────────────── PHONE MOCKUP ──────────────────── */

const PhoneMockup = ({ flow, onEvent }) => {
  const [clock, setClock] = useState(getTime);

  useEffect(() => {
    const tick = setInterval(() => setClock(getTime()), 30000);
    return () => clearInterval(tick);
  }, []);

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

          <ChatWindow flow={flow} onEvent={onEvent} />

          <div className="home-indicator"></div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────── FULLSCREEN (WhatsApp simulado) ──────────────────── */

const previewText = (flow) =>
  flow.steps.find((s) => s.isStart)?.text.replace(/\*/g, '') ?? '';

export const WhatsAppFullscreen = () => {
  const [active, setActive] = useState(0);
  const [view, setView] = useState('chat'); // en móvil: 'list' | 'chat'
  const [query, setQuery] = useState('');

  const visible = FLOWS
    .map((f, i) => ({ f, i }))
    .filter(({ f }) => normalize(`${f.agentName} ${f.label}`).includes(normalize(query)));

  function openChat(i) {
    setActive(i);
    setView('chat');
  }

  return (
    <div className={`wa-full view-${view}`}>
      <div className="wa-full-app">
        {/* Lista de chats */}
        <aside className="wa-full-sidebar">
          <div className="wa-full-sidebar-head">
            <div className="wa-full-me">
              <img src="/OPTUSLOGO.png" alt="OPTUS" />
              <strong>Chats</strong>
            </div>
            <div className="wa-full-head-actions">
              <i className="fas fa-camera"></i>
              <Link to="/" aria-label="Salir de la demo" title="Salir de la demo">
                <i className="fas fa-xmark"></i>
              </Link>
            </div>
          </div>

          <div className="wa-full-search">
            <i className="fas fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Buscar un chat"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <ul className="wa-full-chats">
            {visible.map(({ f, i }) => {
              const Icon = f.icon;
              return (
                <li key={f.label}>
                  <button
                    className={`wa-full-chat ${i === active ? 'active' : ''}`}
                    onClick={() => openChat(i)}
                  >
                    <span className="wa-full-chat-avatar">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="wa-full-chat-body">
                      <span className="wa-full-chat-top">
                        <strong>{f.agentName}</strong>
                        <small>{getTime()}</small>
                      </span>
                      <span className="wa-full-chat-preview">{previewText(f)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
            {visible.length === 0 && <li className="wa-full-empty">Sin resultados</li>}
          </ul>

          <p className="wa-full-footnote">
            <i className="fas fa-lock"></i> Demo interactiva de OPTUS · datos simulados
          </p>
        </aside>

        {/* Conversación */}
        <div className="wa-full-main">
          <ChatWindow
            key={active}
            flow={FLOWS[active]}
            onEvent={noop}
            onBack={() => setView('list')}
            variant="full"
          />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppDemo;
