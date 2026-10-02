import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CircleCheck,
  CircleX,
  Clock,
  Copy,
  ExternalLink,
  FingerprintPattern,
  LoaderCircle,
  Lock,
  Package,
  ShieldCheck,
  TriangleAlert,
  Wallet,
} from 'lucide-react';
import { supplierPaymentsApi as api } from '../../utils/supplierPaymentsApi';
import {
  createPasskey,
  hasPlatformAuthenticator,
  isWebAuthnSupported,
  signWithPasskey,
} from '../../utils/webauthn';
import './AutorizarPago.css';

const STORAGE_KEY = 'optus.passkeys';
const PREFETCH_MAX_AGE_MS = 4 * 60_000;

const STEPS = [
  'Autorización firmada con tu huella',
  'Enviando USDC desde Avalanche',
  'Verificando la transferencia entre redes',
  'Acreditando en la cuenta Stellar del proveedor',
  'Pago recibido por el proveedor',
];

const readStoredCredentials = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
};

const rememberCredential = (id) => {
  try {
    const ids = new Set(readStoredCredentials());
    ids.add(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // almacenamiento no disponible: se volverá a registrar si hace falta
  }
};

const forgetCredential = (id) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(readStoredCredentials().filter((c) => c !== id)));
  } catch {
    // ignorar
  }
};

const shortAddress = (value, head = 6, tail = 4) =>
  value && value.length > head + tail + 1 ? `${value.slice(0, head)}…${value.slice(-tail)}` : value;

function stepIndex(order) {
  if (order.status === 'COMPLETED') return STEPS.length;
  switch (order.settlement?.state) {
    case 'BURN_CONFIRMED':
    case 'ATTESTED':
      return 2;
    case 'MINT_SUBMITTED':
      return 3;
    case 'SETTLED':
      return STEPS.length;
    default:
      return 1;
  }
}

function friendlyError(error) {
  if (error?.name === 'NotAllowedError') return 'Se canceló la lectura de huella o se agotó el tiempo. Inténtalo de nuevo.';
  if (error?.name === 'SecurityError') return 'Este enlace no puede usar la huella en este dominio. Ábrelo desde el enlace original.';
  if (error?.name === 'UnsupportedBrowser') return error.message;
  if (error?.status === 410) return 'La solicitud venció.';
  if (error?.status === 409) return 'Esta orden ya fue procesada.';
  if (error?.status === 403) return 'No pudimos verificar la firma con tu huella. Inténtalo de nuevo.';
  if (error instanceof TypeError) return 'No hay conexión con OPTUS. Revisa tu internet e inténtalo de nuevo.';
  return error?.message || 'Ocurrió un error inesperado.';
}

function useCountdown(expiresAt, active) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [active]);
  const left = Math.max(0, Date.parse(expiresAt ?? 0) - now);
  const minutes = Math.floor(left / 60_000);
  const seconds = Math.floor((left % 60_000) / 1000);
  return { left, label: `${minutes}:${String(seconds).padStart(2, '0')}` };
}

