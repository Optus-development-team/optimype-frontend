# Optimype · frontend

El sitio de **Optimype** ([optimype.optus.lat](https://optimype.optus.lat)): agentes de IA que
atienden, venden, agendan y cobran por WhatsApp para MYPES y startups. Optimype es una marca
perteneciente a [Optus](https://optus.lat).

> Este repositorio se llamaba `optus-frontend` y se publicaba en `optus.lat`. Ese dominio es ahora
> el sitio de la empresa (`optus-main-frontend`); este proyecto pasó a ser el de Optimype. De
> momento conserva el logotipo y la estética visual que ya tenía.

| Dirección | Qué es | Repositorio |
| --- | --- | --- |
| `https://optimype.optus.lat` | Este sitio | `optimype-frontend` |
| `https://optus.lat` | Optus, la empresa | `optus-main-frontend` |
| `https://optipagos.optus.lat` | Optipagos, billetera en WhatsApp | `optipagos-frontend` |

## Puesta en marcha

Requisitos: Node ≥ 20.

```bash
npm install
cp .env.example .env     # completa los valores (ver más abajo)
npm run dev              # http://localhost:5173
npm run build            # genera dist/
npm run preview          # sirve dist/ en local
npm run lint
```

### Variables de entorno

Todas empiezan por `VITE_` y quedan incluidas en el JavaScript público: no pongas secretos.

| Variable | Para qué |
| --- | --- |
| `VITE_PRIVY_APP_ID` | Inicio de sesión con Privy. **Obligatoria**: sin ella la aplicación no arranca. |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Panel y página de pago (clave `anon`, nunca `service_role`). |
| `VITE_API_URL` | Backend (registro, inicio de sesión, demo). |
| `VITE_WALLETCONNECT_PROJECT_ID` | Billeteras en la página de pago (RainbowKit). |
| `VITE_WHATSAPP_SUPPORT` | Número de WhatsApp de contacto, sin `+` ni espacios. |
| `VITE_DEMO_COMPANY_ID`, `VITE_DEMO_COMPANY_NAME` | Empresa de demostración del panel. |

Al cambiar de dominio hay que autorizar `https://optimype.optus.lat` en los servicios que validan
el origen: Privy (dominios permitidos), Google OAuth (orígenes y redirecciones) y Supabase Auth
(URL del sitio y redirecciones).

## Estructura

```
index.html               metadatos (SEO, Open Graph) y fuentes
src/App.jsx              rutas
src/i18n.js              idiomas (i18next)
src/locales/             textos: es.json y en.json
src/pages/               páginas (inicio, servicios, FAQ, acceso, pago, panel, legales…)
src/components/layout/   cabecera y pie
src/components/sections/ secciones de la portada
src/components/dashboard/ panel de administración
src/styles/              variables de color y estilos globales
public/                  logotipo, vídeos y fuentes
```

Rutas principales: `/`, `/nosotros`, `/servicios`, `/portafolio`, `/beneficios`, `/faq`,
`/login`, `/dashboard`, `/pago/:codigoOrden`, `/demo`, `/introductions`, `/politica-privacidad`,
`/terminos-servicio` y `/eliminar`.

## Idiomas

El sitio está en **español** (por defecto) e **inglés**, con `i18next` y `react-i18next`.

- Los textos viven en `src/locales/es.json` y `src/locales/en.json`, con las mismas claves.
- El idioma se detecta en este orden: el elegido antes (guardado en `localStorage`), el del
  navegador y, si no es ninguno de los dos admitidos, español.
- `src/i18n.js` mantiene al día `<html lang>`, el título de la pestaña y la descripción.
- En un componente: `const { t } = useTranslation();` y `t('seccion.clave')`.
- Para añadir un idioma: crea `src/locales/<código>.json`, regístralo en `src/i18n.js`
  (`resources` y `SUPPORTED_LANGUAGES`) y añádelo a `src/components/ui/LanguageSwitcher.jsx`.

## Identidad

Colores, tipografías y componentes están descritos en [`OPTUS_BRANDKIT.md`](OPTUS_BRANDKIT.md)
(el nombre del archivo viene de cuando este era el sitio de Optus): azul marino `#002B5B`, cian
`#06B6D4`, Lilita One y Titan One para títulos y Molengo para el texto.

## Despliegue

Vercel, proyecto `optimype-frontend`, con el dominio `optimype.optus.lat` (`mypes.optus.lat`
redirige a él). Es un sitio estático: `npm run build` genera `dist/`.

```bash
vercel --prod
```

## Contacto

Optus · La Paz, Bolivia · optus.aut@gmail.com
