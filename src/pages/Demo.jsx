import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ThemeLanguageToggle from '../components/ui/ThemeLanguageToggle';
import './Demo.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://dot-revealable-telescopically.ngrok-free.dev';
const GOOGLE_AUTH_URL = `${API_BASE}/v1/auth/google`;
const WHATSAPP_SUPPORT_NUMBER = import.meta.env.VITE_WHATSAPP_SUPPORT || '59177379190';
const WA_URL = `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}`;

function buildSteps(t) {
  return [
    {
      id: 1,
      icon: 'fas fa-sign-in-alt',
      title: t('demo.steps.step1.title'),
      description: t('demo.steps.step1.description'),
      link: '/login',
      linkLabel: t('demo.steps.step1.cta'),
      external: false,
    },
    {
      id: 2,
      icon: 'fab fa-google',
      title: t('demo.steps.step2.title'),
      description: t('demo.steps.step2.description'),
      link: GOOGLE_AUTH_URL,
      linkLabel: t('demo.steps.step2.cta'),
      external: true,
    },
    {
      id: 3,
      icon: 'fab fa-whatsapp',
      title: t('demo.steps.step3.title'),
      description: t('demo.steps.step3.description'),
      link: WA_URL,
      linkLabel: t('demo.steps.step3.cta'),
      external: true,
    },
  ];
}

export default function Demo() {
  const { t } = useTranslation();
  const steps = buildSteps(t);

  return (
    <div className="demo-page">
      {/* Theme & Language toggle */}
      <div className="demo-toggle">
        <ThemeLanguageToggle />
      </div>

      {/* ── Header ────────────────────────────────────────── */}
      <header className="demo-header">
        <div className="demo-logo">
          <img src="/OPTUSLOGO.png" alt="Optimype" />
        </div>
        <h1 className="demo-title">
          {t('demo.titlePrefix')}{' '}
          <span>{t('demo.titleHighlight')}</span>
        </h1>
        <p className="demo-subtitle">{t('demo.subtitle')}</p>
      </header>

      {/* ── Timeline ──────────────────────────────────────── */}
      <section className="demo-timeline-section">
        <div className="timeline">
          <div className="timeline-line" />

          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`timeline-container ${index % 2 === 0 ? 'left' : 'right'}`}
            >
              <div className="content">
                <span className="step-badge">
                  {t('demo.step')} {step.id}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>

                {step.external ? (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="step-cta"
                  >
                    <i className={step.icon} />
                    {step.linkLabel}
                  </a>
                ) : (
                  <Link to={step.link} className="step-cta">
                    <i className={step.icon} />
                    {step.linkLabel}
                  </Link>
                )}
              </div>

              {/* Central circle with icon */}
              <div className="circle">
                <i className={`${step.icon} circle-icon`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Video Demo ────────────────────────────────────── */}
      <section className="demo-video-section">
        <h2 className="demo-video-title">{t('demo.videoTitle')}</h2>
        <p className="demo-video-subtitle">{t('demo.videoSubtitle')}</p>
        <div className="demo-video-wrapper">
          <video
            className="demo-video"
            controls
            preload="metadata"
          >
            <source src="/optus_demo.mp4" type="video/mp4" />
            {t('demo.videoFallback')}
          </video>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="demo-footer">
        <p>{t('demo.footer')}</p>
      </footer>
    </div>
  );
}
