import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton, lightTheme } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useSignTypedData, useSwitchChain } from 'wagmi';
import { config } from '../wagmi.config';
import { supabase } from '../utils/supabaseClient';
import { keccak256, toHex } from 'viem';
import { jsPDF } from 'jspdf';
import FinisherBackgroundSafe from '../components/ui/FinisherBackgroundSafe';
import ThemeLanguageToggle from '../components/ui/ThemeLanguageToggle';
import '@rainbow-me/rainbowkit/styles.css';
import './Pago.css';

const queryClient = new QueryClient();

const resolveAgentBackendUrl = () => {
  const sources = [];

  try {
    if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
      sources.push(import.meta.env);
    }
  } catch (err) {
    // ignore environments sin soporte de import.meta
  }

  if (typeof window !== 'undefined') {
    if (window.__ENV) {
      sources.push(window.__ENV);
    }
    sources.push({ VITE_AGENT_BACKEND_URL: window.location?.origin });
  }

  if (typeof process !== 'undefined' && process.env) {
    sources.push(process.env);
  }

  for (const source of sources) {
    if (!source) continue;
    if (source.VITE_AGENT_BACKEND_URL) return source.VITE_AGENT_BACKEND_URL;
    if (source.AGENT_BACKEND_URL) return source.AGENT_BACKEND_URL;
  }

  return '';
};

const agentBackendBaseUrl = resolveAgentBackendUrl();

