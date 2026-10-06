import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import './Login.css';

const API_BASE = import.meta.env.VITE_API_URL || 'https://dot-revealable-telescopically.ngrok-free.dev';

const AUTH_ENDPOINTS = {
  login: '/auth/login-email',
  registerJoin: '/auth/register-join-company',
  registerCreate: '/auth/register-create-company',
  verifyEmail: '/auth/verify-email',
  resendVerification: '/auth/resend-verification',
};

// `value` is what the API stores; `key` picks the label shown in the active language
const INDUSTRY_OPTIONS = [
  { value: 'Tecnología', key: 'technology' },
  { value: 'Retail', key: 'retail' },
  { value: 'Servicios', key: 'services' },
  { value: 'Alimentos y bebidas', key: 'food' },
  { value: 'Salud', key: 'health' },
  { value: 'Logística', key: 'logistics' },
  { value: 'Educación', key: 'education' },
  { value: 'Otro', key: 'other' },
];
const COMPANY_SIZE_OPTIONS = ['1-10', '11-50', '51-200', '200+'];
const TIME_ZONE_OPTIONS = ['America/La_Paz', 'UTC-04:00', 'UTC'];
const CURRENCY_OPTIONS = ['BOB', 'USD', 'EUR'];

const INITIAL_FORM = {
  email: '',
  password: '',
  fullName: '',
  phone: '',
  companyCode: '',
  companyName: '',
  companySlug: '',
  industry: '',
  size: '',
  timeZone: 'America/La_Paz',
  currency: 'BOB',
  acceptTerms: false,
};

const getInitialFlow = (searchParams) => {
  const flow = searchParams.get('flow');
  return flow === 'login' || flow === 'join' || flow === 'create' ? flow : null;
};

const trimOrEmpty = (value) => value.trim();

const trimOrUndefined = (value) => {
  const trimmed = trimOrEmpty(value);
  return trimmed ? trimmed : undefined;
};

