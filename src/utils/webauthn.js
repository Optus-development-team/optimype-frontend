// WebAuthn (passkeys): la huella del teléfono firma el reto de la orden.
// Los datos biométricos nunca salen del dispositivo; solo viaja la firma.

const toBytes = (base64url) => {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '==='.slice((base64.length + 3) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

const toBase64Url = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const descriptors = (credentials = []) =>
  credentials.map((c) => ({
    type: 'public-key',
    id: toBytes(c.id),
    ...(c.transports?.length ? { transports: c.transports } : {}),
  }));

export const isWebAuthnSupported = () =>
  typeof window !== 'undefined' && Boolean(window.PublicKeyCredential && navigator.credentials);

export async function hasPlatformAuthenticator() {
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

/** Registra la huella del dispositivo (passkey) del administrador. */
export async function createPasskey(options) {
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge: toBytes(options.challenge),
      rp: { name: options.rp.name, id: window.location.hostname },
      user: {
        id: toBytes(options.user.id),
        name: options.user.name,
        displayName: options.user.displayName,
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      excludeCredentials: descriptors(options.allowCredentials),
      attestation: 'none',
      timeout: options.timeoutMs,
    },
  });
  const response = credential.response;
  const publicKey = response.getPublicKey?.();
  if (!publicKey) {
    throw Object.assign(new Error('Tu navegador no permite registrar la huella. Actualízalo e inténtalo de nuevo.'), {
      name: 'UnsupportedBrowser',
    });
  }
  return {
    credentialId: toBase64Url(credential.rawId),
    clientDataJSON: toBase64Url(response.clientDataJSON),
    publicKey: toBase64Url(publicKey),
    publicKeyAlgorithm: response.getPublicKeyAlgorithm(),
    ...(response.getAuthenticatorData
      ? { authenticatorData: toBase64Url(response.getAuthenticatorData()) }
      : {}),
    transports: response.getTransports?.() ?? [],
  };
}

/** Firma el reto de la orden con la huella registrada. */
export async function signWithPasskey(options) {
  const credential = await navigator.credentials.get({
    publicKey: {
      challenge: toBytes(options.challenge),
      rpId: window.location.hostname,
      allowCredentials: descriptors(options.allowCredentials),
      userVerification: 'required',
      timeout: options.timeoutMs,
    },
  });
  const response = credential.response;
  return {
    credentialId: toBase64Url(credential.rawId),
    clientDataJSON: toBase64Url(response.clientDataJSON),
    authenticatorData: toBase64Url(response.authenticatorData),
    signature: toBase64Url(response.signature),
  };
}