const PagoContent = () => {
  const { t } = useTranslation();
  const { codigoOrden } = useParams();

  const [metodoPago, setMetodoPago] = useState('qr');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address: address,
    enabled: !!address,
  });
  const { signTypedDataAsync } = useSignTypedData();
  const { switchChainAsync } = useSwitchChain();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        // Si no hay código de orden, mostrar datos demo
        if (!codigoOrden) {
          const demoOrder = {
            id: 'demo-order-12345',
            company: { name: 'Demo Company' },
            user: { phone: '+591 77379190' },
            details: 'Demostración de pago Optimype',
            total_amount: 150.00,
            status: 'CART',
            metadata: {
              x402_negotiation: {
                accepts: [
                  {
                    type: 'fiat',
                    amountRequired: 150.00,
                    symbol: 'Bs.',
                    maxTimeoutSeconds: 900,
                    base64QrSimple: 'data:image/png;base64,demo'
                  },
                  {
                    type: 'crypto',
                    amountRequired: 100,
                    network: 'avalanche-fuji',
                    asset: '0x1234567890abcdef',
                    maxTimeoutSeconds: 300,
                    payTo: '0xDemo1234567890'
                  }
                ]
              }
            }
          };
          setOrderData(demoOrder);
          setLoading(false);
          return;
        }
        // Validar que sea un UUID válido
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(codigoOrden)) {
          setError('ID de orden inválido. Debe ser un UUID válido.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            company:companies(name, config),
            user:company_users(phone)
          `)
          .eq('id', codigoOrden)
          .single();

        if (error) throw error;
        if (!data) {
          setError('Orden no encontrada');
          return;
        }

        setOrderData(data);

        // Extraer datos X402 desde metadata.x402_negotiation (nuevo formato)
        const x402Source = data.metadata?.x402_negotiation || data.metadata;
        if (x402Source?.accepts) {
          const fiatAccept = x402Source.accepts.find(a => a.type === 'fiat');
          if (fiatAccept?.base64QrSimple) {
            // El QR viene en base64, agregar prefijo data:image si no lo tiene
            const qrBase64 = fiatAccept.base64QrSimple;
            if (qrBase64.startsWith('data:image')) {
              setQrData(qrBase64);
            } else if (qrBase64.startsWith('/9j/') || qrBase64.startsWith('iVBOR')) {
              // Es base64 puro, agregar prefijo
              setQrData(`data:image/jpeg;base64,${qrBase64}`);
            } else {
              setQrData(qrBase64);
            }
          }
        }

      } catch (err) {
        console.error('Error al cargar orden:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Ejecutar fetchOrderData siempre (con o sin codigo de orden)
    fetchOrderData();
  }, [codigoOrden]);

  const generateFiatQR = async () => {
    try {
      setLoading(true);

      // Si es modo demo, mostrar QR demo
      if (!codigoOrden || orderData.id === 'demo-order-12345') {
        const demoQR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzMzIiBmb250LXNpemU9IjEycHgiPgogICAgREVNTzxicj5RUiBDb2RlCiAgPC90ZXh0Pgo8L3N2Zz4=';
        setQrData(demoQR);

        setOrderData(prev => ({
          ...prev,
          status: 'QR_SENT'
        }));

        setLoading(false);
        return;
      }

      // Extraer el QR desde metadata.x402_negotiation
      const x402Data = orderData.metadata?.x402_negotiation || orderData.metadata;

      if (x402Data?.accepts) {
        const fiatAccept = x402Data.accepts.find(a => a.type === 'fiat');

        if (fiatAccept?.base64QrSimple) {
          // El QR ya existe en el metadata X402
          const qrBase64 = fiatAccept.base64QrSimple;

          // Agregar prefijo data:image si no lo tiene
          if (qrBase64.startsWith('data:image')) {
            setQrData(qrBase64);
          } else if (qrBase64.startsWith('/9j/') || qrBase64.startsWith('iVBOR')) {
            // Es base64 puro, agregar prefijo
            setQrData(`data:image/jpeg;base64,${qrBase64}`);
          } else {
            setQrData(qrBase64);
          }

          // Actualizar estado de la orden
          const { error } = await supabase
            .from('orders')
            .update({
              status: 'QR_SENT',
              updated_at: new Date().toISOString()
            })
            .eq('id', orderData.id);

          if (error) throw error;

          setOrderData(prev => ({
            ...prev,
            status: 'QR_SENT'
          }));
        } else {
          throw new Error('QR no disponible en x402_negotiation');
        }
      } else {
        throw new Error('x402_negotiation no disponible');
      }

    } catch (err) {
      console.error('Error al generar QR:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(t('payment.alerts.copiedToClipboard'));
  };

  // Procesar pago crypto con EIP-3009
  const processCryptoPayment = async () => {
    if (!isConnected || !address) {
      alert(t('payment.alerts.connectWallet'));
      return;
    }

    // Si es demo, simular procesamiento de pago crypto
    if (!codigoOrden || orderData.id === 'demo-order-12345') {
      try {
        setPaymentProcessing(true);
        setPaymentStatus('Simulando pago crypto...');

        setTimeout(() => {
          setPaymentStatus(t('payment.alerts.paymentCompleted'));
          setOrderData(prev => ({
            ...prev,
            status: 'COMPLETED'
          }));
          setPaymentProcessing(false);
        }, 3000);

      } catch (err) {
        setPaymentProcessing(false);
        setPaymentStatus(null);
        alert('Error en simulación: ' + err.message);
      }
      return;
    }

    const x402Source = orderData.metadata?.x402_negotiation || orderData.metadata;
    const cryptoAccept = x402Source?.accepts?.find(a => a.type === 'crypto');
    if (!cryptoAccept) {
      alert(t('payment.alerts.noCryptoInfo'));
      return;
    }

    try {
      setPaymentProcessing(true);
      setPaymentStatus('Preparando autorización de pago...');

      // Verificar que estemos en la red correcta (Avalanche Fuji = 43113)
      const requiredChainId = 43113;
      if (chain?.id !== requiredChainId) {
        setPaymentStatus('Cambiando a la red Avalanche Fuji...');
        try {
          await switchChainAsync({ chainId: requiredChainId });
          setPaymentStatus('Red cambiada correctamente. Preparando pago...');
        } catch (switchError) {
          throw new Error('Debes cambiar a la red Avalanche Fuji para continuar');
        }
      }

      // Crear nonce aleatorio usando crypto nativo del navegador
      const nonceBytes = new Uint8Array(32);
      crypto.getRandomValues(nonceBytes);
      const nonce = toHex(nonceBytes);

      // Timestamps
      const validAfter = Math.floor(Date.now() / 1000).toString();
      const validBefore = (Math.floor(Date.now() / 1000) + (cryptoAccept.maxTimeoutSeconds || 300)).toString();

      // Crear autorización EIP-3009
      const authorization = {
        from: address,
        to: cryptoAccept.payTo,
        value: cryptoAccept.amountRequired || cryptoAccept.AmountRequired,
        validAfter: validAfter,
        validBefore: validBefore,
        nonce: nonce
      };

      // Imprimir la solicitud de autorización en consola (debug)
      console.log('EIP-3009 authorization:', authorization);

      // Domain para EIP-712 (USDC en Avalanche Fuji)
      const domain = {
        name: 'USD Coin',
        version: '2',
        chainId: 43113, // Avalanche Fuji testnet
        verifyingContract: cryptoAccept.asset
      };

      // Types para EIP-712 (TransferWithAuthorization)
      const types = {
        TransferWithAuthorization: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'validAfter', type: 'uint256' },
          { name: 'validBefore', type: 'uint256' },
          { name: 'nonce', type: 'bytes32' }
        ]
      };

      setPaymentStatus('Esperando firma en tu wallet...');

      // Firmar con EIP-712
      const signature = await signTypedDataAsync({
        domain,
        types,
        primaryType: 'TransferWithAuthorization',
        message: authorization
      });

      setPaymentStatus('Enviando pago al backend...');

      // Crear payload X402 (SOLO estructura X402 estándar, sin orderId/details)
      // Los campos orderId, details, etc. van en query params, NO en X-PAYMENT
      const x402Payload = {
        x402Version: 1,
        scheme: cryptoAccept.scheme || 'exact',
        network: cryptoAccept.network,
        payload: {
          signature: signature,
          authorization: authorization
        }
      };

      // Imprimir el payload X-PAYMENT que se enviará al backend
      console.log('X-PAYMENT payload (crypto):', x402Payload);

      // Codificar en base64
      const xPaymentHeader = btoa(JSON.stringify(x402Payload));

      // Enviar al backend del agente
      const backendUrl = agentBackendBaseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
      if (!backendUrl) {
        throw new Error('Configura VITE_AGENT_BACKEND_URL para continuar con el pago.');
      }

      const normalizedBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      const payUrl = new URL(`${normalizedBase}/api/pay`);
      payUrl.searchParams.set('orderId', orderData.id);

      const x402Resource = x402Source?.resource || orderData.metadata?.x402_negotiation?.resource;
      if (x402Resource) {
        payUrl.searchParams.set('resource', x402Resource);
      }

      if (orderData.details) {
        payUrl.searchParams.set('description', orderData.details);
      } else if (orderData.metadata?.description) {
        payUrl.searchParams.set('description', orderData.metadata.description);
      }

      const fiatAccept = x402Source?.accepts?.find(a => a.type === 'fiat');
      const fiatAmount = fiatAccept?.amountRequired || fiatAccept?.AmountRequired || fiatAccept?.maxAmountRequired || orderData.total_amount;
      if (fiatAmount) {
        payUrl.searchParams.set('fiatAmount', String(fiatAmount));
      }

      const fiatCurrency = fiatAccept?.currency || x402Source?.currency;
      if (fiatCurrency) {
        payUrl.searchParams.set('currency', fiatCurrency);
      }

      const fiatSymbol = fiatAccept?.symbol || x402Source?.symbol;
      if (fiatSymbol) {
        payUrl.searchParams.set('symbol', fiatSymbol);
      }

      const amountUsdFromMetadata = x402Source?.amountUsd || orderData.metadata?.amountUsd;
      const cryptoAmountBaseUnits =
        cryptoAccept?.amountRequired ||
        cryptoAccept?.AmountRequired ||
        cryptoAccept?.maxAmountRequired ||
        null;
      if (!amountUsdFromMetadata && cryptoAmountBaseUnits) {
        const decimals = cryptoAccept?.decimals ?? 6;
        const divisor = Math.pow(10, decimals);
        const parsedAmount = Number(cryptoAmountBaseUnits) / divisor;
        if (!Number.isNaN(parsedAmount) && Number.isFinite(parsedAmount)) {
          payUrl.searchParams.set('amountUsd', parsedAmount.toString());
        }
      } else if (amountUsdFromMetadata) {
        payUrl.searchParams.set('amountUsd', String(amountUsdFromMetadata));
      }

      const requestHeaders = {
        'X-PAYMENT': xPaymentHeader,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const shouldBypassNgrokWarning = normalizedBase.toLowerCase().includes('ngrok');

      if (shouldBypassNgrokWarning) {
        requestHeaders['ngrok-skip-browser-warning'] = 'true';
      }

      const response = await fetch(payUrl.toString(), {
        method: 'GET',
        headers: requestHeaders
      });

      const xPaymentResponse = response.headers.get('X-PAYMENT-RESPONSE');

      if (response.ok && xPaymentResponse) {
        const paymentResponse = JSON.parse(atob(xPaymentResponse));

        if (paymentResponse.success) {
          setPaymentStatus(t('payment.alerts.paymentCompleted'));

          // Actualizar orden en Supabase
          await supabase
            .from('orders')
            .update({
              status: 'COMPLETED',
              metadata: {
                ...orderData.metadata,
                payment_response: paymentResponse,
                transaction_hash: paymentResponse.transaction,
                completed_at: new Date().toISOString()
              },
              updated_at: new Date().toISOString()
            })
            .eq('id', orderData.id);

          // Recargar datos de la orden
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          throw new Error(paymentResponse.errorReason || 'Error al procesar el pago');
        }
      } else {
        const rawBody = await response.text();
        let errorMessage = 'Error al procesar el pago en el backend';

        if (rawBody) {
          try {
            const parsed = JSON.parse(rawBody);
            errorMessage = parsed.error || parsed.message || errorMessage;
          } catch (parseErr) {
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('text/html')) {
              errorMessage = 'El backend devolvió HTML en lugar de JSON. Verifica el endpoint o la cabecera ngrok-skip-browser-warning.';
            } else {
              errorMessage = rawBody.trim() || errorMessage;
            }
          }
        }

        throw new Error(errorMessage);
      }

    } catch (err) {
      console.error('Error al procesar pago:', err);
      setError(err.message);
      setPaymentStatus('Error: ' + err.message);

      setTimeout(() => {
        setPaymentStatus(null);
        setPaymentProcessing(false);
      }, 5000);
    } finally {
      if (!error) {
        setPaymentProcessing(false);
      }
    }
  };

  const verifyPayment = async () => {
    try {
      setLoading(true);

      // Si es demo, simular verificación exitosa
      if (!codigoOrden || orderData.id === 'demo-order-12345') {
        setTimeout(() => {
          setOrderData(prev => ({
            ...prev,
            status: 'COMPLETED'
          }));
          alert(t('payment.alerts.paymentCompleted'));
          setLoading(false);
        }, 2000);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('status, metadata')
        .eq('id', orderData.id)
        .single();

      if (error) throw error;

      setOrderData(prev => ({ ...prev, ...data }));

      if (data.status === 'COMPLETED') {
        alert(t('payment.alerts.paymentCompleted'));
      } else if (data.status === 'VERIFYING_PAYMENT') {
        alert('Pago en verificación. Por favor espera...');
      } else {
        alert('Pago aún no detectado. Intenta nuevamente en unos momentos.');
      }

    } catch (err) {
      console.error('Error al verificar pago:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!confirm(t('payment.alerts.confirmCancel'))) return;

    try {
      // Si es demo, simular cancelación
      if (!codigoOrden || orderData.id === 'demo-order-12345') {
        alert(t('payment.alerts.orderCancelled'));
        window.location.href = '/';
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({
          status: 'FAILED',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderData.id);

      if (error) throw error;

      alert(t('payment.alerts.orderCancelled'));
      window.location.href = '/';
    } catch (err) {
      console.error('Error al cancelar orden:', err);
      setError(err.message);
    }
  };

  // Extract data for rendering sections
  const getX402Source = () => orderData?.metadata?.x402_negotiation || orderData?.metadata;
  const getFiatAccept = () => getX402Source()?.accepts?.find(a => a.type === 'fiat');
  const getCryptoAccept = () => getX402Source()?.accepts?.find(a => a.type === 'crypto');

  // PDF Receipt Generator
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const generateReceipt = useCallback(async () => {
    if (!orderData) return;
    setGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      const accent = [6, 182, 212];
      const primary = [0, 43, 91];
      // Header bar
      doc.setFillColor(...primary);
      doc.rect(0, 0, 210, 38, 'F');
      doc.setFillColor(...accent);
      doc.rect(0, 38, 210, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Optimype', 105, 18, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(t('payment.receipt.subtitle'), 105, 28, { align: 'center' });
      // Body
      let y = 52;
      const addRow = (label, value) => {
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(9);
        doc.text(label, 20, y);
        doc.setTextColor(12, 20, 69);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        const lines = doc.splitTextToSize(String(value || 'N/A'), 120);
        doc.text(lines, 190, y, { align: 'right' });
        doc.setFont('helvetica', 'normal');
        y += 6 * lines.length + 4;
        doc.setDrawColor(230, 230, 230);
        doc.line(20, y - 2, 190, y - 2);
      };
      addRow(t('payment.receipt.orderId'), orderData.id);
      addRow(t('payment.receipt.company'), orderData.company?.name);
      addRow(t('payment.receipt.user'), orderData.user?.phone);
      addRow(t('payment.receipt.details'), orderData.details);
      addRow(t('payment.receipt.amount'), `Bs. ${parseFloat(orderData.total_amount).toFixed(2)}`);
      addRow(t('payment.receipt.method'), metodoPago === 'qr' ? t('payment.receipt.methodQr') : t('payment.receipt.methodCrypto'));
      addRow(t('payment.receipt.status'), t('payment.receipt.statusCompleted'));
      addRow(t('payment.receipt.date'), new Date().toLocaleString());
      if (metodoPago === 'crypto') {
        const ca = getCryptoAccept();
        if (ca?.network) addRow(t('payment.receipt.network'), ca.network);
        const txH = orderData.metadata?.payment_response?.transaction || orderData.metadata?.transaction_hash;
        if (txH) addRow(t('payment.receipt.txHash'), txH);
      }
      // Footer
      doc.setFillColor(...accent);
      doc.rect(0, 280, 210, 17, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.text(t('payment.receipt.footer'), 105, 289, { align: 'center' });
      doc.save(`Optimype_Receipt_${orderData.id?.slice(0, 8) || 'order'}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setGeneratingPdf(false);
    }
  }, [orderData, metodoPago, t]);

  const renderQRSection = () => {
    const fiatAccept = getFiatAccept();
    const fiatAmount = fiatAccept?.amountRequired || orderData?.total_amount;
    const fiatCurrency = fiatAccept?.symbol || 'Bs.';
    const fiatTimeout = fiatAccept?.maxTimeoutSeconds || 900;

    if (qrData && (orderData.status === 'QR_SENT' || fiatAccept?.base64QrSimple)) {
      return (
        <>
          <div className="qr-placeholder">
            <img
              src={qrData}
              alt="Código QR de Pago"
              style={{ width: '200px', height: '200px' }}
            />
          </div>

          <div className="qr-expiry">
            <i className="fas fa-clock expiry-icon"></i>
            <span>{t('payment.qr.validFor')}: {Math.floor(fiatTimeout / 60)} {t('payment.qr.minutes')}</span>
          </div>


        </>
      );
    } else {
      return (
        <div className="qr-not-generated">
          <i className="fas fa-qrcode qr-placeholder-icon"></i>
          <p className="info-message">{t('payment.qr.available')}</p>
          <button
            className="btn-generate-qr"
            onClick={generateFiatQR}
            disabled={loading || orderData.status === 'COMPLETED'}
          >
            {loading
              ? <><span className="spinner-small"></span> {t('payment.loading')}</>
              : <><i className="fas fa-lock"></i> {t('payment.qr.showQr')}</>}
          </button>
        </div>
      );
    }
  };

  const renderCryptoSection = () => {
    const cryptoAccept = getCryptoAccept();
    const cryptoAmount = cryptoAccept?.amountRequired || cryptoAccept?.AmountRequired || cryptoAccept?.maxAmountRequired || orderData?.total_amount;
    const cryptoPayTo = cryptoAccept?.payTo || 'N/A';
    const cryptoNetwork = cryptoAccept?.network || 'avalanche-fuji';
    const cryptoAsset = cryptoAccept?.asset || 'N/A';
    const cryptoTimeout = cryptoAccept?.maxTimeoutSeconds || 300;

    return (
      <>
        <div className="wallet-connection-section">
          <h3 className="wallet-title">{t('payment.crypto.walletConnection')}</h3>
          <div className="connect-button-wrapper">
            <ConnectButton
              chainStatus="icon"
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>

          {isConnected && address && (
            <div className="wallet-info">
              <div className="wallet-connected-badge">
                <span className="status-dot"></span>
                <span>{t('payment.crypto.walletConnected')}</span>
              </div>
              <div className="wallet-address-display">
                <span className="address-label">{t('payment.crypto.yourAddress')}:</span>
                <span className="address-value">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              {balance && (
                <div className="wallet-balance-display">
                  <span className="balance-label">{t('payment.crypto.balance')}:</span>
                  <span className="balance-value">
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="crypto-info-box">
          <div className="info-row">
            <span className="info-label">{t('payment.crypto.network')}:</span>
            <span className="info-value">{cryptoNetwork}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('payment.crypto.contractAsset')}:</span>
            <span className="info-value" style={{ fontSize: '0.8em', wordBreak: 'break-all' }}>{cryptoAsset}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('payment.crypto.amount')}:</span>
            <span className="info-value">{cryptoAmount} {t('payment.crypto.tokens')}</span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('payment.crypto.timeout')}:</span>
            <span className="info-value">{Math.floor(cryptoTimeout / 60)} {t('payment.qr.minutes')}</span>
          </div>
        </div>

        {paymentStatus && (
          <div className="payment-status-box">
            <i className={`fas ${paymentProcessing ? 'fa-circle-notch fa-spin' : 'fa-circle-check'} status-indicator ${paymentProcessing ? 'processing' : 'completed'}`}></i>
            <p>{paymentStatus}</p>
          </div>
        )}

        <button
          className="btn-pagar-crypto"
          onClick={processCryptoPayment}
          disabled={!isConnected || paymentProcessing || orderData.status === 'COMPLETED'}
        >
          {paymentProcessing ? (
            <><span className="spinner-small"></span> {t('payment.crypto.processing')}</>
          ) : (
            <><i className="fas fa-coins"></i> {t('payment.crypto.payWithCrypto')}</>
          )}
        </button>



        <div className="crypto-advertencia">
          <i className="fas fa-triangle-exclamation"></i>
          <span>{t('payment.crypto.warning', { network: cryptoNetwork })}</span>
        </div>
      </>
    );
  };

  if (loading && !orderData) {
    return (
      <div className="pago-page">
        <FinisherBackgroundSafe className="pago-hero">
          <div className="container">
            <div className="controls-container">
              <ThemeLanguageToggle />
            </div>
            <div className="pago-card loading-card">
              <div className="loading-state">
                <div className="spinner"></div>
                <p>{t('payment.loading')}</p>
              </div>
            </div>
          </div>
        </FinisherBackgroundSafe>
      </div>
    );
  }

  if (error && !orderData) {
    return (
      <div className="pago-page">
        <FinisherBackgroundSafe className="pago-hero">
          <div className="container">
            <div className="controls-container">
              <ThemeLanguageToggle />
            </div>
            <div className="pago-card error-card">
              <div className="error-state">
                <i className="fas fa-circle-xmark" style={{fontSize:'2.5rem',color:'#c62828'}}></i>
                <h2>{t('payment.error')}</h2>
                <p>{error}</p>
                <button onClick={() => window.location.href = '/'} className="btn btn-primary">
                  {t('payment.backToHome')}
                </button>
              </div>
            </div>
          </div>
        </FinisherBackgroundSafe>
      </div>
    );
  }

  if (!orderData) return null;

  const statusIconClass = {
    COMPLETED: 'fa-circle-check',
    CART: 'fa-cart-shopping',
    AWAITING_QR: 'fa-hourglass-half',
    QR_SENT: 'fa-mobile-screen',
    VERIFYING_PAYMENT: 'fa-magnifying-glass',
    FAILED: 'fa-circle-xmark',
  };

  return (
    <div className="pago-page">
      <FinisherBackgroundSafe className="pago-hero">
        <div className="container">
          <div className="controls-container">
            <ThemeLanguageToggle />
          </div>
          <div className="hero-content">
            <img src="/OPTUSLOGO.png" alt="Optimype" className="hero-logo" />
            <h1>{t('payment.title')}</h1>
          </div>
        </div>
      </FinisherBackgroundSafe>

      {/* MERU-STYLE TWO-COLUMN LAYOUT */}
      <div className="pago-layout-wrapper">

        {/* LEFT: ORDER SUMMARY PANEL */}
        <aside className="pago-summary-panel">
          <div className="summary-panel-header">
            <i className="fas fa-receipt"></i>
            <span>{t('payment.orderInfo.title')}</span>
          </div>

          <div className="summary-panel-body">
            <div className="summary-info-row">
              <i className="fas fa-building summary-row-icon"></i>
              <div>
                <span className="sr-label">{t('payment.orderInfo.company')}</span>
                <span className="sr-value">{orderData.company?.name || 'N/A'}</span>
              </div>
            </div>
            <div className="summary-info-row">
              <i className="fas fa-user summary-row-icon"></i>
              <div>
                <span className="sr-label">{t('payment.orderInfo.user')}</span>
                <span className="sr-value">{orderData.user?.phone || 'N/A'}</span>
              </div>
            </div>
            <div className="summary-info-row">
              <i className="fas fa-hashtag summary-row-icon"></i>
              <div>
                <span className="sr-label">{t('payment.orderInfo.orderId')}</span>
                <span className="sr-value sr-mono">{orderData.id?.slice(0, 12)}…</span>
              </div>
            </div>
            <div className="summary-info-row">
              <i className="fas fa-file-lines summary-row-icon"></i>
              <div>
                <span className="sr-label">{t('payment.orderInfo.details')}</span>
                <span className="sr-value">{orderData.details || t('payment.orderInfo.noDetails')}</span>
              </div>
            </div>
          </div>

          <div className="summary-amount-block">
            <span className="sa-label">{t('payment.orderInfo.totalToPay')}</span>
            <span className="sa-value">Bs. {parseFloat(orderData.total_amount).toFixed(2)}</span>
          </div>

          <div className={`summary-status-chip status-${orderData.status}`}>
            <i className={`fas ${statusIconClass[orderData.status] || 'fa-circle-dot'}`}></i>
            <span>
              {orderData.status === 'COMPLETED' && t('payment.status.completed')}
              {orderData.status === 'CART' && t('payment.status.pending')}
              {orderData.status === 'AWAITING_QR' && t('payment.status.awaitingQr')}
              {orderData.status === 'QR_SENT' && t('payment.status.qrSent')}
              {orderData.status === 'VERIFYING_PAYMENT' && t('payment.status.verifying')}
              {orderData.status === 'FAILED' && t('payment.status.failed')}
            </span>
          </div>

          <div className="summary-secured">
            <i className="fas fa-shield-halved"></i>
            <span>{t('payment.securedBy')} Optimype</span>
          </div>
        </aside>

        {/* RIGHT: PAYMENT PANEL */}
        <main className="pago-payment-panel">

          {orderData.status === 'COMPLETED' ? (
            <div className="pago-completed-overlay">
              <div className="completed-checkmark">
                <i className="fas fa-circle-check"></i>
              </div>
              <h2 className="completed-title">{t('payment.completedTitle')}</h2>
              <p className="completed-subtitle">{t('payment.completedSubtitle')}</p>
              <button className="btn-download-pdf" onClick={generateReceipt} disabled={generatingPdf}>
                <i className="fas fa-file-pdf"></i>
                {generatingPdf ? t('payment.actions.generatingPdf') : t('payment.actions.downloadReceipt')}
              </button>
            </div>
          ) : (
            <>
              {/* METHOD TABS */}
              <div className="pago-method-tabs">
                <button
                  className={`pago-method-tab ${metodoPago === 'qr' ? 'active' : ''}`}
                  onClick={() => setMetodoPago('qr')}
                  disabled={orderData.status === 'COMPLETED'}
                >
                  <div className="pmt-icon">
                    <i className="fas fa-qrcode"></i>
                  </div>
                  <div className="pmt-info">
                    <span className="pmt-name">{t('payment.paymentMethods.qr.name')}</span>
                    <span className="pmt-desc">{t('payment.paymentMethods.qr.description')}</span>
                  </div>
                  {metodoPago === 'qr' && <i className="fas fa-circle-check pmt-check"></i>}
                </button>

                <button
                  className={`pago-method-tab ${metodoPago === 'crypto' ? 'active' : ''}`}
                  onClick={() => setMetodoPago('crypto')}
                  disabled={orderData.status === 'COMPLETED'}
                >
                  <div className="pmt-icon">
                    <i className="fas fa-coins"></i>
                  </div>
                  <div className="pmt-info">
                    <span className="pmt-name">{t('payment.paymentMethods.crypto.name')}</span>
                    <span className="pmt-desc">{t('payment.paymentMethods.crypto.description')}</span>
                  </div>
                  {metodoPago === 'crypto' && <i className="fas fa-circle-check pmt-check"></i>}
                </button>
              </div>

              {/* METHOD CONTENT */}
              <div className="pago-method-body">
                {metodoPago === 'qr' && (
                  <div className="qr-contenido">
                    {renderQRSection()}
                    <div className="pago-nota">
                      <i className="fas fa-circle-info nota-icon"></i>
                      <p className="nota-texto">{t('payment.qr.note')}</p>
                    </div>
                  </div>
                )}
                {metodoPago === 'crypto' && (
                  <div className="crypto-contenido">
                    {renderCryptoSection()}
                  </div>
                )}
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pago-footer">
                <button
                  className="btn btn-outline-danger"
                  onClick={cancelOrder}
                  disabled={loading || orderData.status === 'COMPLETED'}
                >
                  <i className="fas fa-xmark"></i>
                  {t('payment.actions.cancelOrder')}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={verifyPayment}
                  disabled={loading || orderData.status === 'COMPLETED' || orderData.status === 'CART'}
                >
                  {loading
                    ? <><span className="spinner-small"></span> {t('payment.actions.verifying')}</>
                    : <><i className="fas fa-circle-check"></i> {t('payment.actions.verifyPayment')}</>}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const Pago = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#06B6D4',
            accentColorForeground: 'white',
            borderRadius: 'large',
            fontStack: 'system',
          })}
          coolMode
        >
          <PagoContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Pago;