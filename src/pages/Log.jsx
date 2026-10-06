import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Log.css';

const Log = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí irá la lógica de autenticación
  };

  return (
    <div className="log-container">
      <div className="log-card">
        <div className="log-header">
          <h1 className="log-title">{t('log.title')}</h1>
          <p className="log-subtitle">{t('log.subtitle')}</p>
        </div>

        <form className="log-form" onSubmit={handleSubmit}>
          <div className="log-form-group">
            <label htmlFor="email" className="log-label">
              {t('log.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="log-input"
              placeholder={t('log.emailPlaceholder')}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="log-form-group">
            <label htmlFor="password" className="log-label">
              {t('log.password')}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="log-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="log-options">
            <label className="log-remember">
              <input type="checkbox" className="log-checkbox" />
              <span>{t('log.remember')}</span>
            </label>
            <a href="#" className="log-forgot">
              {t('log.forgot')}
            </a>
          </div>

          <button type="submit" className="log-button">
            {t('log.submit')}
          </button>
        </form>

        <div className="log-footer">
          <p className="log-register-text">
            {t('log.noAccount')}{' '}
            <a href="#" className="log-register-link">
              {t('log.register')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Log;