const requestJson = async (endpoint, body) => {
  const requestWithEndpoint = async (path) => fetch(`${API_BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let response;
  let data = {};

  try {
    response = await requestWithEndpoint(endpoint);
  } catch (networkError) {
    if (!endpoint.startsWith('/auth/')) {
      throw networkError;
    }

    response = await requestWithEndpoint(`/v1${endpoint}`);
  }

  data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || i18n.t('auth.errors.request'));
  }

  return data;
};

const buildUserPayload = (formData) => {
  const payload = {
    email: trimOrEmpty(formData.email),
    password: formData.password,
    fullName: trimOrEmpty(formData.fullName),
  };

  const phone = trimOrUndefined(formData.phone);
  if (phone) payload.phone = phone;

  return payload;
};

const buildCompanyPayload = (formData) => {
  const payload = {
    companyName: trimOrEmpty(formData.companyName),
    industry: trimOrEmpty(formData.industry),
    size: trimOrEmpty(formData.size),
    timeZone: trimOrEmpty(formData.timeZone),
    currency: trimOrEmpty(formData.currency),
  };

  const companySlug = trimOrUndefined(formData.companySlug);
  if (companySlug) payload.companySlug = companySlug;

  return payload;
};

const getDisplayMessage = (data, fallback) => data?.message || data?.detail || fallback;

const FormField = ({ label, name, type = 'text', value, onChange, placeholder, required = false, autoComplete }) => (
  <label className="auth-field" htmlFor={name}>
    <span className="auth-label">{label}</span>
    <input
      id={name}
      name={name}
      className="auth-input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
    />
  </label>
);

const SelectField = ({ label, name, value, onChange, children, required = false }) => (
  <label className="auth-field" htmlFor={name}>
    <span className="auth-label">{label}</span>
    <select
      id={name}
      name={name}
      className="auth-input auth-select"
      value={value}
      onChange={onChange}
      required={required}
    >
      {children}
    </select>
  </label>
);

const ChoiceStep = ({ onChooseFlow, onLogin }) => {
  const { t } = useTranslation();

  return (
  <div className="login-step welcome-step">
    <div className="login-logo-wrapper">
      <img src="/OPTUSLOGO.png" alt="Optimype" className="login-logo-img" />
    </div>

    <div className="login-welcome-text">
      <h1 className="login-title">{t('auth.choice.titlePrefix')} <span className="accent-text">Optimype</span></h1>
    </div>

    <div className="login-divider" />

    <div className="auth-choice-grid">
      <button type="button" className="auth-choice-card" onClick={() => onChooseFlow('join')}>
        <span className="auth-choice-tag">{t('auth.choice.tag')}</span>
        <strong>{t('auth.choice.joinTitle')}</strong>
        <span>{t('auth.choice.joinText')}</span>
      </button>

      <button type="button" className="auth-choice-card" onClick={() => onChooseFlow('create')}>
        <span className="auth-choice-tag">{t('auth.choice.tag')}</span>
        <strong>{t('auth.choice.createTitle')}</strong>
        <span>{t('auth.choice.createText')}</span>
      </button>
    </div>

    <button type="button" className="btn-text-action" onClick={onLogin}>{t('auth.choice.haveAccount')}</button>

  </div>
  );
};

const AuthFormStep = ({ flow, formData, loading, error, onChange, onSubmit, onBack }) => {
  const isLogin = flow === 'login';
  const isJoin = flow === 'join';
  const isCreate = flow === 'create';
  const { t } = useTranslation();

  return (
    <div className="login-step auth-form-step">
      <div className="step-icon-wrapper">
        <i className="fas fa-lock step-icon" />
      </div>

      <h2 className="step-title">
        {t(`auth.form.titles.${flow}`)}
      </h2>

      <p className="step-subtitle">
        {t(`auth.form.subtitles.${flow}`)}
      </p>

      {error && (
        <div className="login-error">
          <i className="fas fa-exclamation-circle" /> {error}
        </div>
      )}

      <form className="auth-form" onSubmit={onSubmit}>
        {!isLogin && (
          <div className="form-section">
            <div className="form-section-title">{t('auth.form.sections.user')}</div>
            <div className="field-grid">
              <FormField
                label={t('auth.form.fields.fullName.label')}
                name="fullName"
                value={formData.fullName}
                onChange={onChange}
                placeholder={t('auth.form.fields.fullName.placeholder')}
                required
                autoComplete="name"
              />
              <FormField
                label={t('auth.form.fields.phone.label')}
                name="phone"
                value={formData.phone}
                onChange={onChange}
                placeholder="70000000"
                autoComplete="tel"
              />
            </div>
          </div>
        )}

        <div className="form-section">
          <div className="form-section-title">{t('auth.form.sections.access')}</div>
          <div className="field-grid">
            <FormField
              label={t('auth.form.fields.email.label')}
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              placeholder={t('auth.form.fields.email.placeholder')}
              required
              autoComplete="email"
            />
            <FormField
              label={t('auth.form.fields.password.label')}
              name="password"
              type="password"
              value={formData.password}
              onChange={onChange}
              placeholder="••••••••"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>
        </div>

        {isJoin && (
          <div className="form-section">
            <div className="form-section-title">{t('auth.form.sections.company')}</div>
            <FormField
              label={t('auth.form.fields.companyCode.label')}
              name="companyCode"
              value={formData.companyCode}
              onChange={onChange}
              placeholder={t('auth.form.fields.companyCode.placeholder')}
              required
            />
          </div>
        )}

        {isCreate && (
          <div className="form-section">
            <div className="form-section-title">{t('auth.form.sections.company')}</div>
            <div className="field-grid">
              <FormField
                label={t('auth.form.fields.companyName.label')}
                name="companyName"
                value={formData.companyName}
                onChange={onChange}
                placeholder={t('auth.form.fields.companyName.placeholder')}
                required
              />
              <FormField
                label={t('auth.form.fields.companySlug.label')}
                name="companySlug"
                value={formData.companySlug}
                onChange={onChange}
                placeholder={t('auth.form.fields.companySlug.placeholder')}
              />
              <SelectField
                label={t('auth.form.fields.industry.label')}
                name="industry"
                value={formData.industry}
                onChange={onChange}
                required
              >
                <option value="" disabled>{t('auth.form.fields.industry.placeholder')}</option>
                {INDUSTRY_OPTIONS.map((option) => <option key={option.key} value={option.value}>{t(`auth.form.industries.${option.key}`)}</option>)}
              </SelectField>
              <SelectField
                label={t('auth.form.fields.size.label')}
                name="size"
                value={formData.size}
                onChange={onChange}
                required
              >
                <option value="" disabled>{t('auth.form.fields.size.placeholder')}</option>
                {COMPANY_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </SelectField>
              <SelectField
                label={t('auth.form.fields.timeZone.label')}
                name="timeZone"
                value={formData.timeZone}
                onChange={onChange}
                required
              >
                {TIME_ZONE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </SelectField>
              <SelectField
                label={t('auth.form.fields.currency.label')}
                name="currency"
                value={formData.currency}
                onChange={onChange}
                required
              >
                {CURRENCY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </SelectField>
            </div>
          </div>
        )}

        {!isLogin && (
          <label className="terms-row" htmlFor="acceptTerms">
            <input id="acceptTerms" name="acceptTerms" type="checkbox" checked={formData.acceptTerms} onChange={onChange} />
            <span>{t('auth.form.terms')}</span>
          </label>
        )}

        <button className="btn-login-primary" type="submit" disabled={loading}>
          {loading ? (
            <><i className="fas fa-spinner fa-spin" /> {t('auth.form.processing')}</>
          ) : (
            <>
              <i className="fas fa-arrow-right" />
              {t(`auth.form.submit.${flow}`)}
            </>
          )}
        </button>
      </form>

      <button type="button" className="btn-back-step" onClick={onBack}>
        <i className="fas fa-arrow-left" /> {t('auth.back')}
      </button>
    </div>
  );
};

const VerificationStep = ({ email, token, loading, error, message, onTokenChange, onVerify, onResend, onBack }) => {
  const { t } = useTranslation();

  return (
  <div className="login-step auth-form-step">
    <div className="step-icon-wrapper success">
      <i className="fas fa-envelope-open-text step-icon" />
    </div>

    <h2 className="step-title">{t('auth.verify.title')}</h2>
    <p className="step-subtitle">
      {t('auth.verify.sentBefore')} <strong>{email || t('auth.verify.fallbackEmail')}</strong>. {t('auth.verify.sentAfter')}
    </p>

    {message && (
      <div className="login-success">
        <i className="fas fa-circle-check" /> {message}
      </div>
    )}

    {error && (
      <div className="login-error">
        <i className="fas fa-exclamation-circle" /> {error}
      </div>
    )}

    <form className="auth-form" onSubmit={onVerify}>
      <FormField
        label={t('auth.verify.tokenLabel')}
        name="verificationToken"
        value={token}
        onChange={onTokenChange}
        placeholder={t('auth.verify.tokenPlaceholder')}
        required
        autoComplete="one-time-code"
      />

      <div className="verification-actions">
        <button className="btn-login-primary" type="submit" disabled={loading}>
          {loading ? (
            <><i className="fas fa-spinner fa-spin" /> {t('auth.verify.verifying')}</>
          ) : (
            <><i className="fas fa-shield-halved" /> {t('auth.verify.submit')}</>
          )}
        </button>

        <button className="btn-secondary-action" type="button" onClick={onResend} disabled={loading}>
          <i className="fas fa-rotate-right" /> {t('auth.verify.resend')}
        </button>
      </div>
    </form>

    <button type="button" className="btn-back-step" onClick={onBack}>
      <i className="fas fa-arrow-left" /> {t('auth.verify.backToForm')}
    </button>
  </div>
  );
};

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialFlow = getInitialFlow(searchParams);
  const [flow, setFlow] = useState(initialFlow);
  const [step, setStep] = useState(initialFlow ? 'form' : 'choice');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlFlow = getInitialFlow(searchParams);
    const urlStep = searchParams.get('step');
    const urlEmail = searchParams.get('email');

    if (urlFlow) {
      setFlow(urlFlow);
      setStep('form');
    }

    if (urlStep === 'verify') {
      setStep('verify');
    }

    if (urlEmail) {
      setFormData((current) => ({ ...current, email: urlEmail }));
      setVerificationEmail(urlEmail);
    }
  }, [searchParams]);

  const handleChange = useCallback((event) => {
    const { name, type, checked, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleChooseFlow = useCallback((nextFlow) => {
    setFlow(nextFlow);
    setStep('form');
    setError('');
    setMessage('');
  }, []);

  const handleLogin = useCallback(() => {
    setFlow('login');
    setStep('form');
    setError('');
    setMessage('');
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (flow !== 'login' && !formData.acceptTerms) {
      setError(t('auth.errors.terms'));
      return;
    }

    if (flow !== 'login' && !trimOrEmpty(formData.fullName)) {
      setError(t('auth.errors.fullName'));
      return;
    }

    if (flow === 'join' && !trimOrEmpty(formData.companyCode)) {
      setError(t('auth.errors.companyCode'));
      return;
    }

    if (flow === 'create' && (!trimOrEmpty(formData.companyName) || !trimOrEmpty(formData.industry) || !trimOrEmpty(formData.size))) {
      setError(t('auth.errors.company'));
      return;
    }

    setLoading(true);

    try {
      if (flow === 'login') {
        const data = await requestJson(AUTH_ENDPOINTS.login, {
          email: trimOrEmpty(formData.email),
          password: formData.password,
        });

        const requiresVerification = Boolean(data.requiresVerification || data.needsVerification || data.verificationRequired);

        if (requiresVerification) {
          setVerificationEmail(data.email || trimOrEmpty(formData.email));
          setVerificationToken('');
          setStep('verify');
          setMessage(getDisplayMessage(data, t('auth.messages.needsVerification')));
          return;
        }

        navigate(data.redirectTo || data.redirect || '/dashboard', { replace: true });
        return;
      }

      if (flow === 'join') {
        const data = await requestJson(AUTH_ENDPOINTS.registerJoin, {
          user: buildUserPayload(formData),
          companyCode: trimOrEmpty(formData.companyCode),
          acceptTerms: formData.acceptTerms,
        });

        setVerificationEmail(data.email || trimOrEmpty(formData.email));
        setVerificationToken('');
        setStep('verify');
        setMessage(getDisplayMessage(data, t('auth.messages.checkEmail')));
        return;
      }

      if (flow === 'create') {
        const data = await requestJson(AUTH_ENDPOINTS.registerCreate, {
          user: buildUserPayload(formData),
          company: buildCompanyPayload(formData),
          acceptTerms: formData.acceptTerms,
        });

        setVerificationEmail(data.email || trimOrEmpty(formData.email));
        setVerificationToken('');
        setStep('verify');
        setMessage(getDisplayMessage(data, t('auth.messages.companyCreated')));
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }, [flow, formData, navigate, t]);

  const handleVerify = useCallback(async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await requestJson(AUTH_ENDPOINTS.verifyEmail, {
        token: trimOrEmpty(verificationToken),
      });

      navigate(data.redirectTo || data.redirect || '/dashboard', { replace: true });
    } catch (verifyError) {
      setError(verifyError.message);
    } finally {
      setLoading(false);
    }
  }, [navigate, verificationToken]);

  const handleResend = useCallback(async () => {
    if (!verificationEmail) {
      setError(t('auth.errors.noEmail'));
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await requestJson(AUTH_ENDPOINTS.resendVerification, {
        email: verificationEmail,
      });

      setMessage(getDisplayMessage(data, t('auth.messages.tokenSent')));
    } catch (resendError) {
      setError(resendError.message);
    } finally {
      setLoading(false);
    }
  }, [verificationEmail, t]);

  const handleBack = useCallback(() => {
    setError('');
    setMessage('');

    if (step === 'verify') {
      setStep('form');
      return;
    }

    setFlow(null);
    setStep('choice');
  }, [step]);

  const handleBackToChoice = useCallback(() => {
    setFlow(null);
    setStep('choice');
    setError('');
    setMessage('');
  }, []);

  const progressSteps = ['choice', 'form', 'verify'];

  return (
    <div className="login-page">
      <button className="btn-back" onClick={() => navigate('/')} aria-label={t('auth.backHomeAria')}>
        <i className="fas fa-arrow-left" />
        {t('auth.back')}
      </button>

      {step !== 'choice' && (
        <div className="step-progress" aria-label={t('auth.progressAria')}>
          {progressSteps.map((currentStep) => {
            const currentIndex = progressSteps.indexOf(step);
            const stepIndex = progressSteps.indexOf(currentStep);
            const stepClass = step === currentStep ? 'active' : currentIndex > stepIndex ? 'done' : '';

            return <div key={currentStep} className={`step-dot ${stepClass}`} />;
          })}
        </div>
      )}

      <div className="login-card">
        <div className="card-logo">
          <img src="/OPTUSLOGO.png" alt="Optimype" className="card-logo-img" />
        </div>

        {step === 'choice' && <ChoiceStep onChooseFlow={handleChooseFlow} onLogin={handleLogin} />}

        {step === 'form' && flow && (
          <AuthFormStep
            flow={flow}
            formData={formData}
            loading={loading}
            error={error}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onBack={handleBackToChoice}
          />
        )}

        {step === 'verify' && (
          <VerificationStep
            email={verificationEmail}
            token={verificationToken}
            loading={loading}
            error={error}
            message={message}
            onTokenChange={(event) => setVerificationToken(event.target.value)}
            onVerify={handleVerify}
            onResend={handleResend}
            onBack={handleBack}
          />
        )}
      </div>

      <p className="login-footer-brand">© {new Date().getFullYear()} Optimype · {t('auth.footer')}</p>
    </div>
  );
};

export default Login;