export default function AutorizarPago({ requestId }) {
  const [order, setOrder] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [busy, setBusy] = useState(null);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [ceremony, setCeremony] = useState(null);
  const [confirmReject, setConfirmReject] = useState(false);
  const [platformReady, setPlatformReady] = useState(true);
  const [copied, setCopied] = useState(false);
  const prefetched = useRef(null);

  const supported = isWebAuthnSupported();
  const pending = order?.status === 'PENDING_APPROVAL';
  const countdown = useCountdown(order?.expiresAt, pending);

  useEffect(() => {
    document.title = 'Autorización de pago · OPTUS';
    hasPlatformAuthenticator().then(setPlatformReady);
  }, []);

  const load = useCallback(async () => {
    try {
      const view = await api.get(requestId);
      setOrder(view);
      setLoadError(null);
      return view;
    } catch (err) {
      if (err.status === 404) setLoadError('No encontramos esta orden. Revisa que el enlace esté completo.');
      else setLoadError(friendlyError(err));
      return null;
    }
  }, [requestId]);

  useEffect(() => {
    load();
  }, [load]);

  // Seguimiento: rápido mientras se procesa el pago, lento mientras espera la firma.
  useEffect(() => {
    if (!order || !['PROCESSING', 'PENDING_APPROVAL'].includes(order.status)) return undefined;
    const timer = setInterval(load, order.status === 'PROCESSING' ? 2500 : 15_000);
    return () => clearInterval(timer);
  }, [order, load]);

  const knownOnDevice = useMemo(() => {
    const stored = readStoredCredentials();
    return Boolean(order?.passkeys?.some((p) => stored.includes(p.id)));
  }, [order?.passkeys]);

  // El reto se pide antes del toque: Safari exige que la huella se pida dentro del gesto.
  const prefetch = useCallback(
    async (purpose) => {
      try {
        const options = await api.options(requestId, purpose);
        prefetched.current = { purpose, options, at: Date.now() };
      } catch (err) {
        prefetched.current = null;
        if (err.status === 409 || err.status === 410) load();
      }
    },
    [requestId, load],
  );

  const activeCeremony = ceremony ?? (knownOnDevice ? 'authenticate' : 'register');

  useEffect(() => {
    if (!pending || !supported || busy) return undefined;
    const purpose = activeCeremony;
    const current = prefetched.current;
    if (!current || current.purpose !== purpose || Date.now() - current.at > PREFETCH_MAX_AGE_MS) prefetch(purpose);
    const timer = setInterval(() => prefetch(purpose), PREFETCH_MAX_AGE_MS);
    return () => clearInterval(timer);
  }, [pending, supported, busy, activeCeremony, prefetch]);

  const optionsFor = async (purpose) => {
    const current = prefetched.current;
    prefetched.current = null;
    if (current && current.purpose === purpose && Date.now() - current.at < PREFETCH_MAX_AGE_MS) return current.options;
    return api.options(requestId, purpose);
  };

  const sign = async () => {
    setBusy('Esperando tu huella…');
    const assertion = await signWithPasskey(await optionsFor('authenticate'));
    rememberCredential(assertion.credentialId);
    setBusy('Verificando la firma…');
    try {
      const view = await api.approve(requestId, assertion);
      setOrder(view);
      setNotice(null);
    } catch (err) {
      if (err.code === 'UNKNOWN_CREDENTIAL') {
        forgetCredential(assertion.credentialId);
        setCeremony('register');
        throw Object.assign(new Error('Registra tu huella en este dispositivo para continuar.'), { name: 'Handled' });
      }
      throw err;
    }
  };

  const authorize = async () => {
    setError(null);
    setConfirmReject(false);
    try {
      if (activeCeremony === 'register') {
        setBusy('Registrando tu huella…');
        try {
          const attestation = await createPasskey(await optionsFor('register'));
          await api.register(requestId, attestation);
          rememberCredential(attestation.credentialId);
          await load();
        } catch (err) {
          // InvalidStateError: este dispositivo ya tiene una huella registrada para este administrador.
          if (err?.name !== 'InvalidStateError') throw err;
        }
        setCeremony('authenticate');
        try {
          await sign();
        } catch (err) {
          if (err?.name !== 'NotAllowedError') throw err;
          // Algunos navegadores piden un segundo toque para firmar.
          setNotice('Huella registrada. Toca «Firmar con huella» para autorizar el pago.');
        }
      } else {
        await sign();
      }
    } catch (err) {
      setError(friendlyError(err));
      if (err?.status === 409 || err?.status === 410) load();
    } finally {
      setBusy(null);
    }
  };

  const reject = async () => {
    if (!confirmReject) {
      setConfirmReject(true);
      return;
    }
    setError(null);
    setBusy('Rechazando la orden…');
    try {
      setOrder(await api.reject(requestId));
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setBusy(null);
      setConfirmReject(false);
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(order.supplier.stellarAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // portapapeles no disponible
    }
  };

  if (loadError && !order) {
    return (
      <Shell>
        <StatusPanel icon={<TriangleAlert />} tone="warn" title="Enlace no disponible" text={loadError} />
      </Shell>
    );
  }
  if (!order) {
    return (
      <Shell>
        <div className="ap-loading" role="status">
          <LoaderCircle className="ap-spin" aria-hidden="true" />
          <span>Cargando la orden…</span>
        </div>
      </Shell>
    );
  }

  const settledLinks = order.settlement?.links ?? {};

  return (
    <Shell>
      <header className="ap-head">
        <p className="ap-eyebrow">
          <Lock aria-hidden="true" /> Autorización de pago a proveedor
        </p>
        <h1 className="ap-title">Orden {order.orderNumber}</h1>
        <p className="ap-sub">
          {order.company.name}
          {order.requester.name ? ` · Solicitada por ${order.requester.name}` : ''}
        </p>
      </header>

      <section className="ap-total" aria-label="Total a pagar">
        <span className="ap-total-label">{order.status === 'COMPLETED' ? 'Total pagado' : 'Total a pagar'}</span>
        <strong className="ap-total-amount">
          {order.totalUsdc} <span>USDC</span>
        </strong>
        <span className="ap-route">
          {order.route.source} <ArrowRight aria-hidden="true" /> {order.route.destination}
        </span>
      </section>

      {order.status === 'COMPLETED' && (
        <StatusPanel
          icon={<CircleCheck />}
          tone="ok"
          title="Pago completado"
          text={`${order.supplier.name} recibió ${order.settlement?.amountReceived ?? `${order.totalUsdc} USDC`}. Te enviamos el comprobante por WhatsApp.`}
        >
          <ExplorerLinks links={settledLinks} />
        </StatusPanel>
      )}
      {order.status === 'FAILED' && (
        <StatusPanel
          icon={<TriangleAlert />}
          tone="warn"
          title="No se pudo completar el pago"
          text={`${order.failureReason ? `Motivo: ${order.failureReason}. ` : ''}Puedes solicitar la compra de nuevo desde WhatsApp.`}
        >
          <ExplorerLinks links={settledLinks} />
        </StatusPanel>
      )}
      {order.status === 'REJECTED' && (
        <StatusPanel icon={<CircleX />} tone="muted" title="Orden rechazada" text="No se realizó ningún pago." />
      )}
      {order.status === 'EXPIRED' && (
        <StatusPanel
          icon={<Clock />}
          tone="muted"
          title="La solicitud venció"
          text="Escribe de nuevo por WhatsApp para generar una nueva orden de compra."
        />
      )}

      {order.status === 'PROCESSING' && (
        <section className="ap-card" aria-live="polite">
          <h2 className="ap-card-title">Procesando el pago</h2>
          <ol className="ap-steps">
            {STEPS.map((label, index) => {
              const current = stepIndex(order);
              const state = index < current ? 'done' : index === current ? 'active' : 'todo';
              return (
                <li key={label} className={`ap-step ap-step-${state}`}>
                  <span className="ap-step-dot" aria-hidden="true">
                    {state === 'done' ? <Check /> : state === 'active' ? <LoaderCircle className="ap-spin" /> : null}
                  </span>
                  <span>{label}</span>
                </li>
              );
            })}
          </ol>
          <ExplorerLinks links={settledLinks} />
        </section>
      )}

      <section className="ap-card">
        <h2 className="ap-card-title">
          <Building2 aria-hidden="true" /> Proveedor
        </h2>
        <p className="ap-strong">{order.supplier.name}</p>
        <p className="ap-muted">
          NIT {order.supplier.taxId} · {order.supplier.city}
        </p>
        <div className="ap-row">
          <span className="ap-muted">Cuenta Stellar</span>
          <button type="button" className="ap-chip" onClick={copyAddress} title={order.supplier.stellarAddress}>
            <span className="ap-mono">{shortAddress(order.supplier.stellarAddress)}</span>
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            <span className="ap-sr">{copied ? 'Copiada' : 'Copiar cuenta'}</span>
          </button>
        </div>
      </section>

      <section className="ap-card">
        <h2 className="ap-card-title">
          <Package aria-hidden="true" /> Detalle de la compra
        </h2>
        {order.lines.map((item) => (
          <div className="ap-line" key={item.sku}>
            <div>
              <p className="ap-strong">
                {item.quantity} {item.quantity === 1 ? item.unit : item.unitPlural}
              </p>
              <p className="ap-muted">{item.description}</p>
              <p className="ap-muted">{item.unitPriceUsdc} USDC c/u</p>
            </div>
            <span className="ap-strong ap-nowrap">{item.subtotalUsdc} USDC</span>
          </div>
        ))}
        <div className="ap-sum">
          <span>Total</span>
          <span>{order.totalUsdc} USDC</span>
        </div>
      </section>

      <section className="ap-card ap-meta">
        <div className="ap-row">
          <span className="ap-muted">
            <Wallet aria-hidden="true" /> Cuenta de origen
          </span>
          <span className="ap-mono">{order.payer ? shortAddress(order.payer) : '—'}</span>
        </div>
        <div className="ap-row">
          <span className="ap-muted">Solicitante</span>
          <span>{order.requester.phone}</span>
        </div>
        <div className="ap-row">
          <span className="ap-muted">Código de verificación</span>
          <span className="ap-mono">{order.verificationCode}</span>
        </div>
        {pending && (
          <div className="ap-row">
            <span className="ap-muted">
              <Clock aria-hidden="true" /> Vence en
            </span>
            <span className="ap-mono">{countdown.label}</span>
          </div>
        )}
      </section>

      {pending && (
        <section className="ap-actions">
          {!supported ? (
            <p className="ap-alert">
              {window.isSecureContext
                ? 'Este navegador no permite firmar con huella. Abre el enlace en Chrome o Safari de tu teléfono.'
                : 'Para firmar con tu huella abre el enlace seguro (https) que recibiste por WhatsApp.'}
            </p>
          ) : (
            <>
              {notice && <p className="ap-notice">{notice}</p>}
              {error && (
                <p className="ap-alert" role="alert">
                  {error}
                </p>
              )}
              <button type="button" className="ap-primary" onClick={authorize} disabled={Boolean(busy) || countdown.left === 0}>
                {busy ? <LoaderCircle className="ap-spin" aria-hidden="true" /> : <FingerprintPattern aria-hidden="true" />}
                <span>{busy ?? (activeCeremony === 'register' ? 'Autorizar con huella' : 'Firmar con huella')}</span>
              </button>
              {activeCeremony === 'register' && !busy && (
                <p className="ap-hint">
                  Primera vez en este teléfono: registraremos tu huella y luego firmarás la orden.
                  {!platformReady && ' Activa el bloqueo de pantalla con huella si aún no lo tienes.'}
                </p>
              )}
              <button type="button" className={`ap-secondary${confirmReject ? ' ap-danger' : ''}`} onClick={reject} disabled={Boolean(busy)}>
                {confirmReject ? 'Toca de nuevo para rechazar' : 'Rechazar orden'}
              </button>
            </>
          )}
          <p className="ap-fine">
            <ShieldCheck aria-hidden="true" /> Tu huella se verifica en tu teléfono; OPTUS solo recibe la firma de esta orden.
          </p>
        </section>
      )}
    </Shell>
  );
}

function Shell({ children }) {
  return (
    <div className="ap-page">
      <main className="ap-wrap">
        <div className="ap-brand">
          <img src="/OPTUSLOGO.png" alt="OPTUS" width="36" height="36" />
          <span>OPTUS</span>
          <span className="ap-secure">
            <Lock aria-hidden="true" /> Conexión segura
          </span>
        </div>
        {children}
        <footer className="ap-footer">Pagos a proveedores · OPTUS × TilcAI</footer>
      </main>
    </div>
  );
}

function StatusPanel({ icon, tone, title, text, children }) {
  return (
    <section className={`ap-status ap-status-${tone}`} role="status">
      <span className="ap-status-icon" aria-hidden="true">
        {icon}
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      {children}
    </section>
  );
}

function ExplorerLinks({ links }) {
  if (!links?.source && !links?.destination) return null;
  return (
    <div className="ap-links">
      {links.source && (
        <a className="ap-link" href={links.source} target="_blank" rel="noreferrer">
          <span>
            <strong>Avalanche</strong> · Snowtrace
          </span>
          <ExternalLink aria-hidden="true" />
        </a>
      )}
      {links.destination && (
        <a className="ap-link" href={links.destination} target="_blank" rel="noreferrer">
          <span>
            <strong>Stellar</strong> · Stellar Expert
          </span>
          <ExternalLink aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
