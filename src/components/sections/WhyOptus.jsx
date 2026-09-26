import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import WhatsAppDemo from './WhatsAppDemo';
import './WhyOptus.css';

const WhyOptus = () => {
  const [activeDemo, setActiveDemo] = useState(0);
  const { t } = useTranslation();

  const liveDemo = [
    {
      id: 1,
      time: '09:23 AM',
      customer: t('demo.customers.maria'),
      message: t('demo.messages.productAvailable'),
      agent: 'OPTUS Bot',
      response: t('demo.responses.productResponse'),
      action: t('demo.actions.instantResponse'),
      color: '#6C5CE7'
    },
    {
      id: 2,
      time: '10:45 AM',
      customer: t('demo.customers.carlos'),
      message: t('demo.messages.scheduleAppointment'),
      agent: 'OPTUS Scheduler',
      response: t('demo.responses.scheduleResponse'),
      action: t('demo.actions.autoScheduling'),
      color: '#00D9A5'
    },
    {
      id: 3,
      time: '02:15 PM',
      customer: t('demo.customers.ana'),
      message: t('demo.messages.confirmOrder'),
      agent: 'OPTUS Payments',
      response: t('demo.responses.paymentResponse'),
      action: t('demo.actions.automatedPayment'),
      color: '#FF6B6B'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemo((prev) => (prev + 1) % liveDemo.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { value: '3 seg', label: t('whyOptus.metrics.responseTime'), icon: 'fas fa-bolt' },
    { value: '24/7', label: t('whyOptus.metrics.availability'), icon: 'fas fa-clock' },
    { value: '∞', label: t('whyOptus.metrics.conversations'), icon: 'fas fa-users' },
    { value: '99.9%', label: t('whyOptus.metrics.precision'), icon: 'fas fa-check-circle' }
  ];

  const problems = [
    {
      title: t('whyOptus.problems.night.question'),
      solution: t('whyOptus.problems.night.solution'),
      icon: 'fas fa-moon',
      stat: t('whyOptus.problems.night.stat')
    },
    {
      title: t('whyOptus.problems.payment.question'),
      solution: t('whyOptus.problems.payment.solution'),
      icon: 'fas fa-money-bill-wave',
      stat: t('whyOptus.problems.payment.stat')
    },
    {
      title: t('whyOptus.problems.team.question'),
      solution: t('whyOptus.problems.team.solution'),
      icon: 'fas fa-chart-line',
      stat: t('whyOptus.problems.team.stat')
    }
  ];

  return (
    <section className="why-optus">
      {/* Live Demo Section */}
      <div className="live-demo-section">
        <div className="container">
          <h2 data-aos="fade-up">
            <span className="live-indicator"> {t('whyOptus.liveTitle')}</span> {t('whyOptus.liveSubtitle')}
          </h2>
          <p className="demo-subtitle" data-aos="fade-up" data-aos-delay="100">
            {t('whyOptus.demoSubtitle')}
          </p>

          <div className="demo-container" data-aos="zoom-in" data-aos-delay="200">
            <WhatsAppDemo />
          </div>

          {/* Metrics */}
          <div className="metrics-grid" data-aos="fade-up" data-aos-delay="300">
            {metrics.map((metric, index) => (
              <div key={index} className="metric-card">
                <i className={metric.icon}></i>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problems & Solutions */}
      <div className="problems-section">
        <div className="container">
          <h2 className="text-center" data-aos="fade-up">
            {t('whyOptus.problems.title')}
          </h2>
          <p className="section-subtitle text-center" data-aos="fade-up" data-aos-delay="100">
            {t('whyOptus.problems.subtitle')}
          </p>

          <div className="problems-grid">
            {problems.map((problem, index) => (
              <div 
                key={index} 
                className="problem-card"
                data-aos="flip-left"
                data-aos-delay={index * 100}
              >
                <div className="problem-front">
                  <div className="problem-icon">
                    <i className={problem.icon}></i>
                  </div>
                  <h3>{problem.title}</h3>
                  <div className="problem-stat">{problem.stat}</div>
                </div>
                <div className="problem-back">
                  <div className="solution-icon">
                    <i className="fas fa-magic"></i>
                  </div>
                  <h3>{problem.solution}</h3>
                  <a href="#contact" className="btn btn-sm btn-primary">{t('whyOptus.problems.solveNow')}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Before & After Transformation */}
      <div className="transformation-section">
        <div className="container">
          <h2 className="text-center" data-aos="fade-up">
            {t('whyOptus.transformation.title')} <span className="gradient-text">{t('whyOptus.transformation.beforeAfter')}</span> {t('whyOptus.transformation.ofOptus')}
          </h2>
          <p className="section-subtitle text-center" data-aos="fade-up" data-aos-delay="100">
            {t('whyOptus.transformation.subtitle')}
          </p>

          <div className="comparison-slider" data-aos="zoom-in" data-aos-delay="200">
            <div className="before-section">
              <div className="section-header">
                <span className="badge-negative">{t('whyOptus.transformation.without')}</span>
              </div>
              <div className="timeline-items">
                <div className="timeline-item negative">
                  <div className="time">08:00 AM</div>
                  <div className="content">
                    <i className="fas fa-coffee"></i>
                    <p>{t('whyOptus.transformation.before.morning')}</p>
                  </div>
                </div>
                <div className="timeline-item negative">
                  <div className="time">10:30 AM</div>
                  <div className="content">
                    <i className="fas fa-tired"></i>
                    <p>{t('whyOptus.transformation.before.midMorning')}</p>
                  </div>
                </div>
                <div className="timeline-item negative">
                  <div className="time">02:00 PM</div>
                  <div className="content">
                    <i className="fas fa-phone-slash"></i>
                    <p>{t('whyOptus.transformation.before.afternoon')}</p>
                  </div>
                </div>
                <div className="timeline-item negative">
                  <div className="time">06:00 PM</div>
                  <div className="content">
                    <i className="fas fa-frown"></i>
                    <p>{t('whyOptus.transformation.before.evening')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="vs-divider">
              <div className="vs-circle">VS</div>
            </div>

            <div className="after-section">
              <div className="section-header">
                <span className="badge-positive">{t('whyOptus.transformation.with')}</span>
              </div>
              <div className="timeline-items">
                <div className="timeline-item positive">
                  <div className="time">08:00 AM</div>
                  <div className="content">
                    <i className="fas fa-smile"></i>
                    <p>{t('whyOptus.transformation.after.morning')}</p>
                  </div>
                </div>
                <div className="timeline-item positive">
                  <div className="time">10:30 AM</div>
                  <div className="content">
                    <i className="fas fa-chart-line"></i>
                    <p>{t('whyOptus.transformation.after.midMorning')}</p>
                  </div>
                </div>
                <div className="timeline-item positive">
                  <div className="time">02:00 PM</div>
                  <div className="content">
                    <i className="fas fa-bell"></i>
                    <p>{t('whyOptus.transformation.after.afternoon')}</p>
                  </div>
                </div>
                <div className="timeline-item positive">
                  <div className="time">06:00 PM</div>
                  <div className="content">
                    <i className="fas fa-glass-cheers"></i>
                    <p>{t('whyOptus.transformation.after.evening')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="transformation-stats" data-aos="fade-up" data-aos-delay="300">
            <div className="stat-item">
              <div className="stat-info">
                <div className="stat-number">20+ hrs</div>
                <div className="stat-label">{t('whyOptus.transformation.stats.timeSaved')}</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-info">
                <div className="stat-number">3x</div>
                <div className="stat-label">{t('whyOptus.transformation.stats.moreSales')}</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-info">
                <div className="stat-number">95%</div>
                <div className="stat-label">{t('whyOptus.transformation.stats.lessStress')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Ticker
      <div className="social-proof-section">
        <div className="container">
          <h2 className="text-center" data-aos="fade-up">
            {t('whyOptus.socialProof.title')} <span className="live-pulse">🔴</span>
          </h2>
          <p className="section-subtitle text-center" data-aos="fade-up" data-aos-delay="100">
            {t('whyOptus.socialProof.subtitle')}
          </p>

          <div className="activity-feed" data-aos="fade-up" data-aos-delay="200">
            <div className="feed-item">
              <div className="feed-icon success">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="feed-content">
                <strong>TechStore La Paz</strong> {t('whyOptus.socialProof.feed.techStore')}
                <span className="feed-time">{t('whyOptus.socialProof.times.minutes2')}</span>
              </div>
            </div>
            <div className="feed-item">
              <div className="feed-icon info">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="feed-content">
                <strong>Clínica Salud Total</strong> {t('whyOptus.socialProof.feed.clinic')}
                <span className="feed-time">{t('whyOptus.socialProof.times.minutes15')}</span>
              </div>
            </div>
            <div className="feed-item">
              <div className="feed-icon success">
                <i className="fas fa-money-check"></i>
              </div>
              <div className="feed-content">
                <strong>RestauranteGourmet</strong> {t('whyOptus.socialProof.feed.restaurant')}
                <span className="feed-time">{t('whyOptus.socialProof.times.minutes28')}</span>
              </div>
            </div>
            <div className="feed-item">
              <div className="feed-icon warning">
                <i className="fas fa-comments"></i>
              </div>
              <div className="feed-content">
                <strong>Moda Bella</strong> {t('whyOptus.socialProof.feed.fashion')}
                <span className="feed-time">{t('whyOptus.socialProof.times.hour1')}</span>
              </div>
            </div>
            <div className="feed-item">
              <div className="feed-icon info">
                <i className="fas fa-user-plus"></i>
              </div>
              <div className="feed-content">
                <strong>InmobiliariaTop</strong> {t('whyOptus.socialProof.feed.realEstate')}
                <span className="feed-time">{t('whyOptus.socialProof.times.hours2')}</span>
              </div>
            </div>
          </div>

          <div className="proof-numbers" data-aos="fade-up" data-aos-delay="300">
            <div className="proof-item">
              <div className="proof-number counter">1,247</div>
              <div className="proof-label">{t('whyOptus.socialProof.numbers.messagesProcessed')}</div>
            </div>
            <div className="proof-item">
              <div className="proof-number counter">86</div>
              <div className="proof-label">{t('whyOptus.socialProof.numbers.salesClosed')}</div>
            </div>
            <div className="proof-item">
              <div className="proof-number counter">342</div>
              <div className="proof-label">{t('whyOptus.socialProof.numbers.appointmentsScheduled')}</div>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Interactive CTA
      <div className="interactive-cta">
        <div className="container">
          <div className="cta-content" data-aos="zoom-in">
            <div className="cta-text">
              <h2>{t('whyOptus.cta.title')}</h2>
              <p>{t('whyOptus.cta.subtitle')}</p>
              <div className="cta-features">
                <span><i className="fas fa-check"></i> {t('whyOptus.cta.features.demo')}</span>
                <span><i className="fas fa-check"></i> {t('whyOptus.cta.features.setup')}</span>
                <span><i className="fas fa-check"></i> {t('whyOptus.cta.features.support')}</span>
              </div>
            </div>
            <div className="cta-buttons">
              <a href="#contact" className="btn btn-primary btn-lg pulse">
                <i className="fab fa-whatsapp"></i> {t('whyOptus.cta.startNow')}
              </a>
              <a href="/servicios" className="btn btn-outline btn-lg">
                {t('whyOptus.cta.viewPlans')}
              </a>
            </div>
          </div>
        </div>
      </div>
      */}
    </section>
  );
};

export default WhyOptus;
