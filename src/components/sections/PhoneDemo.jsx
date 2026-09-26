import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './PhoneDemo.css';

const SCENARIO_KEYS = ['product', 'schedule', 'payment'];
const SCENARIO_COLORS = { product: '#6C5CE7', schedule: '#00D9A5', payment: '#FF6B6B' };
const CANCELLED = 'cancelled';

const getTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

// Teléfono interactivo: el visitante elige una opción o escribe como cliente y ve
// cómo el agente responde mientras el panel muestra lo que pasa por detrás.
const PhoneDemo = () => {
  const { t } = useTranslation();
  const p = (key, opts) => t(`whyOptus.phone.${key}`, opts);
  const scenarios = p('scenarios', { returnObjects: true });

  const [clock, setClock] = useState(getTime);
  const [messages, setMessages] = useState(() => [{ role: 'bot', text: p('greeting'), time: getTime() }]);
  const [chips, setChips] = useState(SCENARIO_KEYS);
  const [events, setEvents] = useState(() => [
    { id: 0, title: p('initEvent.title'), desc: p('initEvent.desc'), status: 'done' }
  ]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [pendingFollow, setPendingFollow] = useState(null);
  const [input, setInput] = useState('');

  const chatRef = useRef(null);
  const eventsRef = useRef(null);
  const token = useRef(0);
  const nextId = useRef(1);

  useEffect(() => {
    const tick = setInterval(() => setClock(getTime()), 30000);
    return () => {
      clearInterval(tick);
      token.current += 1; // cancela cualquier secuencia en curso
    };
  }, []);

  // Scroll dentro de los contenedores (scrollIntoView movería toda la página)
  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, chips, result]);

  useEffect(() => {
    const el = eventsRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [events]);

  const wait = async (ms) => {
    const current = token.current;
    await new Promise((resolve) => setTimeout(resolve, ms));
    if (current !== token.current) throw CANCELLED;
  };

  const addMessage = (role, text) =>
    setMessages((prev) => [...prev, { role, text, time: getTime() }]);

  const runEvent = async ({ title, desc }) => {
    const id = nextId.current++;
    setEvents((prev) => [...prev, { id, title, desc, status: 'processing' }]);
    await wait(800);
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'done' } : e)));
  };

  const botReply = async (text) => {
    setTyping(true);
    await wait(1100);
    setTyping(false);
    addMessage('bot', text);
  };

  const play = async (key, phase, userText) => {
    const sc = scenarios[key];
    const isFirst = phase === 'first';
    setBusy(true);
    setChips([]);
    setPendingFollow(null);
    addMessage('user', userText ?? (isFirst ? sc.user : sc.followUser));

    try {
      await wait(400);
      for (const ev of isFirst ? sc.events : sc.followEvents) await runEvent(ev);
      await botReply(isFirst ? sc.bot : sc.final);
      if (isFirst) {
        setPendingFollow(key);
        setChips([key]);
      } else {
        setResult({ text: sc.result, color: SCENARIO_COLORS[key] });
      }
    } catch (err) {
      if (err !== CANCELLED) throw err;
      return;
    }
    setBusy(false);
  };

  const handleChip = (chip) => {
    if (busy) return;
    if (pendingFollow) {
      play(pendingFollow, 'follow');
      return;
    }
    play(chip, 'first');
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || busy || result) return;
    setInput('');

    if (pendingFollow) {
      play(pendingFollow, 'follow', text);
      return;
    }
    const lower = text.toLowerCase();
    const match = SCENARIO_KEYS.find((k) => scenarios[k].keywords.some((w) => lower.includes(w)));
    if (match) {
      play(match, 'first', text);
      return;
    }
    setBusy(true);
    setChips([]);
    addMessage('user', text);
    try {
      await wait(400);
      await botReply(p('fallback'));
    } catch (err) {
      if (err !== CANCELLED) throw err;
      return;
    }
    setChips(SCENARIO_KEYS);
    setBusy(false);
  };

  const reset = () => {
    token.current += 1;
    setMessages([{ role: 'bot', text: p('greeting'), time: getTime() }]);
    setEvents([{ id: 0, title: p('initEvent.title'), desc: p('initEvent.desc'), status: 'done' }]);
    setChips(SCENARIO_KEYS);
    setPendingFollow(null);
    setResult(null);
    setTyping(false);
    setBusy(false);
    setInput('');
  };

  const chipLabel = (chip) => (pendingFollow ? scenarios[pendingFollow].followChip : scenarios[chip].chip);

  return (
    <div className="phone-demo">
      <div className="phone-demo-stage">
        <div className="phone-mockup">
          <span className="phone-btn phone-btn-left" />
          <span className="phone-btn phone-btn-right" />
          <div className="phone-screen">
            <div className="phone-notch" />
            <div className="phone-statusbar">
              <span>{clock}</span>
              <span className="phone-statusbar-icons">
                <i className="fas fa-signal"></i>
                <i className="fas fa-wifi"></i>
                <i className="fas fa-battery-full"></i>
              </span>
            </div>

            <div className="wa-header">
              <i className="fas fa-arrow-left"></i>
              <div className="wa-avatar"><i className="fas fa-robot"></i></div>
              <div className="wa-contact">
                <strong>{p('agent')}</strong>
                <small>{typing ? p('typing') : p('online')}</small>
              </div>
            </div>

            <div className="wa-chat" ref={chatRef}>
              {messages.map((m, i) => (
                <div key={i} className={`wa-bubble ${m.role === 'user' ? 'wa-out' : 'wa-in'}`}>
                  {m.text}
                  <span className="wa-meta">
                    {m.time} {m.role === 'user' && <i className="fas fa-check-double"></i>}
                  </span>
                </div>
              ))}
              {typing && (
                <div className="wa-bubble wa-in wa-typing">
                  <span></span><span></span><span></span>
                </div>
              )}
              {!busy && !result && chips.length > 0 && (
                <div className="wa-chips">
                  {chips.map((chip) => (
                    <button key={chip} className="wa-chip" onClick={() => handleChip(chip)}>
                      {chipLabel(chip)}
                    </button>
                  ))}
                </div>
              )}
              {result && (
                <div className="wa-action" style={{ backgroundColor: result.color }}>
                  <i className="fas fa-check-circle"></i>
                  {result.text}
                </div>
              )}
            </div>

            {result ? (
              <button className="wa-restart" onClick={reset}>
                <i className="fas fa-redo"></i> {p('restart')}
              </button>
            ) : (
              <form
                className="wa-input"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={p('placeholder')}
                  disabled={busy}
                  aria-label={p('placeholder')}
                />
                <button type="submit" disabled={busy || !input.trim()} aria-label="Enviar">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            )}
            <div className="phone-home" />
          </div>
        </div>
      </div>

      <div className="phone-demo-side">
        <div className="try-card">
          <h3>{p('tryIt')}</h3>
          <p>{p('tryItDesc')}</p>
        </div>

        <div className="activity-card">
          <div className="activity-head">
            <strong>{p('activityTitle')}</strong>
            <span className="activity-live">
              <span className="status-dot"></span> {p('activityLive')}
            </span>
          </div>
          <div className="activity-list" ref={eventsRef}>
            {events.map((ev) => (
              <div key={ev.id} className={`activity-item ${ev.status}`}>
                <span className="activity-icon">
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
    </div>
  );
};

export default PhoneDemo;
