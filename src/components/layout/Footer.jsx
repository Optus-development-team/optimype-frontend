import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer className="footer" id="contact">
            <div className="container footer-content">
                <div className="footer-col">
                    <Link to="/" className="logo footer-logo-area">
                        {t('footer.company')}
                    </Link>
                    <p>{t('footer.description')}</p>
                    <p className="footer-parent">
                        {t('footer.parent')}{' '}
                        <a href="https://optus.lat" target="_blank" rel="noopener noreferrer">optus.lat</a>
                    </p>
                    <div className="social-links">
                        <a href="https://www.facebook.com/share/1Ce4TjnxRU/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label={t('footer.social', { network: 'Facebook' })}>
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="https://x.com/OptusAut" target="_blank" rel="noopener noreferrer" aria-label={t('footer.social', { network: 'X' })}>
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://www.instagram.com/optusaut/" target="_blank" rel="noopener noreferrer" aria-label={t('footer.social', { network: 'Instagram' })}>
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>
                <div className="footer-col">
                    <h5>{t('footer.sections.company')}</h5>
                    <ul>
                        <li><Link to="/nosotros">{t('footer.links.aboutUs')}</Link></li>
                        <li><Link to="/portafolio">{t('footer.links.successCases')}</Link></li>
                        <li><Link to="/">{t('footer.links.testimonials')}</Link></li>
                        <li><Link to="/">{t('footer.links.careers')}</Link></li>
                        <li><Link to="/faq">{t('footer.links.faq')}</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h5>{t('footer.sections.services')}</h5>
                    <ul>
                        <li><Link to="/servicios">{t('footer.links.automation')}</Link></li>
                        <li><Link to="/servicios">{t('footer.links.aiAgents')}</Link></li>
                        <li><Link to="/servicios">{t('footer.links.integrations')}</Link></li>
                        <li><Link to="/servicios">{t('footer.links.consulting')}</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h5>{t('footer.sections.contact')}</h5>
                    <p>{t('footer.contact.location')}</p>
                    <p>{t('footer.contact.email')}</p>
                    <p>{t('footer.contact.phone')}</p>
                </div>

                <div className="footer-col">
                    <h5>{t('footer.sections.ecosystem')}</h5>
                    <ul>
                        <li><a href="https://optus.lat" target="_blank" rel="noopener noreferrer">{t('footer.ecosystem.optus')}</a></li>
                        <li><a href="https://optipagos.optus.lat" target="_blank" rel="noopener noreferrer">{t('footer.ecosystem.optipagos')}</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h5>{t('footer.sections.legal')}</h5>
                    <ul>
                        <li><Link to="/politica-privacidad">{t('footer.legal.privacy')}</Link></li>
                        <li><Link to="/terminos-servicio">{t('footer.legal.terms')}</Link></li>
                        <li><Link to="/eliminar">{t('footer.legal.deleteInfo')}</Link></li>
                    </ul>
                </div>
            </div>
            <div className="container footer-bottom">
                <p>&copy; 2026 {t('footer.company')}. {t('footer.rights')}</p>
            </div>
        </footer>
    );
};

export default Footer;
