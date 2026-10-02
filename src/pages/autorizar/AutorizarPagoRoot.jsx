import AutorizarPago from './AutorizarPago';

// Entrada liviana para /autorizar/:id: no carga Privy, Supabase ni el resto del sitio,
// así la página abre rápido desde el enlace de WhatsApp.
export default function AutorizarPagoRoot() {
  const [, encodedId = ''] = window.location.pathname.match(/^\/autorizar\/([^/?#]+)/) ?? [];
  return <AutorizarPago requestId={decodeURIComponent(encodedId)} />;
}
